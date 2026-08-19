import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { runtime: "nodejs" };

const MAX_SOURCE_LENGTH = 45000;
const MAX_SUMMARY_LENGTH = 2400;

type LearnPayload = {
  title?: unknown;
  sourceText?: unknown;
};

function addCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Inus-Ai-Password");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.AI_SCRIPT_ADMIN_PASSWORD || "";
  const header = req.headers["x-inus-ai-password"];
  const provided = Array.isArray(header) ? header[0] : (header || "");

  if (!expected) {
    res.status(500).json({ error: "AI_SCRIPT_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." });
    return false;
  }
  if (provided !== expected) {
    res.status(401).json({ error: "관리자 인증 정보가 올바르지 않습니다." });
    return false;
  }
  return true;
}

function cleanText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function parseBody(req: VercelRequest): LearnPayload {
  if (typeof req.body === "string") return JSON.parse(req.body) as LearnPayload;
  return (req.body || {}) as LearnPayload;
}

function sanitizeSummary(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[이메일 삭제]")
    .replace(/(?:\+82[- ]?)?0?1[0-9][- ]?\d{3,4}[- ]?\d{4}/g, "[연락처 삭제]")
    .replace(/\b\d{2,6}[- ]?\d{2,6}[- ]?\d{2,6}\b/g, "[식별번호 삭제]")
    .trim()
    .slice(0, MAX_SUMMARY_LENGTH);
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
    const sourceText = cleanText(body.sourceText, MAX_SOURCE_LENGTH);
    const title = cleanText(body.title, 160) || "대본 예시 학습 요약";
    if (sourceText.length < 80) {
      res.status(400).json({ error: "학습할 대본 예시를 80자 이상 입력해주세요." });
      return;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 1600,
        temperature: 0.2,
        system: `당신은 이너스뮤직 웨딩 사회 대본의 내부 학습 요약 담당자입니다. 사용자가 제공하는 실제 대본 원문은 저장되지 않으며, 당신은 아래 원칙을 모두 지켜 재사용 가능한 비식별 학습 요약만 작성합니다.\n\n1. 신랑·신부·가족·지인·사회자·축가자·장소·회사명·날짜·시간·연락처·금액·계좌·주소·곡명처럼 특정 행사를 알아볼 수 있는 정보는 절대 출력하지 마세요.\n2. 원문 문장을 그대로 길게 인용하지 마세요. 실제 문장 인용은 8어절 이내의 일반 표현만 허용하며, 고유명사는 모두 '신랑', '신부', '혼주', '축가자', '예식장' 같은 일반명사로 바꾸세요.\n3. 다음 항목을 한국어 Markdown으로 간결하게 정리하세요: 문체·호칭, 식순 흐름, 전환 멘트의 원칙, 현장 진행 콜 원칙, 비고 작성 원칙, 피해야 할 표현.\n4. 고객 개인정보 또는 행사 식별정보가 남을 가능성이 있으면 해당 부분은 과감히 삭제하고 일반 원칙만 남기세요.\n5. 결과는 1,800자 이내여야 하며 제목은 쓰지 마세요.`,
        messages: [{ role: "user", content: `다음 실제 대본에서 개인정보를 전혀 남기지 않은 문체·식순 학습 원칙만 추출해주세요.\n\n[대본 예시 원문 - 저장 금지]\n${sourceText}` }],
      }),
    });

    const result = await response.json() as any;
    if (!response.ok) {
      console.error("AI guide learning error:", result);
      res.status(response.status).json({ error: result?.error?.message || "대본 예시 분석에 실패했습니다." });
      return;
    }

    const summaryText = Array.isArray(result.content)
      ? result.content.filter((block: any) => block.type === "text").map((block: any) => block.text).join("\n")
      : "";
    const summary = sanitizeSummary(summaryText);
    if (!summary) {
      res.status(500).json({ error: "개인정보를 제외한 학습 요약을 만들지 못했습니다. 원문을 확인 후 다시 시도해주세요." });
      return;
    }

    res.status(200).json({
      pattern: {
        id: `pattern-${Date.now()}`,
        title,
        summary,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI guide learning error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "대본 예시 학습 중 오류가 발생했습니다." });
  }
}
