import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool, ensureSchema, rolloverIfNeeded } from "./_contestDb.js";
import { monthLabel } from "../shared/contestMonth.js";

export const config = {
  runtime: "nodejs",
};

/**
 * GET /api/champions
 * 월별 결과 아카이브: 지금까지 확정된 "이달의 VOTE ON VOICE" 챔피언 목록 (최신순).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!process.env.DATABASE_URL) {
    res.status(503).json({ error: "DATABASE_URL not configured yet" });
    return;
  }

  let client;
  try {
    const pool = getPool();
    client = await pool.connect();
  } catch (err) {
    console.error("champions API DB connect error:", err);
    res.status(500).json({ error: "DB connect failed" });
    return;
  }

  try {
    await ensureSchema(client);
    await rolloverIfNeeded(client);

    const rows = (
      await client.query(
        `SELECT month_stamp, contestant_name, hearts FROM champions ORDER BY month_stamp DESC LIMIT 24`
      )
    ).rows as { month_stamp: string; contestant_name: string; hearts: number }[];

    const archive = rows.map((r) => ({
      monthStamp: r.month_stamp,
      monthLabel: monthLabel(r.month_stamp),
      name: r.contestant_name,
      hearts: r.hearts,
    }));

    res.status(200).json({ archive });
  } catch (err) {
    console.error("champions API error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}
