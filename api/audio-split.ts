import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAudioAccess } from "./_audioAuth";
import { createPrediction } from "./_audioReplicate";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  if (!requireAudioAccess(req, res)) return;
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
  const sourceUrl = body.sourceUrl;
  if (typeof sourceUrl !== "string" || !new URL(sourceUrl).hostname.endsWith(".blob.vercel-storage.com")) return res.status(400).json({ error: "업로드한 음원 URL이 올바르지 않습니다." });
  try { const prediction = await createPrediction(sourceUrl); return res.status(200).json({ id: prediction.id, status: prediction.status }); }
  catch (error) { return res.status(502).json({ error: error instanceof Error ? error.message : "MR 분리 요청을 시작하지 못했습니다." }); }
}
