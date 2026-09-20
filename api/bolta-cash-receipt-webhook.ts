import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ensureCashReceiptSchema,
  failureFrom,
  getPool,
  hasWebhookAccess,
  parseRequestBody,
  stringValue,
  type CashReceiptStatus,
} from "./_cashReceipt.js";

export const config = { runtime: "nodejs" };

type WebhookData = {
  issuanceKey?: unknown;
  originalIssuanceKey?: unknown;
  cashReceiptApprovalNumber?: unknown;
  cause?: unknown;
};

function allowedEvent(eventType: string): boolean {
  return [
    "CASH_RECEIPT_ISSUED",
    "CASH_RECEIPT_ISSUE_FAILED",
    "CASH_RECEIPT_CANCELED",
    "CASH_RECEIPT_CANCEL_FAILED",
    "CASH_RECEIPT_EXTERNALLY_CANCELED",
  ].indexOf(eventType) >= 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }
  if (!hasWebhookAccess(req)) {
    res.status(401).json({ ok: false });
    return;
  }

  try {
    const body = parseRequestBody(req);
    const eventType = stringValue(body.eventType, 80);
    const data = body.data && typeof body.data === "object" ? body.data as WebhookData : {};
    const issuanceKey = stringValue(data.issuanceKey, 200);
    const originalIssuanceKey = stringValue(data.originalIssuanceKey, 200);
    if (!allowedEvent(eventType) || !issuanceKey) {
      res.status(400).json({ ok: false });
      return;
    }

    const eventKey = `${eventType}:${issuanceKey}`;
    const client = await getPool().connect();
    try {
      await ensureCashReceiptSchema(client);
      await client.query("BEGIN");
      const recorded = await client.query(
        `INSERT INTO cash_receipt_webhook_events (event_key, event_type, issuance_key)
         VALUES ($1, $2, $3)
         ON CONFLICT (event_key) DO NOTHING
         RETURNING event_key`,
        [eventKey, eventType, issuanceKey]
      );
      if (recorded.rows.length === 0) {
        await client.query("COMMIT");
        res.status(200).json({ ok: true, duplicate: true });
        return;
      }

      const approvalNumber = stringValue(data.cashReceiptApprovalNumber, 100) || null;
      const failure = failureFrom({ cause: data.cause });
      let status: CashReceiptStatus;
      if (eventType === "CASH_RECEIPT_ISSUED") status = "ISSUED";
      else if (eventType === "CASH_RECEIPT_ISSUE_FAILED") status = "ISSUE_FAILED";
      else if (eventType === "CASH_RECEIPT_CANCELED") status = "CANCELED";
      else if (eventType === "CASH_RECEIPT_CANCEL_FAILED") status = "CANCEL_FAILED";
      else status = "EXTERNALLY_CANCELED";

      await client.query(
        `UPDATE cash_receipts
         SET status = $2,
             cash_receipt_approval_number = COALESCE($3, cash_receipt_approval_number),
             failure_code = COALESCE($4, failure_code),
             failure_message = COALESCE($5, failure_message),
             finalized_at = COALESCE(finalized_at, now())
         WHERE bolta_issuance_key = $1`,
        [issuanceKey, status, approvalNumber, failure.code, failure.message]
      );

      if (eventType === "CASH_RECEIPT_CANCELED" && originalIssuanceKey) {
        await client.query(
          `UPDATE cash_receipts
           SET status = 'CANCELED', finalized_at = COALESCE(finalized_at, now())
           WHERE bolta_issuance_key = $1 AND kind = 'ISSUE'`,
          [originalIssuanceKey]
        );
      }
      if (eventType === "CASH_RECEIPT_EXTERNALLY_CANCELED") {
        await client.query(
          `UPDATE cash_receipts
           SET status = 'EXTERNALLY_CANCELED', finalized_at = COALESCE(finalized_at, now())
           WHERE bolta_issuance_key = $1 AND kind = 'ISSUE'`,
          [issuanceKey]
        );
      }

      await client.query("COMMIT");
      res.status(200).json({ ok: true });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Cash receipt webhook error:", error instanceof Error ? error.message : "unknown");
    res.status(500).json({ ok: false });
  }
}
