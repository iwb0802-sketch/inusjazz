import type { PoolClient } from "pg";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  acquireBookingLock,
  boltaFetch,
  boltaIssuer,
  bookingKey,
  currentMode,
  ensureCashReceiptSchema,
  failureFrom,
  getPool,
  hasCashReceiptAdminAccess,
  isActiveCancellationStatus,
  isActiveIssueStatus,
  makeReference,
  maskRecipient,
  parseRequestBody,
  serializeReceipt,
  stringValue,
  validateIssueInput,
  type CashReceiptStatus,
  type ReceiptRow,
} from "./_cashReceipt.js";

export const config = { runtime: "nodejs" };

function queryString(req: VercelRequest, key: string): string {
  const value = req.query[key];
  return Array.isArray(value) ? value[0] || "" : typeof value === "string" ? value : "";
}

function validateBookingQuery(req: VercelRequest): { mstSeq: string; dtlSeq: string; custSeq: string; key: string } {
  const mstSeq = queryString(req, "mstSeq").trim();
  const dtlSeq = queryString(req, "dtlSeq").trim();
  const custSeq = queryString(req, "custSeq").trim();
  if (!/^[0-9]+$/.test(mstSeq) || !/^[0-9]+$/.test(dtlSeq) || !/^[0-9]+$/.test(custSeq)) {
    throw new Error("행사 식별 정보가 올바르지 않습니다.");
  }
  return { mstSeq, dtlSeq, custSeq, key: `${mstSeq}:${dtlSeq}:${custSeq}` };
}

function normalizeStatus(value: unknown): CashReceiptStatus | null {
  const status = stringValue(value, 40);
  const allowed: CashReceiptStatus[] = [
    "PENDING", "REQUEST_SUCCESS", "ISSUED", "REQUEST_FAILURE", "ISSUE_FAILED",
    "CANCEL_FAILED", "CANCELED", "EXTERNALLY_CANCELED",
  ];
  return allowed.indexOf(status as CashReceiptStatus) >= 0 ? status as CashReceiptStatus : null;
}

async function receiptRows(client: PoolClient, key: string): Promise<ReceiptRow[]> {
  const result = await client.query(
    `SELECT * FROM cash_receipts WHERE booking_key = $1 ORDER BY id DESC`,
    [key]
  );
  return result.rows as ReceiptRow[];
}

async function updateKnownFailure(
  client: PoolClient,
  id: number,
  status: CashReceiptStatus,
  code: string | null,
  message: string | null
): Promise<void> {
  await client.query(
    `UPDATE cash_receipts
     SET status = $2, failure_code = $3, failure_message = $4, finalized_at = now()
     WHERE id = $1`,
    [id, status, code, message]
  );
}

async function refreshRow(
  client: PoolClient,
  row: ReceiptRow
): Promise<void> {
  if (!row.client_reference_id || (row.status !== "PENDING" && row.status !== "REQUEST_SUCCESS")) return;

  const outcome = await boltaFetch(
    `/v1/cashReceipts/status?clientReferenceId=${encodeURIComponent(row.client_reference_id)}`,
    { method: "GET", mode: row.mode }
  );
  if (!outcome.ok) return;

  const status = normalizeStatus(outcome.data.status);
  if (!status) return;
  const failure = failureFrom(outcome.data);
  const approvalNumber = stringValue(outcome.data.cashReceiptApprovalNumber, 100) || null;
  const finalized = status === "ISSUED" || status === "CANCELED" || status === "EXTERNALLY_CANCELED" || status === "ISSUE_FAILED" || status === "CANCEL_FAILED" || status === "REQUEST_FAILURE";

  await client.query(
    `UPDATE cash_receipts
     SET status = $2,
         cash_receipt_approval_number = COALESCE($3, cash_receipt_approval_number),
         failure_code = COALESCE($4, failure_code),
         failure_message = COALESCE($5, failure_message),
         finalized_at = CASE WHEN $6 THEN COALESCE(finalized_at, now()) ELSE finalized_at END
     WHERE id = $1`,
    [row.id, status, approvalNumber, failure.code, failure.message, finalized]
  );

  if (row.kind === "CANCELLATION" && status === "CANCELED" && row.original_issuance_key) {
    await client.query(
      `UPDATE cash_receipts
       SET status = 'CANCELED', finalized_at = COALESCE(finalized_at, now())
       WHERE bolta_issuance_key = $1 AND kind = 'ISSUE'`,
      [row.original_issuance_key]
    );
  }
}

