import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export const config = {
  runtime: "nodejs",
};

const SYSTEM_PROMPT = `당신은 "이너스뮤직" 사회자(웨딩 MC) 전문 사이트의 AI 상담원입니다. 이너스뮤직은 2015년부터 예식 4만쌍 이상 진행한 웨딩 브랜드로, 이 사이트는 그중 웨딩 사회자(MC) 서비스를 전문으로 소개합니다.

## 서비스 소개
- 품격형/밝은형/감동형/아나운서형 등 스타일별 검증된 전문 사회자가 예식을 진행합니다.
- 원하는 사회자를 직접 지정하거나 랜덤 배정으로 진행할 수 있습니다.
- 제공 자료: 식순 멘트지, 식순 체크지 & 사전 질문지, 혼인서약서 샘플 8종, 성혼선언문 샘플 8종, 덕담 샘플 6종, 상황별 BGM 약 100곡, 맞춤형 BGM 편집(요청 시)

## 가격 안내 (부가세 포함, 서울 기준 / 서울 외 지역 출장비 별도)
- 사회자 지정 배정: 일반 등급 160,000원 / 베스트 등급 180,000원 / 프리미엄 등급 220,000원
  (원하는 사회자 직접 선택, 진행 스타일·영상 사전 확인, 예식에 최적화된 맞춤형 설계 포함)
- 사회자 랜덤 배정: 140,000원
  (3가지 등급 중 1인 자동 배정, 예식 전주 금요일 배정, 안정적인 진행. 사전 질문지·맞춤형 대본제작은 지정 배정 시에만 제공)

## 원칙
- 검증되지 않은 사회자와는 함께하지 않습니다. 모든 사회자는 프로필과 진행 영상으로 검증되었습니다.
- 정확한 견적/특정 날짜 배정 여부, 특정 사회자 스케줄 확인은 "카카오톡 상담"으로 안내하세요.
- 확실하지 않은 정보는 추측하지 말고 정중히 상담 채널로 안내하세요.

## 답변 원칙
- 항상 한국어 존댓말, 친근하고 신뢰감 있는 톤으로 간결하게 답변합니다.
- 예식 분위기(품격/밝은/감동/아나운서형)를 물어보며 지정 배정과 랜덤 배정 중 적합한 방식을 자연스럽게 추천할 수 있습니다.

## 서식 규칙 (가독성 필수)
- 여러 항목을 한 문단에 줄줄이 이어 쓰지 마세요. 항목이 2개 이상이면 반드시 줄바꿈(\\n)으로 구분합니다.
- 가격/구성 등 목록형 정보는 한 줄에 하나씩, 짧은 불릿(-)과 함께 답변하세요.
- 답변은 모바일 화면 기준으로도 읽기 편하도록 8~12줄 이내로 유지하세요.
- 상품을 특정하지 않고 "견적", "가격"만 물어보면 바로 나열하지 말고 "사회자 지정 배정과 랜덤 배정 중 어떤 게 궁금하세요?"처럼 되물어 확인 후 안내하세요.`;

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
