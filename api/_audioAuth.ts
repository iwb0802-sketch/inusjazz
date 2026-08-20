import { timingSafeEqual } from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const AUDIO_PASSWORD_HEADER = "x-inus-audio-password";

function getHeader(req: VercelRequest, header: string) {
  const value = req.headers[header];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function passwordsMatch(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length > 0 && providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export function requireAudioAccess(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.INUS_AUDIO_PASSWORD ?? "";
  const provided = getHeader(req, AUDIO_PASSWORD_HEADER);
  if (!expected) {
    res.status(500).json({ error: "INUS_AUDIO_PASSWORD 환경변수가 설정되지 않았습니다." });
    return false;
  }
  if (!passwordsMatch(provided, expected)) {
    res.status(401).json({ error: "작업 비밀번호가 올바르지 않습니다." });
    return false;
  }
  return true;
}

export function addAudioCors(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", `Content-Type, ${AUDIO_PASSWORD_HEADER}`);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
