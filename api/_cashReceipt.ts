import crypto from "node:crypto";
import pg from "pg";
import type { VercelRequest } from "@vercel/node";

const { Pool } = pg;
type PoolClient = pg.PoolClient;

type ReceiptMode = "test" | "live";
type ReceiptKind = "ISSUE" | "CANCELLATION";
type RecipientType = "SELF" | "PHONE" | "BUSINESS_REGISTRATION_NUMBER";

export type CashReceiptStatus =
  | "PENDING"
  | "REQUEST_SUCCESS"
  | "ISSUED"
  | "REQUEST_FAILURE"
  | "ISSUE_FAILED"
  | "CANCEL_FAILED"
  | "CANCELED"
  | "EXTERNALLY_CANCELED";

export type IssueInput = {
  mstSeq: string;
  dtlSeq: string;
  custSeq: string;
  requestedBy: string;
  itemName: string;
  recipient: {
    type: RecipientType;
    value?: string;
  };
  amount: {
    supplyAmount: number;
    vatAmount: number;
    taxFreeAmount: number;
  };
};

export type ReceiptRow = {
  id: number;
  booking_key: string;
  mst_seq: string;
  dtl_seq: string;
  cust_seq: string;
  kind: ReceiptKind;
  mode: ReceiptMode;
  status: CashReceiptStatus;
  client_reference_id: string;
  bolta_issuance_key: string | null;
  original_issuance_key: string | null;
  item_name: string | null;
  recipient_type: RecipientType | null;
  recipient_masked: string | null;
  supply_amount: string | number | null;
  vat_amount: string | number | null;
  tax_free_amount: string | number | null;
  cash_receipt_approval_number: string | null;
  failure_code: string | null;
  failure_message: string | null;
  requested_by: string | null;
  requested_at: string;
  finalized_at: string | null;
};

let pool: pg.Pool | null = null;

function valueFromHeader(req: VercelRequest, name: string): string {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export function sameSecret(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function hasCashReceiptAdminAccess(req: VercelRequest): boolean {
  return sameSecret(
    valueFromHeader(req, "x-inus-cash-receipt-secret"),
    process.env.CASH_RECEIPT_ADMIN_SECRET || ""
  );
}

export function hasWebhookAccess(req: VercelRequest): boolean {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  return sameSecret(token, process.env.BOLTA_WEBHOOK_TOKEN || "");
}

export function parseRequestBody(req: VercelRequest): Record<string, unknown> {
  if (typeof req.body === "string") return JSON.parse(req.body) as Record<string, unknown>;
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  return {};
}

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not configured");
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
      max: 3,
      connectionTimeoutMillis: 8000,
    });
  }
  return pool;
}