async function listAndRefresh(client: PoolClient, key: string): Promise<ReceiptRow[]> {
  const before = await receiptRows(client, key);
  for (const row of before) await refreshRow(client, row);
  return receiptRows(client, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (!hasCashReceiptAdminAccess(req)) {
    res.status(401).json({ ok: false, message: "관리자 연동 권한이 없습니다." });
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ ok: false, message: "GET 또는 POST 요청만 가능합니다." });
    return;
  }

  let client: PoolClient | null = null;
  try {
    client = await getPool().connect();
    await ensureCashReceiptSchema(client);

    if (req.method === "GET") {
      const booking = validateBookingQuery(req);
      const rows = await listAndRefresh(client, booking.key);
      res.status(200).json({
        ok: true,
        mode: currentMode(),
        receipts: rows.map(serializeReceipt),
      });
      return;
    }

    const body = parseRequestBody(req);
    const action = stringValue(body.action, 30);
    if (action !== "issue" && action !== "cancel") {
      res.status(400).json({ ok: false, message: "처리 종류가 올바르지 않습니다." });
      return;
    }

    if (action === "issue") {
      const input = validateIssueInput(body);
      const key = bookingKey(input);
      const mode = currentMode();
      const referenceId = makeReference(mode, "I", key);

      await client.query("BEGIN");
      try {
        await acquireBookingLock(client, key);
        const existingRows = await receiptRows(client, key);
        const active = existingRows.find((row) => row.kind === "ISSUE" && isActiveIssueStatus(row.status));
        if (active) {
          await client.query("ROLLBACK");
          res.status(409).json({ ok: false, message: "이미 발행 요청 또는 발행 완료된 현금영수증이 있습니다. 상태를 먼저 확인해주세요.", receipt: serializeReceipt(active) });
          return;
        }

        const insert = await client.query(
          `INSERT INTO cash_receipts (
             booking_key, mst_seq, dtl_seq, cust_seq, kind, mode, status, client_reference_id,
             item_name, recipient_type, recipient_masked, supply_amount, vat_amount, tax_free_amount, requested_by
           ) VALUES ($1, $2, $3, $4, 'ISSUE', $5, 'PENDING', $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING *`,
          [
            key, input.mstSeq, input.dtlSeq, input.custSeq, mode, referenceId,
            input.itemName, input.recipient.type, maskRecipient(input.recipient.type, input.recipient.value),
            input.amount.supplyAmount, input.amount.vatAmount, input.amount.taxFreeAmount, input.requestedBy,
          ]
        );
        const created = insert.rows[0] as ReceiptRow;

        let outcome;
        try {
          outcome = await boltaFetch("/v1/cashReceipts", {
            method: "POST",
            referenceId,
            mode,
            body: {
              itemName: input.itemName,
              issuer: boltaIssuer(),
              recipient: input.recipient,
              amount: input.amount,
            },
          });
        } catch (error) {
          await client.query("COMMIT");
          res.status(202).json({
            ok: true,
            pending: true,
            message: "요청 연결 상태를 확정할 수 없어 중복 발행을 막기 위해 접수 대기 상태로 저장했습니다. 잠시 후 상태를 다시 확인해주세요.",
            receipt: serializeReceipt(created),
          });
          return;
        }

        const issuanceKey = stringValue(outcome.data.issuanceKey, 200) || null;
        if (!outcome.ok || !issuanceKey) {
          const failure = failureFrom(outcome.data);
          await updateKnownFailure(client, created.id, "REQUEST_FAILURE", failure.code, failure.message || outcome.message);
          const failedResult = await client.query(`SELECT * FROM cash_receipts WHERE id = $1`, [created.id]);
          await client.query("COMMIT");
          res.status(422).json({ ok: false, message: failure.message || outcome.message, receipt: serializeReceipt(failedResult.rows[0] as ReceiptRow) });
          return;
        }

        await client.query(`UPDATE cash_receipts SET bolta_issuance_key = $2, status = 'PENDING' WHERE id = $1`, [created.id, issuanceKey]);
        const saved = await client.query(`SELECT * FROM cash_receipts WHERE id = $1`, [created.id]);
        await client.query("COMMIT");
        res.status(202).json({
          ok: true,
          pending: true,
          message: "테스트 현금영수증 발행 요청을 접수했습니다. 최종 결과는 자동으로 갱신됩니다.",
          receipt: serializeReceipt(saved.rows[0] as ReceiptRow),
        });
        return;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    const mstSeq = stringValue(body.mstSeq, 40);
    const dtlSeq = stringValue(body.dtlSeq, 40);
    const custSeq = stringValue(body.custSeq, 40);
    const requestedBy = stringValue(body.requestedBy, 100) || "admin";
    if (!/^[0-9]+$/.test(mstSeq) || !/^[0-9]+$/.test(dtlSeq) || !/^[0-9]+$/.test(custSeq)) {
      res.status(400).json({ ok: false, message: "행사 식별 정보가 올바르지 않습니다." });
      return;
    }
    const key = `${mstSeq}:${dtlSeq}:${custSeq}`;

    await client.query("BEGIN");
    try {
      await acquireBookingLock(client, key);
      const rows = await receiptRows(client, key);
      const original = rows.find((row) => row.kind === "ISSUE" && row.status === "ISSUED" && row.bolta_issuance_key);
      const pendingCancel = rows.find((row) => row.kind === "CANCELLATION" && isActiveCancellationStatus(row.status));
      if (!original) {
        await client.query("ROLLBACK");
        res.status(409).json({ ok: false, message: "취소할 발행 완료 현금영수증이 없습니다." });
        return;
      }
      if (pendingCancel) {
        await client.query("ROLLBACK");
        res.status(409).json({ ok: false, message: "이미 취소 요청 또는 취소 완료된 현금영수증이 있습니다.", receipt: serializeReceipt(pendingCancel) });
        return;
      }

      const mode = original.mode;
      const referenceId = makeReference(mode, "C", key);
      const insert = await client.query(
        `INSERT INTO cash_receipts (
           booking_key, mst_seq, dtl_seq, cust_seq, kind, mode, status, client_reference_id,
           original_issuance_key, requested_by
         ) VALUES ($1, $2, $3, $4, 'CANCELLATION', $5, 'PENDING', $6, $7, $8)
         RETURNING *`,
        [key, mstSeq, dtlSeq, custSeq, mode, referenceId, original.bolta_issuance_key, requestedBy]
      );
      const created = insert.rows[0] as ReceiptRow;

      let outcome;
      try {
        outcome = await boltaFetch(`/v1/cashReceipts/${encodeURIComponent(original.bolta_issuance_key || "")}/cancellation`, {
          method: "POST",
          referenceId,
          mode,
        });
      } catch {
        await client.query("COMMIT");
        res.status(202).json({
          ok: true,
          pending: true,
          message: "취소 요청 연결 상태를 확정할 수 없어 중복 취소를 막기 위해 접수 대기 상태로 저장했습니다. 잠시 후 상태를 다시 확인해주세요.",
          receipt: serializeReceipt(created),
        });
        return;
      }

      const issuanceKey = stringValue(outcome.data.issuanceKey, 200) || null;
      if (!outcome.ok || !issuanceKey) {
        const failure = failureFrom(outcome.data);
        await updateKnownFailure(client, created.id, "CANCEL_FAILED", failure.code, failure.message || outcome.message);
        const failedResult = await client.query(`SELECT * FROM cash_receipts WHERE id = $1`, [created.id]);
        await client.query("COMMIT");
        res.status(422).json({ ok: false, message: failure.message || outcome.message, receipt: serializeReceipt(failedResult.rows[0] as ReceiptRow) });
        return;
      }

      await client.query(`UPDATE cash_receipts SET bolta_issuance_key = $2 WHERE id = $1`, [created.id, issuanceKey]);
      const saved = await client.query(`SELECT * FROM cash_receipts WHERE id = $1`, [created.id]);
      await client.query("COMMIT");
      res.status(202).json({
        ok: true,
        pending: true,
        message: "테스트 현금영수증 취소 요청을 접수했습니다. 최종 결과는 자동으로 갱신됩니다.",
        receipt: serializeReceipt(saved.rows[0] as ReceiptRow),
      });
      return;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Cash receipt API error:", error instanceof Error ? error.message : "unknown");
    res.status(500).json({ ok: false, message: error instanceof Error ? error.message : "현금영수증 처리 중 오류가 발생했습니다." });
  } finally {
    client?.release();
  }
}
