import type { VercelRequest, VercelResponse } from "@vercel/node";
import { addAudioCors, requireAudioAccess } from "./_audioAuth";
import { describeAudioError, extractStemUrls, getAudioPrediction } from "./_audioReplicate";

function parseBody(body: unknown) {
  if (typeof body === "string") return JSON.parse(body) as { predictionId?: unknown };
  return (body ?? {}) as { predictionId?: unknown };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (addAudioCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  if (!requireAudioAccess(req, res)) return;
  const { predictionId } = parseBody(req.body);
  if (typeof predictionId !== "string" || !/^[a-z0-9]{8,}$/i.test(predictionId)) return res.status(400).json({ error: "작업 식별자가 올바르지 않습니다." });
  try {
    const prediction = await getAudioPrediction(predictionId);
    if (prediction.status === "succeeded" || prediction.status === "successful") {
      return res.status(200).json({ status: "succeeded", ...extractStemUrls(prediction.output) });
    }
    if (prediction.status === "failed" || prediction.status === "canceled") {
      return res.status(200).json({ status: "failed", error: prediction.error || "분리 작업이 완료되지 않았습니다." });
    }
    return res.status(200).json({ status: "processing" });
  } catch (error) {
    return res.status(502).json({ status: "failed", error: describeAudioError(error) });
  }
}
