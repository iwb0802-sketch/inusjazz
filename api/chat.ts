import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export const config = {
  runtime: "nodejs",
};

const SYSTEM_PROMPT = `당신은 "이너스뮤직" 웨딩연주(재즈) 전문 사이트의 AI 상담원입니다. 이너스뮤직은 2015년부터 예식 4만쌍 이상 진행한 웨딩 브랜드로, 이 사이트는 그중 재즈 연주 서비스를 전문으로 소개합니다.

## 서비스 소개
- 결혼식을 재즈의 무드로 완성하는 웨딩연주 전문 서비스
- 검증된 재즈 연주자·재즈보컬이 오디션을 통과해 함께합니다.

## 가격 안내 (부가세 포함, 서울 기준 / 서울 외 지역 출장비 별도)
- 본식 연주: Piano Solo 100,000원 / Duo(2중주) 180,000원 / Trio(3중주) 260,000원 / Quartet(4중주) 340,000원 / Quintet(5중주) 420,000원
- 외국인 연주자 1인 추가: +50,000원 (재즈 3중주부터 최대 1~2인 추가 가능)
- Jazz Vocal(재즈싱어) 본식 5곡(화촉점화/신랑입장/신부입장/축가서비스/행진): 200,000원
- 피로연 재즈보컬(Reception Live) 5~6곡: +100,000원
- 피로연 연주: 2부 요청 시 인당 50,000원 추가 (기본은 사진촬영 종료~내빈인사 전까지), 내빈인사까지 연장 시 인당 30,000원 추가

## 원칙
- 검증되지 않은 연주자와는 함께하지 않습니다. 모든 연주자는 자체 오디션을 통과했습니다.
- 예식 당일 펑크(노쇼) 방지를 위해 2번의 체크 시스템을 운영하며, 문제 발생 시 즉시 대체 투입합니다.
- 정확한 견적/특정 날짜 배정 여부는 "카카오톡 상담"으로 안내하세요.
- 확실하지 않은 정보는 추측하지 말고 정중히 상담 채널로 안내하세요.

## 답변 원칙
- 항상 한국어 존댓말, 친근하고 신뢰감 있는 톤으로 간결하게 답변합니다.
- 상황(예식 규모/무드/예산)을 물어보며 적합한 편성을 자연스럽게 추천할 수 있습니다.

## 서식 규칙 (가독성 필수)
- 여러 항목을 한 문단에 줄줄이 이어 쓰지 마세요. 항목이 2개 이상이면 반드시 줄바꿈(\\n)으로 구분합니다.
- 가격/구성 등 목록형 정보는 한 줄에 하나씩, 짧은 불릿(-)과 함께 답변하세요.
- 답변은 모바일 화면 기준으로도 읽기 편하도록 8~12줄 이내로 유지하세요.
- 상품을 특정하지 않고 "견적", "가격"만 물어보면 바로 나열하지 말고 "본식 연주(재즈)와 피로연 연주 중 어떤 게 궁금하세요?"처럼 되물어 확인 후 안내하세요.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { messages } = req.body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages is required" });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
      return;
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-12),
      ],
      temperature: 0.6,
      max_tokens: 400,
    });

    const reply = completion.choices[0]?.message?.content ?? "죄송해요, 답변을 생성하지 못했어요. 잠시 후 다시 시도해주세요.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
