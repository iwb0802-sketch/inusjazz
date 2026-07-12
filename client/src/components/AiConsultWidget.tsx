/**
 * AI 상담 위젯 - 전 페이지 공통 (모바일청첩장 /card 페이지 제외)
 * GPT-4o 기반, /api/chat 서버리스 함수 호출
 */
import { useEffect, useRef, useState } from "react";
import { Send, X, Bot, Sparkles, ChevronDown } from "lucide-react";

const C = {
  bg: "#0D0E12",
  bgCard: "#141519",
  bgMid: "#1A1B20",
  border: "#2A2B32",
  mint: "#5BB5A2",
  gold: "#C9A96E",
  textMain: "#F0EFE9",
  textSub: "#8A8B93",
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "안녕하세요! 이너스뮤직 웨딩연주(재즈) AI 상담원입니다 :) 재즈 연주 편성, 가격, 예약 절차 등 궁금하신 점을 편하게 물어봐주세요.",
};

const QUICK_QUESTIONS = ["견적 문의", "편성 추천", "예약 절차", "이벤트 혜택"];

export default function AiConsultWidget({ bottomOffset = 92, showAfterScroll = false }: { bottomOffset?: number; showAfterScroll?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(!showAfterScroll);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showAfterScroll) {
      setScrolledPastHero(true);
      return;
    }
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 1.0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfterScroll]);

  const visible = open || scrolledPastHero;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      const reply: string = data?.reply || "죄송해요, 답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "연결에 문제가 생겼어요. 잠시 후 다시 시도해주시거나, 카카오 상담을 이용해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`ai-fab-btn fixed z-[70] flex items-center gap-2 rounded-full shadow-2xl transition-all duration-500 hover:-translate-y-0.5 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          bottom: `${bottomOffset}px`,
          right: "16px",
          padding: "11px 18px 11px 15px",
          background: `linear-gradient(135deg, rgba(201,169,110,0.16), rgba(91,181,162,0.10))`,
          border: `1px solid ${C.gold}`,
          boxShadow: "0 0 22px rgba(201,169,110,0.28)",
          backdropFilter: "blur(10px)",
        }}
        aria-label="AI 챗봇"
      >
        {open ? <X size={16} style={{ color: C.gold }} /> : <Bot size={17} style={{ color: C.gold }} />}
        <span className="text-[13px] tracking-wide font-semibold whitespace-nowrap" style={{ color: C.gold, fontFamily: "'Noto Sans KR', sans-serif" }}>
          AI 챗봇
        </span>
      </button>
      <style>{`
        @keyframes aiFabPulse {
          0%, 100% { box-shadow: 0 0 22px rgba(201,169,110,0.28); }
          50% { box-shadow: 0 0 32px rgba(201,169,110,0.5); }
        }
        .ai-fab-btn { animation: aiFabPulse 3s ease-in-out infinite; }
        .ai-fab-btn:hover { animation-play-state: paused; box-shadow: 0 0 36px rgba(201,169,110,0.55) !important; }
      `}</style>

      {/* 챗 패널 */}
      {open && (
        <div
          className="fixed z-[70] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            bottom: `${bottomOffset + 56}px`,
            right: "16px",
            width: "min(360px, calc(100vw - 32px))",
            height: "min(520px, calc(100vh - 280px))",
            backgroundColor: C.bgCard,
            border: `1px solid ${C.border}`,
          }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: `1px solid ${C.border}`, background: `linear-gradient(135deg, rgba(201,169,110,0.12), rgba(91,181,162,0.08))` }}
          >
            <Sparkles size={16} style={{ color: C.gold }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: C.textMain, fontFamily: "'Noto Serif KR', serif" }}>
                웨딩연주(재즈) AI 상담
              </p>
              <p className="text-[11px]" style={{ color: C.textSub }}>
                궁금한 점을 물어보세요
              </p>
            </div>
          </div>

          {/* 메시지 목록 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed break-keep whitespace-pre-line"
                  style={{
                    wordBreak: "keep-all",
                    backgroundColor: m.role === "user" ? C.mint : C.bgMid,
                    color: m.role === "user" ? "#0D0E12" : C.textMain,
                    border: m.role === "user" ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  {m.content}
                </div>
                {m.role === "assistant" && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <a
                      href="https://pf.kakao.com/_wxovaM/chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "#FEE500", color: "#191919" }}
                    >
                      💬 카카오톡 상담
                    </a>
                    <a
                      href="tel:02-423-2772"
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: C.mint, color: "#0D0E12" }}
                    >
                      📞 전화하기
                    </a>
                  </div>
                )}
                {m.role === "assistant" && (
                  <button
                    onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}
                    className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium transition-opacity hover:opacity-80"
                    style={{ color: C.textSub }}
                  >
                    자주하는 질문 보기
                    <ChevronDown
                      size={13}
                      style={{ transition: "transform 0.2s", transform: faqOpenIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                )}
                {m.role === "assistant" && faqOpenIndex === i && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setFaqOpenIndex(null);
                          send(q);
                        }}
                        className="text-[12px] font-medium px-3.5 py-2 rounded-full transition-all hover:opacity-80"
                        style={{ backgroundColor: "rgba(201,169,110,0.1)", color: C.gold, border: `1px solid ${C.gold}55` }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[12px] font-medium px-3.5 py-2 rounded-full transition-all hover:opacity-80"
                    style={{ backgroundColor: "rgba(201,169,110,0.1)", color: C.gold, border: `1px solid ${C.gold}55` }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3.5 py-2.5 rounded-2xl text-[13px]"
                  style={{ backgroundColor: C.bgMid, color: C.textSub, border: `1px solid ${C.border}` }}
                >
                  답변을 준비하고 있어요...
                </div>
              </div>
            )}
          </div>

          {/* 입력창 */}
          <div className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="궁금한 점을 입력해주세요"
              className="flex-1 text-sm px-3.5 py-2.5 rounded-full outline-none"
              style={{ backgroundColor: C.bgMid, color: C.textMain, border: `1px solid ${C.border}` }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-opacity disabled:opacity-40"
              style={{ width: "38px", height: "38px", backgroundColor: C.gold }}
              aria-label="전송"
            >
              <Send size={16} color="#0D0E12" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