export async function ensureCashReceiptSchema(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS cash_receipt_booking_locks (
      booking_key TEXT PRIMARY KEY,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS cash_receipts (
      id BIGSERIAL PRIMARY KEY,
      booking_key TEXT NOT NULL,
      mst_seq TEXT NOT NULL,
      dtl_seq TEXT NOT NULL,
      cust_seq TEXT NOT NULL,
      kind TEXT NOT NULL,
      mode TEXT NOT NULL,
      status TEXT NOT NULL,
      client_reference_id TEXT NOT NULL UNIQUE,
      bolta_issuance_key TEXT UNIQUE,
      original_issuance_key TEXT,
      item_name TEXT,
      recipient_type TEXT,
      recipient_masked TEXT,
      supply_amount BIGINT,
      vat_amount BIGINT,
      tax_free_amount BIGINT,
      cash_receipt_approval_number TEXT,
      failure_code TEXT,
      failure_message TEXT,
      requested_by TEXT,
      requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      finalized_at TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS cash_receipts_booking_idx
      ON cash_receipts (booking_key, id DESC);
    CREATE INDEX IF NOT EXISTS cash_receipts_issuance_idx
      ON cash_receipts (bolta_issuance_key);

    CREATE TABLE IF NOT EXISTS cash_receipt_webhook_events (
      event_key TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      issuance_key TEXT NOT NULL,
      received_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export function stringValue(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function onlyDigits(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

function requiredSequence(value: unknown, label: string): string {
  const result = stringValue(value, 40);
  if (!/^[0-9]+$/.test(result)) throw new Error(`${label} 정보가 올바르지 않습니다.`);
  return result;
}

function requiredAmount(value: unknown, label: string): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(numberValue) || numberValue < 0 || numberValue > 9999999999) {
    throw new Error(`${label}을(를) 정확한 금액으로 입력해주세요.`);
  }
  return numberValue;
}

export function validateIssueInput(body: Record<string, unknown>): IssueInput {
  const recipientRecord = body.recipient && typeof body.recipient === "object"
    ? body.recipient as Record<string, unknown>
    : {};
  const amountRecord = body.amount && typeof body.amount === "object"
    ? body.amount as Record<string, unknown>
    : {};

  const type = stringValue(recipientRecord.type, 40) as RecipientType;
  if (type !== "SELF" && type !== "PHONE" && type !== "BUSINESS_REGISTRATION_NUMBER") {
    throw new Error("현금영수증 발급 유형을 선택해주세요.");
  }

  let recipientValue = "";
  if (type === "PHONE") {
    const phoneDigits = onlyDigits(stringValue(recipientRecord.value, 30));
    if (!/^010[0-9]{8}$/.test(phoneDigits)) {
      throw new Error("휴대폰번호는 010으로 시작하는 11자리 번호를 입력해주세요.");
    }
    recipientValue = `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 7)}-${phoneDigits.slice(7, 11)}`;
  }
  if (type === "BUSINESS_REGISTRATION_NUMBER") {
    recipientValue = onlyDigits(stringValue(recipientRecord.value, 20));
    if (!/^[0-9]{10}$/.test(recipientValue)) {
      throw new Error("사업자등록번호 10자리를 입력해주세요.");
    }
  }

  const supplyAmount = requiredAmount(amountRecord.supplyAmount, "공급가액");
  const vatAmount = requiredAmount(amountRecord.vatAmount, "부가세");
  const taxFreeAmount = requiredAmount(amountRecord.taxFreeAmount, "면세금액");
  if (supplyAmount + vatAmount + taxFreeAmount <= 0) {
    throw new Error("현금영수증 총액은 0원보다 커야 합니다.");
  }

  const itemName = stringValue(body.itemName, 100);
  if (!itemName) throw new Error("품목명을 입력해주세요.");

  return {
    mstSeq: requiredSequence(body.mstSeq, "행사"),
    dtlSeq: requiredSequence(body.dtlSeq, "상세 행사"),
    custSeq: requiredSequence(body.custSeq, "고객"),
    requestedBy: stringValue(body.requestedBy, 100) || "admin",
    itemName,
    recipient: type === "SELF" ? { type } : { type, value: recipientValue },
    amount: { supplyAmount, vatAmount, taxFreeAmount },
  };
}

export function bookingKey(input: Pick<IssueInput, "mstSeq" | "dtlSeq" | "custSeq">): string {
  return `${input.mstSeq}:${input.dtlSeq}:${input.custSeq}`;
}

export function maskRecipient(type: RecipientType, value?: string): string {
  if (type === "SELF") return "자진발급";
  if (!value) return "";
  if (type === "PHONE") return `${value.slice(0, 8)}****`;
  return `${value.slice(0, 3)}-**-*****`;
}

export function currentMode(): ReceiptMode {
  const requested = process.env.CASH_RECEIPT_MODE || "test";
  if (requested === "live") {
    if (process.env.BOLTA_ALLOW_LIVE_ISSUANCE !== "true") {
      throw new Error("실제 발행은 아직 활성화되지 않았습니다.");
    }
    return "live";
  }
  return "test";
}

export function boltaApiKey(mode: ReceiptMode): string {
  const key = mode === "live" ? process.env.BOLTA_LIVE_API_KEY : process.env.BOLTA_TEST_API_KEY;
  if (!key) throw new Error(mode === "live" ? "운영 API 키가 설정되지 않았습니다." : "테스트 API 키가 설정되지 않았습니다.");
  if (mode === "test" && !key.startsWith("test_")) throw new Error("테스트 API 키 형식이 올바르지 않습니다.");
  if (mode === "live" && !key.startsWith("live_")) throw new Error("운영 API 키 형식이 올바르지 않습니다.");
  return key;
}

export function boltaIssuer(): Record<string, string> {
  const businessRegistrationNumber = onlyDigits(process.env.BOLTA_ISSUER_BUSINESS_NUMBER || "");
  const organizationName = stringValue(process.env.BOLTA_ISSUER_ORGANIZATION_NAME, 20);
  const representativeName = stringValue(process.env.BOLTA_ISSUER_REPRESENTATIVE_NAME, 10);
  const telephone = stringValue(process.env.BOLTA_ISSUER_TELEPHONE, 30);
  if (!/^[0-9]{10}$/.test(businessRegistrationNumber) || !organizationName || !representativeName || !telephone) {
    throw new Error("발급자 정보 환경변수가 완전히 설정되지 않았습니다.");
  }
  return { businessRegistrationNumber, organizationName, representativeName, telephone };
}

export function makeReference(mode: ReceiptMode, prefix: "I" | "C", booking: string): string {
  const compactBooking = booking.replace(/[^0-9]/g, "").slice(0, 50) || "0";
  const random = crypto.randomBytes(5).toString("hex");
  return `CR-${mode}-${prefix}-${compactBooking}-${Date.now()}-${random}`;
}

export function basicAuthorization(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`, "utf8").toString("base64")}`;
}

export async function boltaFetch(
  path: string,
  options: { method: "GET" | "POST"; referenceId?: string; body?: Record<string, unknown>; mode: ReceiptMode }
): Promise<{ ok: boolean; httpStatus: number; data: Record<string, unknown>; message: string }> {
  const apiKey = boltaApiKey(options.mode);
  const headers: Record<string, string> = {
    Authorization: basicAuthorization(apiKey),
    Accept: "application/json",
  };
  if (options.referenceId) headers["Bolta-Client-Reference-Id"] = options.referenceId;
  if (options.body) headers["Content-Type"] = "application/json";

  const response = await fetch(`https://xapi.bolta.io${path}`, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });

  let data: Record<string, unknown> = {};
  try {
    const parsed = await response.json();
    if (parsed && typeof parsed === "object") data = parsed as Record<string, unknown>;
  } catch {
    // 응답 본문은 저장하거나 노출하지 않는다. 개인·세무 정보가 포함될 수 있다.
  }

  const errorRecord = data.error && typeof data.error === "object" ? data.error as Record<string, unknown> : {};
  const message = stringValue(data.message, 300) || stringValue(errorRecord.message, 300) || "볼타 요청을 처리하지 못했습니다.";
  return { ok: response.ok, httpStatus: response.status, data, message };
}

export async function acquireBookingLock(client: PoolClient, key: string): Promise<void> {
  await client.query(
    `INSERT INTO cash_receipt_booking_locks (booking_key, updated_at)
     VALUES ($1, now())
     ON CONFLICT (booking_key) DO UPDATE SET updated_at = now()`,
    [key]
  );
  await client.query(`SELECT booking_key FROM cash_receipt_booking_locks WHERE booking_key = $1 FOR UPDATE`, [key]);
}

export function serializeReceipt(row: ReceiptRow): Record<string, unknown> {
  return {
    id: Number(row.id),
    kind: row.kind,
    mode: row.mode,
    status: row.status,
    clientReferenceId: row.client_reference_id,
    issuanceKey: row.bolta_issuance_key,
    originalIssuanceKey: row.original_issuance_key,
    itemName: row.item_name,
    recipientType: row.recipient_type,
    recipientMasked: row.recipient_masked,
    supplyAmount: row.supply_amount === null ? null : Number(row.supply_amount),
    vatAmount: row.vat_amount === null ? null : Number(row.vat_amount),
    taxFreeAmount: row.tax_free_amount === null ? null : Number(row.tax_free_amount),
    approvalNumber: row.cash_receipt_approval_number,
    failureCode: row.failure_code,
    failureMessage: row.failure_message,
    requestedBy: row.requested_by,
    requestedAt: row.requested_at,
    finalizedAt: row.finalized_at,
  };
}

export function isActiveIssueStatus(status: string): boolean {
  return status === "PENDING" || status === "REQUEST_SUCCESS" || status === "ISSUED";
}

export function isActiveCancellationStatus(status: string): boolean {
  return status === "PENDING" || status === "REQUEST_SUCCESS" || status === "CANCELED";
}

export function failureFrom(data: Record<string, unknown>): { code: string | null; message: string | null } {
  const source = data.failure && typeof data.failure === "object"
    ? data.failure as Record<string, unknown>
    : data.cause && typeof data.cause === "object"
      ? data.cause as Record<string, unknown>
      : {};
  return {
    code: stringValue(source.code, 100) || null,
    message: stringValue(source.message, 500) || null,
  };
}
