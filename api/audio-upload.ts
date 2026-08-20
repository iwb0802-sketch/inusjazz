import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/flac", "audio/x-flac"];
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  const token = process.env.INUS_AUDIO_BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: "INUS_AUDIO_BLOB_READ_WRITE_TOKEN 환경변수가 설정되지 않았습니다." });
  try {
    const json = await handleUpload({ token, request: req, body: (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as HandleUploadBody, onBeforeGenerateToken: async (pathname, payload) => {
      const expected = process.env.INUS_AUDIO_PASSWORD ?? "";
      const supplied = payload ? (JSON.parse(payload) as { password?: unknown }).password : "";
      if (typeof supplied !== "string" || !expected || supplied !== expected) throw new Error("작업 비밀번호가 올바르지 않습니다.");
      if (!pathname.startsWith("audio-source/")) throw new Error("허용되지 않은 업로드 경로입니다.");
      return { allowedContentTypes: AUDIO_TYPES, maximumSizeInBytes: 24 * 1024 * 1024, addRandomSuffix: true };
    } });
    return res.status(200).json(json);
  } catch (error) { return res.status(400).json({ error: error instanceof Error ? error.message : "음원 업로드를 시작하지 못했습니다." }); }
}
