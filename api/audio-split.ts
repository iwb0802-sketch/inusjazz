import type { VercelRequest, VercelResponse } from "@vercel/node";
import { addAudioCors, requireAudioAccess } from "./_audioAuth";
import { createAudioPrediction, describeAudioError } from "./_audioReplicate";

function parseBody(body: unknown) {
  if (typeof body === "string") return JSON.parse(body) as { sourceUrl?: unknown };
  return (body ?? {}) as { sourceUrl?: unknown };
}

function isVercelBlobUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.endsWith(".blob.vercel-storage.com") || hostname.endsWith(".public.blob.vercel-storage.com");
  } catch { return false; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (addAudioCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  if (!requireAudioAccess(req, res)) return;
  const { sourceUrl } = parseBody(req.body);
  if (typeof sourceUrl !== "string" || !isVercelBlobUrl(sourceUrl)) return res.status(400).json({ error: "업로드한 음원 URL이 올바르지 않습니다." });
  try {
    const prediction = await createAudioPrediction(sourceUrl);
    return res.status(200).json({ id: prediction.id, status: prediction.status });
  } catch (error) {
    return res.status(502).json({ error: describeAudioError(error) });
  }
}
