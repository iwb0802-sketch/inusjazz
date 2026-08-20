import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { runtime: "nodejs" };

function addCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Inus-Guide-Password");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function headerValue(req: VercelRequest, name: string): string {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : (value || "");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (addCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }

  const expected = process.env.AI_GUIDE_ADMIN_PASSWORD || "";
  if (!expected) {
    res.status(500).json({ error: "AI_GUIDE_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." });
    return;
  }

  if (headerValue(req, "x-inus-guide-password") !== expected) {
    res.status(401).json({ error: "회사 지침 전용 비밀번호가 올바르지 않습니다." });
    return;
  }

  res.status(200).json({ verified: true });
}
