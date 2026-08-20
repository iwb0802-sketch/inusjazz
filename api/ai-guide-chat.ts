import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { runtime: "nodejs" };

type ChatTurn = {
  role?: unknown;
  content?: unknown;
};

type GuideChatPayload = {
  message?: unknown;
  currentGuide?: unknown;
  conversation?: unknown;
};

function addCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Inus-Guide-Password");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.AI_GUIDE_ADMIN_PASSWORD || "";
  const header = req.headers["x-inus-guide-password"];
  const provided = Array.isArray(header) ? header[0] : (header || "");
  if (!expected) {
    res.status(500).json({ error: "AI_GUIDE_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." });
    return false;
  }
  if (provided !== expected) {
    res.status(401).json({ error: "회사 지침 전용 비밀번호가 올바르지 않습니다." });
    return false;
  }
  return true;
}

function parseBody(req: VercelRequest): GuideChatPayload {
  if (typeof req.body === "string") return JSON.parse(req.body) as GuideChatPayload;
  return (req.body || {}) as GuideChatPayload;
}

function cleanText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function normalizeConversation(value: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-10).map((item) => {
    const turn = item && typeof item === "object" ? item as ChatTurn : {};
    return {
      role: turn.role === "assistant" ? "assistant" as const : "user" as const,
      content: cleanText(turn.content, 2500),
    };
  }).filter((turn) => Boolean(turn.content));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (addCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }
  if (!requireAdmin(req, res)) return;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }

  try {
    const body = parseBody(req);
    const message = cleanText(body.message, 6000);
    if (!message) {
      res.status(400).json({ error: "AI에게 전달할 아이디어나 질문을 입력해주세요." });
      return;
    }

    const currentGuide = cleanText(body.currentGuide, 30000);
    const conversation = normalizeConversation(body.conversation);
    const conversationText = conversation.length
      ? conversation.map((turn) => `${turn.role === "user" ? "관리자" : "AI"}: ${turn.content}`).join("\n\n")
      : "아직 대화가 없습니다.";

    const system = `당신은 이너스뮤직의 결혼식 사회 대본 회사 지침을 함께 다듬는 AI 대화 파트너입니다. 관리자가 운영 노하우, 금지 표현, 식순 원칙, 말투 아이디어를 자유롭게 설명하면 자연스러운 한국어로 함께 대화하세요.

중요 원칙:
1. 이 대화는 아이디어 정리용입니다. 현재 회사 지침을 자동으로 수정·저장했다고 말하지 마세요.
2. 관리자가 바로 복사해 지침에 붙일 수 있도록 필요할 때는 "지침에 넣을 문장 제안" 제목 아래 짧고 명확한 문장 또는 항목으로 제안하세요.
3. 확정되지 않은 사실, 고객 개인정보, 가족 정보, 결혼식 사실관계를 지어내지 마세요.
4. 모호한 아이디어는 필요한 확인 질문을 먼저 하거나, 해석이 둘 이상이면 선택지를 제시하세요.
5. 답변은 실무적인 한국어로 간결하게 작성하고 Markdown 표는 사용하지 마세요.
6. 사용자는 필요한 부분을 직접 복사해 회사 지침 입력칸에 붙인 뒤 공용 저장합니다. 그 흐름을 존중하세요.`;

    const userPrompt = `[현재 회사 지침]\n${currentGuide || "아직 저장된 지침이 없습니다."}\n\n[이전 대화]\n${conversationText}\n\n[관리자의 새 메시지]\n${message}`;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 2200,
        temperature: 0.55,
        system,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const result = await response.json() as any;
    if (!response.ok) {
      console.error("AI guide chat error:", result);
      res.status(response.status).json({ error: result?.error?.message || "AI 지침 대화에 실패했습니다." });
      return;
    }

    const reply = Array.isArray(result.content)
      ? result.content.filter((block: any) => block.type === "text").map((block: any) => block.text).join("\n").trim()
      : "";
    if (!reply) {
      res.status(500).json({ error: "AI 지침 대화 응답이 비어 있습니다." });
      return;
    }
    res.status(200).json({ reply: cleanText(reply, 12000) });
  } catch (error) {
    console.error("AI guide chat error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "AI 지침 대화 중 오류가 발생했습니다." });
  }
}
