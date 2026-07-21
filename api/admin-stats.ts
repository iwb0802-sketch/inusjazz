import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool, ensureSchema, rolloverIfNeeded } from "./_contestDb.js";
import { monthStamp, monthLabel } from "../shared/contestMonth.js";

export const config = {
  runtime: "nodejs",
};

/**
 * GET /api/admin-stats?key=xxx
 * VOV 관리자 통계: 이벤트(게임시작/완주/전체순위보기/프로필보기/상담클릭) 집계 + 오늘/이번달 요약.
 * key는 ADMIN_STATS_KEY 환경변수와 일치해야 함 (Vercel 환경변수로 관리, 코드에 하드코딩하지 않음).
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

  const adminKey = process.env.ADMIN_STATS_KEY;
  if (!adminKey) {
    res.status(503).json({ error: "ADMIN_STATS_KEY not configured yet" });
    return;
  }
  const providedKey = (req.query.key as string) || "";
  if (providedKey !== adminKey) {
    res.status(401).json({ error: "unauthorized" });
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
    console.error("admin-stats API DB connect error:", err);
    res.status(500).json({ error: "DB connect failed" });
    return;
  }

  try {
    await ensureSchema(client);
    await rolloverIfNeeded(client);

    const totalsRes = await client.query(
      `SELECT event_type, COUNT(*)::int AS count
       FROM contest_events
       GROUP BY event_type
       ORDER BY count DESC`
    );

    const todayRes = await client.query(
      `SELECT event_type, COUNT(*)::int AS count
       FROM contest_events
       WHERE created_at >= (now() AT TIME ZONE 'Asia/Seoul')::date
       GROUP BY event_type
       ORDER BY count DESC`
    );

    const last7DaysRes = await client.query(
      `SELECT (created_at AT TIME ZONE 'Asia/Seoul')::date AS day, event_type, COUNT(*)::int AS count
       FROM contest_events
       WHERE created_at >= now() - interval '7 days'
       GROUP BY day, event_type
       ORDER BY day DESC`
    );

    const contestantClicksRes = await client.query(
      `SELECT contestant_name, event_type, COUNT(*)::int AS count
       FROM contest_events
       WHERE contestant_name IS NOT NULL
       GROUP BY contestant_name, event_type
       ORDER BY count DESC
       LIMIT 50`
    );

    const monthRows = (
      await client.query(`SELECT contestant_name, hearts FROM hearts_current ORDER BY hearts DESC`)
    ).rows as { contestant_name: string; hearts: number }[];

    res.status(200).json({
      currentMonthLabel: monthLabel(monthStamp()),
      totals: totalsRes.rows,
      today: todayRes.rows,
      last7Days: last7DaysRes.rows,
      contestantClicks: contestantClicksRes.rows,
      monthRanking: monthRows,
    });
  } catch (err) {
    console.error("admin-stats API error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}
