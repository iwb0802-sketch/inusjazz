import type { VercelRequest, VercelResponse } from "@vercel/node";
export const config = { runtime: "nodejs" };

type ScriptSection = {
  no: number;
  order: string;
  time: string;
  script: string;
  note: string;
};

type GeneratePayload = {
  groomName?: string;
  brideName?: string;
  mcName?: string;
  ceremonyType?: "main" | "reception";
  style?: "classic" | "trendy" | "warm";
  weddingDate?: string;
  weddingTime?: string;
  venue?: string;
  duration?: string;
  customOrder?: string;
  coupleStory?: string;
  requests?: string;
};

const CORE_GUIDE = `
당신은 이너스뮤직의 결혼식 사회자 대본 작성 담당자입니다. 결과물은 실제 사회자가 현장에서 바로 읽는 엑셀용 대본입니다.

[필수 작성 원칙]
1. 항상 자연스러운 한국어 존댓말을 사용하고, 신랑은 "OOO 군", 신부는 "OOO 양"으로 표기합니다.
2. 신랑신부가 제공한 답변·요청·인용문은 문구를 임의로 왜곡하지 말고, script 안에서 <answer>...</answer>로 감싸세요. 이 표시는 엑셀에서 빨간색 굵게 처리됩니다.
3. 제공되지 않은 사실(첫 만남, 직업, 가족관계, 곡명, 축가자 관계, 화동 인원, 음원 초 수 등)을 지어내지 마세요. 필요한 정보가 없으면 보편적 멘트로 작성하고 note에 "추후 확인 요망"을 적으세요.
4. "소개팅"은 반드시 "지인의 소개"로 바꾸세요. 신조어·밈은 사회자 서술 문장에서는 풀어쓰고, 사용자 원문 인용 안에서만 유지할 수 있습니다.
5. "예물 교환"은 반지인 경우 "반지 교환"을 사용하세요.
6. 박수 요청은 항상 대상을 명시하세요. 예: "큰 박수로 축가자를 모시겠습니다." 
7. 축가자가 이너스뮤직 소속이어도 하객 대상 멘트에는 "신랑신부의 지인인 OOO 님"처럼 소개하세요. 소속 표기는 note에만 허용합니다.
8. 서프라이즈·부케 전달·노래 입장 등 비밀 연출은 script에서 절대 언급하거나 예고하지 말고 note에 "★ 멘트로 사전 언급 금지 (서프라이즈)"를 적으세요.
9. 한부모 가정 등 민감한 가족 정보는 script에서 해당 호칭이나 상황을 언급하지 마세요. 밝고 존중하는 보편적 표현을 쓰세요.
10. 화촉점화 뒤에는 양가 인사, 내빈께 인사, 혼주석 착석 안내까지 문맥이 이어지게 작성하고 실제 콜 구령("양가어머님 인사!!", "내빈께 인사!!")과 박수 요청을 포함하세요.
11. 신부 입장은 신부가 진정한 주인공임을 감성적으로 강조하고, 입장 콜 직전에는 "그럼 불러보겠습니다."를 사용합니다.
12. 혼인서약 낭독 자세는 "내빈쪽을 향해 바라보시고"로 안내합니다.
13. 부모님 인사 전에는 감사말을 연결하고, 자기 부모님께는 본인이 말하는 원칙을 지킵니다.
14. 행진 멘트에는 두 사람의 다짐을 자연스럽게 연결하고 "내빈 여러분의 뜨거운 축복의 박수"처럼 대상을 명시합니다.
15. 식순 간 앞뒤 문맥이 이어지도록 작성합니다. 예를 들어 화동이 반지를 전달했다면 다음 반지 교환 멘트에서 이를 자연스럽게 연결합니다.
16. 음원 타이밍·링크·연출 참고는 script가 아니라 note에만 정확히 적습니다.
17. 답변지에 다른 커플 정보가 섞였을 가능성이 있거나 정보가 상충되면 반영하지 말고 review_flags에 확인 필요 사항을 기록하세요.
18. 기본 예식은 번호/식순/시간/멘트/비고의 5열 구조입니다. 기본 식순은 하객 입장 안내, 오프닝, 개식 선언, 혼주님 입장, 화촉점화, 신랑 입장, 신부 입장, 맞절, 혼인서약, 반지 교환, 성혼선언, 편지/덕담/축가(답변에 있는 경우), 양가혼주님 및 내빈 인사, 행진, 폐회입니다. 사용자가 정한 식순이 있으면 그 식순을 우선합니다.
19. 2부 피로연은 개식사, 신랑신부 입장, 촛불점화, 케이크커팅, 축배, 퇴장 순서의 짧고 경쾌한 톤을 사용합니다.
20. 같은 틀을 기계적으로 반복하지 말고, style 값에 맞춰 클래식·트렌디·감성 버전을 변주하되 위 규칙은 절대 어기지 마세요.

[출력 규칙]
반드시 JSON 객체만 출력하세요. Markdown 코드블록이나 설명 문단은 절대 출력하지 마세요.
형식:
{
  "title": "신랑 OOO 군 · 신부 OOO 양 결혼식 사회 대본",
  "subtitle": "사회자: OOO",
  "sections": [
    {"no": 1, "order": "식순명", "time": "00:00", "script": "실제 멘트", "note": "사회자 참고 비고"}
  ],
  "review_flags": ["최종 확인이 필요한 항목"]
}
script는 충분히 실제 낭독 가능한 길이로 작성하세요. note가 필요 없으면 빈 문자열로 둡니다.
`;

function addAiScriptCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Inus-Ai-Password");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function requireAiScriptAdmin(req: VercelRequest, res: VercelResponse): boolean {
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

function parseBody(req: VercelRequest): GeneratePayload {
  if (typeof req.body === "string") return JSON.parse(req.body) as GeneratePayload;
  return (req.body || {}) as GeneratePayload;
}

function cleanText(value: unknown, limit = 5000): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function parseClaudeJson(text: string): { title: string; subtitle: string; sections: ScriptSection[]; review_flags: string[] } {
  const compact = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = compact.indexOf("{");
  const end = compact.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Claude 응답에 JSON 결과가 없습니다.");
  const parsed = JSON.parse(compact.slice(start, end + 1));
  if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) throw new Error("대본 식순이 생성되지 않았습니다.");
  return {
    title: cleanText(parsed.title, 150),
    subtitle: cleanText(parsed.subtitle, 150),
    sections: parsed.sections.slice(0, 30).map((section: any, index: number) => ({
      no: Number(section.no) || index + 1,
      order: cleanText(section.order, 120),
      time: cleanText(section.time, 80),
      script: cleanText(section.script, 12000),
      note: cleanText(section.note, 2000),
    })),
    review_flags: Array.isArray(parsed.review_flags) ? parsed.review_flags.slice(0, 10).map((flag: unknown) => cleanText(flag, 300)).filter(Boolean) : [],
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (addAiScriptCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 허용됩니다." });
    return;
  }
  if (!requireAiScriptAdmin(req, res)) return;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }

  try {
    const body = parseBody(req);
    const groomName = cleanText(body.groomName, 30);
    const brideName = cleanText(body.brideName, 30);
    if (!groomName || !brideName) {
      res.status(400).json({ error: "신랑·신부 이름을 입력해주세요." });
      return;
    }

    const input = {
      신랑이름: groomName,
      신부이름: brideName,
      사회자이름: cleanText(body.mcName, 30) || "미정",
      예식유형: body.ceremonyType === "reception" ? "2부 피로연" : "본식",
      대본톤: body.style === "trendy" ? "트렌디" : body.style === "warm" ? "감성" : "클래식",
      예식날짜: cleanText(body.weddingDate, 30),
      예식시간: cleanText(body.weddingTime, 30),
      예식장소: cleanText(body.venue, 150),
      예상진행시간: cleanText(body.duration, 50),
      지정식순: cleanText(body.customOrder, 4000),
      신랑신부스토리_답변지: cleanText(body.coupleStory, 10000),
      특별요청_음원_연출: cleanText(body.requests, 6000),
    };

    const userPrompt = `아래는 이번 커플의 제공 정보입니다. 제공 정보 외의 사실은 절대 만들지 마세요.\n\n[커플 정보]\n${JSON.stringify(input, null, 2)}\n\n회사 기준에 따라 엑셀용 사회 대본 JSON을 작성하세요.`;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 7000,
        temperature: 0.85,
        system: process.env.AI_SCRIPT_GUIDE ? `${CORE_GUIDE}\n\n[회사 추가 지침]\n${process.env.AI_SCRIPT_GUIDE}` : CORE_GUIDE,
        messages: [{ role: "user", content: userPrompt }],
      }),

    });

    const result = await response.json() as any;
    if (!response.ok) {
      console.error("Claude API error:", result);
      res.status(response.status).json({ error: result?.error?.message || "Claude API 호출에 실패했습니다." });
      return;
    }

    const text = Array.isArray(result.content)
      ? result.content.filter((block: any) => block.type === "text").map((block: any) => block.text).join("\n")
      : "";
    const script = parseClaudeJson(text);
    res.status(200).json({ script });
  } catch (error) {
    console.error("AI script generation error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "대본 생성 중 오류가 발생했습니다." });
  }
}
