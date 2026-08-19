import type { VercelRequest, VercelResponse } from "@vercel/node";

import { jsonrepair } from "jsonrepair";

export const config = { runtime: "nodejs" };

type ScriptSection = {
  no: number;
  order: string;
  time: string;
  script: string;
  note: string;
};

type ExistingScript = {
  title?: unknown;
  subtitle?: unknown;
  sections?: unknown;
  review_flags?: unknown;
};

type ConversationItem = {
  role?: unknown;
  content?: unknown;
};

type RevisePayload = {
  instruction?: unknown;
  script?: ExistingScript;
  companyGuide?: unknown;
  conversation?: ConversationItem[];
};

const CORE_REVISION_GUIDE = `
당신은 이너스뮤직의 결혼식 사회자 대본 수정 담당자입니다. 관리자가 이미 생성된 실제 사회 대본을 보고 자연어로 수정 요청을 합니다.

[수정 원칙]
1. 관리자의 이번 요청과 직접 관련 없는 식순·멘트·비고는 가능한 한 그대로 보존하세요.
2. 요청 범위가 특정 식순이면 해당 식순과 문맥상 연결되는 앞뒤 식순만 최소한으로 조정하세요.
3. 제공되지 않은 첫 만남, 직업, 가족관계, 관계, 곡명, 연락처, 장소 세부 정보 등을 절대 새로 만들지 마세요.
4. 항상 자연스러운 한국어 존댓말을 사용하고, 신랑은 "OOO 군", 신부는 "OOO 양"으로 표기합니다.
5. 답변지·요청사항의 실제 인용만 <answer>와 </answer> 태그로 감싸며, 새로 지어낸 문장에는 이 태그를 쓰지 마세요.
6. 음원 타이밍·링크·연출 참고는 script가 아니라 note에 작성하세요. 서프라이즈는 멘트에서 예고하지 말고 note에 주의사항으로 남기세요.
7. 박수 요청은 대상을 명확히 적고, 신부 입장 직전 콜은 "그럼 불러보겠습니다."를 사용하세요.
8. 요청이 사실 확인을 필요로 하지만 자료가 없으면 임의로 쓰지 말고 review_flags 또는 해당 note에 "추후 확인 요망"을 남기세요.
9. 결과는 기존의 5열 구조(번호, 식순, 시간, 멘트, 비고)를 유지한 완성된 전체 대본이어야 합니다.

[출력 규칙]
반드시 아래 JSON 객체만 출력하세요. Markdown 코드블록이나 설명 문단은 절대 출력하지 마세요.
{
  "assistant_message": "관리자에게 보여줄 1~3문장 수정 결과 안내",
  "script": {
    "title": "대본 제목",
    "subtitle": "사회자: OOO",
    "sections": [{"no": 1, "order": "식순명", "time": "00:00", "script": "실제 멘트", "note": "사회자 참고 비고"}],
    "review_flags": ["최종 확인이 필요한 항목"]
  }
}`;

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

function parseBody(req: VercelRequest): RevisePayload {
  if (typeof req.body === "string") return JSON.parse(req.body) as RevisePayload;
  return (req.body || {}) as RevisePayload;
}

function cleanText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function normalizeScript(value: ExistingScript | undefined): { title: string; subtitle: string; sections: ScriptSection[]; review_flags: string[] } {
  const source = value && typeof value === "object" ? value : {};
  const rawSections = Array.isArray(source.sections) ? source.sections : [];
  const sections = rawSections.slice(0, 30).map((item, index) => {
    const section = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return {
      no: Number(section.no) || index + 1,
      order: cleanText(section.order, 120),
      time: cleanText(section.time, 80),
      script: cleanText(section.script, 9000),
      note: cleanText(section.note, 2000),
    };
  }).filter((section) => Boolean(section.order || section.script));

  if (!sections.length) throw new Error("수정할 기존 대본이 없습니다. 먼저 AI 대본을 생성해주세요.");
  return {
    title: cleanText(source.title, 150),
    subtitle: cleanText(source.subtitle, 150),
    sections,
    review_flags: Array.isArray(source.review_flags) ? source.review_flags.slice(0, 10).map((item) => cleanText(item, 300)).filter(Boolean) : [],
  };
}

function normalizeConversation(value: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-8).map((item) => {
    const turn = item && typeof item === "object" ? item as ConversationItem : {};
    return {
      role: turn.role === "assistant" ? "assistant" as const : "user" as const,
      content: cleanText(turn.content, 1200),
    };
  }).filter((turn) => Boolean(turn.content));
}

function parseRevisionJson(text: string): { assistantMessage: string; script: { title: string; subtitle: string; sections: ScriptSection[]; review_flags: string[] } } {
  const compact = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = compact.indexOf("{");
  const end = compact.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("AI 수정 응답에 JSON 결과가 없습니다.");
  const candidate = compact.slice(start, end + 1);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(candidate) as Record<string, unknown>;
  } catch (initialError) {
    try {
      parsed = JSON.parse(jsonrepair(candidate)) as Record<string, unknown>;
      console.warn("AI 대본 수정 응답의 JSON 형식을 자동 보정했습니다.");
    } catch {
      const detail = initialError instanceof Error ? initialError.message : "형식 오류";
      throw new Error(`AI 수정 응답 JSON 보정에 실패했습니다: ${detail}`);
    }
  }
  const script = normalizeScript(parsed.script as ExistingScript);
  return {
    assistantMessage: cleanText(parsed.assistant_message, 1000) || "요청하신 내용을 반영해 대본을 수정했습니다.",
    script,
  };
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
    const instruction = cleanText(body.instruction, 3000);
    if (!instruction) {
      res.status(400).json({ error: "수정 요청을 입력해주세요." });
      return;
    }

    const currentScript = normalizeScript(body.script);
    const companyGuide = cleanText(body.companyGuide, 26000);
    const conversation = normalizeConversation(body.conversation);
    const userPrompt = `[현재 전체 대본]\n${JSON.stringify(currentScript, null, 2)}\n\n[이전 수정 대화]\n${conversation.length ? conversation.map((turn) => `${turn.role === "user" ? "관리자" : "AI"}: ${turn.content}`).join("\n") : "없음"}\n\n[이번 수정 요청]\n${instruction}\n\n위 요청을 반영한 전체 대본 JSON을 반환하세요.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 8500,
        temperature: 0.35,
        system: [CORE_REVISION_GUIDE, process.env.AI_SCRIPT_GUIDE ? `[서버 고정 회사 지침]\n${process.env.AI_SCRIPT_GUIDE}` : "", companyGuide ? `[관리자 공용 회사 지침]\n${companyGuide}` : ""].filter(Boolean).join("\n\n"),
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const result = await response.json() as any;
    if (!response.ok) {
      console.error("AI script revision error:", result);
      res.status(response.status).json({ error: result?.error?.message || "AI 대본 수정에 실패했습니다." });
      return;
    }

    const text = Array.isArray(result.content)
      ? result.content.filter((block: any) => block.type === "text").map((block: any) => block.text).join("\n")
      : "";
    const revision = parseRevisionJson(text);
    res.status(200).json(revision);
  } catch (error) {
    console.error("AI script revision error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "AI 대본 수정 중 오류가 발생했습니다." });
  }
}
