import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool, ensureSchema, registerPlayAndCheckLimit } from "./_contestDb.js";

export const config = {
  runtime: "nodejs",
};

/**
 * POST /api/session { deviceId } -> { withinLimit, count }
 * 토너먼트 시작 시 호출. 기기(device) 기준 하루 첫 플레이만 전체 공유 집계에 반영되도록
 * 하루 플레이 횟수를 기록하고, 이번 판이 집계 대상인지(withinLimit) 알려준다.
 * DB 미연결/오류 시에는 항상 withinLimit: true로 응답해 정상 플레이를 막지 않는다.
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
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { deviceId } = (req.body as { deviceId?: string }) || {};
  if (!deviceId || typeof deviceId !== "string") {
    // deviceId 없으면 제한 로직을 적용할 수 없으니 정상 플레이로 처리
    res.status(200).json({ withinLimit: true, count: 1 });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res.status(200).json({ withinLimit: true, count: 1 });
    return;
  }

  let client;
  try {
    const pool = getPool();
    client = await pool.connect();
    await ensureSchema(client);
    const result = await registerPlayAndCheckLimit(client, deviceId, 1);
    res.status(200).json(result);
  } catch (err) {
    console.error("session API error:", err);
    // 오류 시에도 플레이를 막지 않고 집계 대상으로 처리
    res.status(200).json({ withinLimit: true, count: 1 });
  } finally {
    client?.release();
  }
}
