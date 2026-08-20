import { timingSafeEqual } from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export function requireAudioAccess(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.INUS_AUDIO_PASSWORD ?? "";
  const providedHeader = req.headers["x-inus-audio-password"];
  const provided = Array.isArray(providedHeader) ? providedHeader[0] ?? "" : providedHeader ?? "";
  const actual = Buffer.from(provided);
  const target = Buffer.from(expected);
  if (!expected) { res.status(500).json({ error: "INUS_AUDIO_PASSWORD 환경변수가 설정되지 않았습니다." }); return false; }
  if (!actual.length || actual.length !== target.length || !timingSafeEqual(actual, target)) { res.status(401).json({ error: "작업 비밀번호가 올바르지 않습니다." }); return false; }
  return true;
}
