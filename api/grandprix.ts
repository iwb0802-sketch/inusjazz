import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool, ensureSchema, rolloverIfNeeded } from "./_contestDb";
import { monthStamp, yearOf } from "../shared/contestMonth";

export const config = {
  runtime: "nodejs",
};

/**
 * GET /api/grandprix
 * 올해 1월~현재까지 모든 달(hearts_history) + 이번달(hearts_current) 하트를
 * 사회자별로 합산한 "보이스 그랑프리" 랭킹을 반환.
 * 12월에 연말 시상식용으로 사용하되, 연중에도 중간 집계 확인용으로 호출 가능.
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

  const pool = getPool();
  const client = await pool.connect();

  try {
    await ensureSchema(client);
    await rolloverIfNeeded(client);

    const now = monthStamp();
    const year = yearOf(now);

    const historyRows = (
      await client.query(
        `SELECT contestant_name, SUM(hearts)::int AS hearts
         FROM hearts_history
         WHERE month_stamp LIKE $1
         GROUP BY contestant_name`,
        [`${year}-%`]
      )
    ).rows as { contestant_name: string; hearts: number }[];

    const currentRows = (
      await client.query(`SELECT contestant_name, hearts FROM hearts_current`)
    ).rows as { contestant_name: string; hearts: number }[];

    const totals: Record<string, number> = {};
    for (const r of historyRows) totals[r.contestant_name] = (totals[r.contestant_name] || 0) + r.hearts;
    for (const r of currentRows) totals[r.contestant_name] = (totals[r.contestant_name] || 0) + r.hearts;

    const ranking = Object.entries(totals)
      .map(([name, hearts]) => ({ name, hearts }))
      .sort((a, b) => b.hearts - a.hearts);

    res.status(200).json({ year, ranking });
  } catch (err) {
    console.error("grandprix API error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}
