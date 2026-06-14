import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ElevenLabs 사회자 목소리 클론 ID 매핑
const VOICE_MAP: Record<string, string> = {
  "김민수": "JWuOh2mTRrGyGGPaD7WM",
  "고승범": "wg42EEjzSm99URqmlk1i",
  "이도영": "0A9yP2iWCjvoeUUQTyTK",
  "석재선": "Sqe8LWJ3mfDSe8s9PFkP",
  "이우영": "RamwLTJJSRWZIyoWej6F",
  "김선혁": "KSEIJT8t4VqiJgJAWKPi",
  "장윤태": "GQ8Ij9Yf59rv168AxSFB",
  "길상우": "OO3VnWQQL5x3ySM9jNb5",
};

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // TTS API 엔드포인트
  app.post("/api/tts", async (req, res) => {
    try {
      const { groomName, brideName, mcName, style } = req.body;

      if (!groomName || !brideName || !mcName) {
        return res.status(400).json({ error: "필수 파라미터 누락" });
      }

      const voiceId = VOICE_MAP[mcName];
      if (!voiceId) {
        return res.status(400).json({ error: "사회자를 찾을 수 없습니다" });
      }

      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API 키 설정 필요" });
      }

      // 분위기별 멘트 템플릿
      const getScript = (style: string) => {
        switch (style) {
          case "감동형":
            return `지금부터 두 분의 아름다운 예식을 시작하겠습니다.\n\n신랑 ${groomName} 님께서는 이 자리에서 가장 사랑하는 분을 만나기 위해 먼저 입장해 주시겠습니다. 신랑 ${groomName} 님 입장입니다.\n\n이제 오늘의 주인공, 신부 ${brideName} 님께서 입장하시겠습니다. 모든 분들의 마음 속에 영원히 기억될 아름다운 순간입니다. 신부 ${brideName} 님 입장입니다.`;
          case "밝은형":
            return `안녕하세요! 오늘 이 아름다운 자리에 와주신 모든 분들께 진심으로 감사드립니다.\n\n자, 이제 오늘의 주인공 신랑 ${groomName} 님께서 입장하십니다! 힘차고 따뜻한 박수로 맞이해 주세요! 신랑 ${groomName} 님 입장!\n\n자, 잠시 후 오늘의 가장 아름다운 순간이 펼쳐집니다. 평생 기억될 이 순간, 신부 ${brideName} 님께서 입장하십니다! 신부 ${brideName} 님 입장!`;
          default: // 품격형
            return `오늘 귀한 시간을 내어주신 모든 분들께 깊은 감사를 드립니다.\n\n신랑 ${groomName} 님의 입장을 안내해 드리겠습니다. 신랑 ${groomName} 님, 입장해 주십시오.\n\n이어서 신부 ${brideName} 님의 입장이 있겠습니다. 신부 ${brideName} 님, 행복한 걸음으로 입장해 주십시오.`;
        }
      };

      const script = getScript(style || "품격형");

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: script,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.3,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("ElevenLabs error:", err);
        return res.status(500).json({ error: "TTS 생성 실패" });
      }

      const audioBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.byteLength);
      res.send(Buffer.from(audioBuffer));
    } catch (err) {
      console.error("TTS error:", err);
      res.status(500).json({ error: "서버 오류" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
