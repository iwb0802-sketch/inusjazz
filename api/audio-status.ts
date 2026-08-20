import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAudioAccess } from "./_audioAuth";
import { getPrediction, stemsFrom } from "./_audioReplicate";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  if (!requireAudioAccess(req, res)) return;
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
  if (typeof body.predictionId !== "string" || !/^[a-z0-9]{8,}$/i.test(body.predictionId)) return res.status(400).json({ error: "작업 식별자가 올바르지 않습니다." });
  try { const prediction = await getPrediction(body.predictionId); if (prediction.status === "succeeded" || prediction.status === "successful") return res.status(200).json({ status: "succeeded", ...stemsFrom(prediction.output) }); if (prediction.status === "failed" || prediction.status === "canceled") return res.status(200).json({ status: "failed", error: prediction.error ?? "분리 작업이 완료되지 않았습니다." }); return res.status(200).json({ status: "processing" }); }
  catch (error) { return res.status(502).json({ status: "failed", error: error instanceof Error ? error.message : "분리 결과를 확인하지 못했습니다." }); }
}
