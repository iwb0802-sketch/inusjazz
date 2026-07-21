import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool, ensureSchema, insertEvent } from "./_contestDb.js";

export const config = {
  runtime: "nodejs",
};

/**
 * POST /api/track { eventType, contestantName?, deviceId? }
 * VOV 콘테스트 주요 액션 계측 (게임시작/완주/전체순위보기/프로필보기/상담클릭 등).
 * 통계용이라 실패해도 절대 메인 흐름을 막지 않음 - 항상 200으로 응답.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(200).json({ ok: false });
    return;
  }
  if (!process.env.DATABASE_URL) {
    res.status(200).json({ ok: false });
    return;
  }

  const { eventType, contestantName, deviceId } = (req.body as {
    eventType?: string;
    contestantName?: string;
    deviceId?: string;
  }) || {};

  if (!eventType || typeof eventType !== "string") {
    res.status(200).json({ ok: false });
    return;
  }

  let client;
  try {
    const pool = getPool();
    client = await pool.connect();
    await ensureSchema(client);
    await insertEvent(client, eventType, contestantName || null, deviceId || null);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("track API error:", err);
    res.status(200).json({ ok: false });
  } finally {
    client?.release();
  }
}
