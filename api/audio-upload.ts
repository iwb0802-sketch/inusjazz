import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { passwordsMatch } from "./_audioAuth";

const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/flac", "audio/x-flac"];

function parseBody(body: unknown) {
  if (typeof body === "string") return JSON.parse(body) as HandleUploadBody;
  return body as HandleUploadBody;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  try {
    const json = await handleUpload({
      body: parseBody(req.body),
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = clientPayload ? JSON.parse(clientPayload) as { password?: unknown } : {};
        const expected = process.env.INUS_AUDIO_PASSWORD ?? "";
        if (!expected || typeof payload.password !== "string" || !passwordsMatch(payload.password, expected)) throw new Error("작업 비밀번호가 올바르지 않습니다.");
        if (!pathname.startsWith("audio-source/")) throw new Error("허용되지 않은 업로드 경로입니다.");
        return { allowedContentTypes: AUDIO_TYPES, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(json);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "음원 업로드를 시작하지 못했습니다." });
  }
}
