import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool, ensureSchema, rolloverIfNeeded, getLastMonthChampion } from "./_contestDb";
import { monthLabel, monthStamp } from "../shared/contestMonth";

export const config = {
  runtime: "nodejs",
};

/**
 * GET  /api/hearts  -> 현재 상태 조회 (이번달 하트, 전체 누적, 지난달 확정 챔피언)
 * POST /api/hearts  { name, amount? } -> 하트 적립
 *
 * 전체 방문자 공유 카운트 (Railway Postgres 기반)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
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
    console.error("hearts API DB connect error:", err);
    res.status(500).json({ error: "DB connect failed", detail: String((err as Error)?.message || err) });
    return;
  }

  try {
    await ensureSchema(client);
    await rolloverIfNeeded(client);

    if (req.method === "GET") {
      const monthRows = (
        await client.query(`SELECT contestant_name, hearts FROM hearts_current`)
      ).rows as { contestant_name: string; hearts: number }[];

      const historyRows = (
        await client.query(
          `SELECT contestant_name, SUM(hearts)::int AS hearts FROM hearts_history GROUP BY contestant_name`
        )
      ).rows as { contestant_name: string; hearts: number }[];

      const month: Record<string, number> = {};
      for (const r of monthRows) month[r.contestant_name] = r.hearts;

      const allTime: Record<string, number> = { ...month };
      for (const r of historyRows) {
        allTime[r.contestant_name] = (allTime[r.contestant_name] || 0) + r.hearts;
      }

      const champion = await getLastMonthChampion(client);
      const now = monthStamp();

      res.status(200).json({
        month,
        allTime,
        currentMonthLabel: monthLabel(now),
        lastMonthChampion: champion
          ? {
              name: champion.name,
              hearts: champion.hearts,
              monthLabel: monthLabel(champion.monthStamp),
            }
          : null,
      });
      return;
    }

    if (req.method === "POST") {
      const { name, amount } = req.body as { name?: string; amount?: number };
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "name is required" });
        return;
      }
      const inc = Number.isFinite(amount) && amount ? Math.floor(amount as number) : 1;

      await client.query(
        `INSERT INTO hearts_current (contestant_name, hearts) VALUES ($1, $2)
         ON CONFLICT (contestant_name) DO UPDATE SET hearts = hearts_current.hearts + $2`,
        [name, inc]
      );

      const monthRows = (
        await client.query(`SELECT contestant_name, hearts FROM hearts_current`)
      ).rows as { contestant_name: string; hearts: number }[];
      const historyRows = (
        await client.query(
          `SELECT contestant_name, SUM(hearts)::int AS hearts FROM hearts_history GROUP BY contestant_name`
        )
      ).rows as { contestant_name: string; hearts: number }[];

      const month: Record<string, number> = {};
      for (const r of monthRows) month[r.contestant_name] = r.hearts;
      const allTime: Record<string, number> = { ...month };
      for (const r of historyRows) {
        allTime[r.contestant_name] = (allTime[r.contestant_name] || 0) + r.hearts;
      }

      res.status(200).json({ month, allTime });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("hearts API error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}
