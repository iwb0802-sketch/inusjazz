import type { VercelRequest, VercelResponse } from "@vercel/node";
export function requireAiScriptAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.AI_SCRIPT_ADMIN_PASSWORD || "";
  const providedHeader = req.headers["x-inus-ai-password"];
  const provided = Array.isArray(providedHeader) ? providedHeader[0] : (providedHeader || "");

  if (!expected) {
    res.status(500).json({ error: "AI_SCRIPT_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." });
    return false;
  }

  // HTTPS 연결 내부의 관리자 전용 도구이므로, Vercel 함수 호환성을 위해 단순 문자열 비교를 사용합니다.
  if (provided !== expected) {
    res.status(401).json({ error: "관리자 인증 정보가 올바르지 않습니다." });
    return false;
  }
  return true;
}

export function addAiScriptCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Inus-Ai-Password");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
