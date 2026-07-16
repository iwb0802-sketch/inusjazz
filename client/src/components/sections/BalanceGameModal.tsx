/**
 * BalanceGameModal - "당신의 웨딩 사회 취향 밸런스 게임"
 * 8라운드 2택 밸런스 게임 → 취향 유형 + 어울리는 사회자 추천
 * 경쟁사(이상형 월드컵)와 다르게 '재미있는 밸런스 게임' 포맷 + 취향 리포트 형태로 차별화
 */
import { useEffect, useState } from "react";
import { X, RotateCcw, Copy } from "lucide-react";
import { MCS } from "./McMatchModal";

type Trait = "humor" | "emotion" | "elegant" | "lively" | "clean" | "detail" | "classic" | "trendy";

type Round = {
  question: string;
  a: { label: string; sub: string; trait: Trait };
  b: { label: string; sub: string; trait: Trait };
};

const ROUNDS: Round[] = [
  {
    question: "사회자의 오프닝 멘트, 어떤 스타일이 좋아요?",
    a: { label: "빵 터지는 개그 드립", sub: "하객들 자연스럽게 빵!", trait: "humor" },
    b: { label: "눈물 핑 도는 감동 멘트", sub: "시작부터 뭉클하게", trait: "emotion" },
  },
  {
    question: "축가 소개할 때는?",
    a: { label: "위트있게 텐션 UP", sub: "박수 유도 빵빵", trait: "humor" },
    b: { label: "잔잔하게 분위기 잡기", sub: "감성 라인 유지", trait: "emotion" },
  },
  {
    question: "예식 전체 톤은요?",
    a: { label: "품격있고 격식있게", sub: "우아한 예식", trait: "elegant" },
    b: { label: "텐션 넘치는 흥 넘치게", sub: "신나는 예식", trait: "lively" },
  },
  {
    question: "하객 반응은 어떻게?",
    a: { label: "차분한 존중과 몰입", sub: "격식 있는 분위기", trait: "elegant" },
    b: { label: "박수·환호로 들썩들썩", sub: "다같이 신나게", trait: "lively" },
  },
  {
    question: "진행 스타일은?",
    a: { label: "군더더기 없이 깔끔하게", sub: "핵심만 딱딱", trait: "clean" },
    b: { label: "하나하나 다 챙기는 디테일", sub: "세심한 진행", trait: "detail" },
  },
  {
    question: "사회자 멘트 분량은?",
    a: { label: "짧고 굵게 임팩트", sub: "군더더기 NO", trait: "clean" },
    b: { label: "스토리텔링 풍부하게", sub: "설명 꼼꼼하게", trait: "detail" },
  },
  {
    question: "선호하는 진행 톤은?",
    a: { label: "전통적이고 클래식한 톤", sub: "정석 웨딩 사회", trait: "classic" },
    b: { label: "트렌디하고 힙한 톤", sub: "요즘 감성", trait: "trendy" },
  },
  {
    question: "마지막으로, 예식 분위기는?",
    a: { label: "격식있는 정통 웨딩", sub: "클래식 무드", trait: "classic" },
    b: { label: "센스있는 요즘 웨딩", sub: "트렌디 무드", trait: "trendy" },
  },
];

const RESULT_TYPES: Record<string, { title: string; badge: string; desc: string; tags: string[] }> = {
  "humor-elegant": {
    title: "품격있는 개그본능형",
    badge: "🎩😂",
    desc: "격식은 지키되 웃음 포인트는 놓치지 않는, 품격과 위트를 동시에 잡는 타입이에요.",
    tags: ["품격", "웃음"],
  },
  "humor-lively": {
    title: "흥 넘치는 텐션러형",
    badge: "🎉",
    desc: "하객들과 함께 웃고 즐기는, 예식장을 축제로 만드는 텐션 만렙 타입이에요.",
    tags: ["웃음"],
  },
  "emotion-elegant": {
    title: "감성 충만 우아한형",
    badge: "🕊️",
    desc: "우아한 격식 속에서 진심 어린 감동을 전하는, 눈물과 품격을 함께 담는 타입이에요.",
    tags: ["품격", "감동"],
  },
  "emotion-lively": {
    title: "눈물버튼 감성텐션형",
    badge: "🥲🎊",
    desc: "감동은 깊게, 분위기는 밝게! 울다가 웃는 예식을 만드는 반전 매력 타입이에요.",
    tags: ["감동"],
  },
};

function calcResult(scores: Record<Trait, number>) {
  const mood = scores.humor >= scores.emotion ? "humor" : "emotion";
  const style = scores.elegant >= scores.lively ? "elegant" : "lively";
  const pace = scores.clean >= scores.detail ? "깔끔한 진행" : "디테일한 진행";
  const vibe = scores.classic >= scores.trendy ? "클래식한 톤" : "트렌디한 톤";
  const key = `${mood}-${style}`;
  const type = RESULT_TYPES[key];

  // 취향 태그로 사회자 매칭
  const wantTags = [...type.tags];
  const scored = MCS.map((mc) => {
    let s = 0;
    wantTags.forEach((t) => { if (mc.tags.includes(t)) s += 3; });
    if (pace === "깔끔한 진행" && mc.tags.includes("깔끔")) s += 1;
    return { mc, s };
  }).sort((a, b) => b.s - a.s);
  const top = scored[0]?.mc ?? MCS[0];

  return { type, pace, vibe, top };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BalanceGameModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Trait, number>>({
    humor: 0, emotion: 0, elegant: 0, lively: 0, clean: 0, detail: 0, classic: 0, trendy: 0,
  });
  const [flash, setFlash] = useState<"a" | "b" | null>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(0);
        setScores({ humor: 0, emotion: 0, elegant: 0, lively: 0, clean: 0, detail: 0, classic: 0, trendy: 0 });
        setResultVisible(false);
      }, 300);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const total = ROUNDS.length;
  const isResult = step >= total;

  const pick = (side: "a" | "b") => {
    setFlash(side);
    const round = ROUNDS[step];
    const trait = round[side].trait;
    const newScores = { ...scores, [trait]: scores[trait] + 1 };
    setTimeout(() => {
      setScores(newScores);
      setFlash(null);
      if (step < total - 1) {
        setStep(step + 1);
      } else {
        setStep(total);
        setTimeout(() => setResultVisible(true), 100);
      }
    }, 260);
  };

  const handleReset = () => {
    setResultVisible(false);
    setTimeout(() => {
      setStep(0);
      setScores({ humor: 0, emotion: 0, elegant: 0, lively: 0, clean: 0, detail: 0, classic: 0, trendy: 0 });
    }, 200);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const result = isResult ? calcResult(scores) : null;

  const handleShare = async () => {
    if (!result) return;
    const text = `💍 웨딩 사회 취향 밸런스 게임 결과\n\n${result.type.badge} ${result.type.title}\n${result.type.desc}\n\n▶ 나랑 잘 맞는 사회자: ${result.top.name}\n\n이너스뮤직에서 나도 해보기\nhttps://inusmusic.com`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("📋 복사 완료! 카카오톡에 붙여넣기 하세요");
    } catch {
      showToast("복사 실패 — 직접 캡처해서 공유해주세요");
    }
  };

  const progress = isResult ? 100 : Math.round((step / total) * 100);

  return (
    <div
      className="fixed inset-0 z-[250] overflow-y-auto flex flex-col items-center py-6 px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg"
        style={{
          background: "linear-gradient(160deg, #141414 0%, #0d0d0d 100%)",
          border: "1px solid rgba(91,181,162,0.25)",
          borderRadius: "12px",
          animation: "bgFadeInUp 0.35s cubic-bezier(0.23,1,0.32,1)",
          overflowX: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(91,181,162,0.15)" }}>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#5BB5A2" }}>
              BALANCE GAME
            </p>
            <h3 className="text-white text-base font-bold mt-0.5" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              내 웨딩 사회 취향 밸런스 게임
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #5BB5A2, #d6b16b)" }} />
        </div>

        {/* 질문 영역 */}
        {!isResult && (
          <div className="px-6 py-8">
            <p className="text-xs mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif", color: "rgba(91,181,162,0.7)", letterSpacing: "0.1em" }}>
              {step + 1} / {total}
            </p>
            <h4 className="text-white text-lg font-bold mb-7 text-center" style={{ fontFamily: "'Noto Serif KR', serif", lineHeight: 1.5 }}>
              {ROUNDS[step].question}
            </h4>

            <div className="flex flex-col gap-3">
              {(["a", "b"] as const).map((side) => {
                const opt = ROUNDS[step][side];
                const isFlashed = flash === side;
                return (
                  <button
                    key={side}
                    onClick={() => !flash && pick(side)}
                    disabled={!!flash}
                    className="w-full px-5 py-5 text-center transition-all duration-200"
                    style={{
                      background: isFlashed
                        ? "linear-gradient(135deg, rgba(91,181,162,0.25) 0%, rgba(214,177,107,0.15) 100%)"
                        : "rgba(255,255,255,0.03)",
                      border: isFlashed ? "1px solid #5BB5A2" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      transform: isFlashed ? "scale(0.98)" : "scale(1)",
                      cursor: flash ? "default" : "pointer",
                    }}
                  >
                    <span className="block text-white text-base font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                      {opt.label}
                    </span>
                    <span className="block text-white/40 text-xs mt-1.5" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-white/25 text-[11px] mt-6" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              더 끌리는 쪽을 골라주세요 — 정답은 없어요 :)
            </p>
          </div>
        )}

        {/* 결과 영역 */}
        {isResult && result && (
          <div
            className="px-6 py-8"
            style={{
              opacity: resultVisible ? 1 : 0,
              transform: resultVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s, transform 0.4s",
            }}
          >
            <div className="text-center mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#5BB5A2" }}>
                YOUR TYPE
              </p>
              <div className="text-4xl mb-3">{result.type.badge}</div>
              <h4 className="text-white text-xl font-bold mb-3" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {result.type.title}
              </h4>
              <p
                className="mx-auto text-sm leading-relaxed px-4 py-3 rounded-lg"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  color: "rgba(91,181,162,0.95)",
                  background: "rgba(91,181,162,0.08)",
                  border: "1px solid rgba(91,181,162,0.25)",
                  maxWidth: "380px",
                }}
              >
                {result.type.desc}
              </p>
              <p className="mt-4 text-white/40 text-xs" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                + {result.pace} · {result.vibe}를 선호하시네요
              </p>
            </div>

            {/* 추천 사회자 카드 */}
            <div
              className="flex items-center gap-4 p-4 rounded-lg mb-5"
              style={{
                background: "linear-gradient(135deg, rgba(214,177,107,0.12) 0%, rgba(91,181,162,0.08) 100%)",
                border: "1px solid rgba(214,177,107,0.4)",
              }}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid rgba(214,177,107,0.5)" }}>
                <img src={result.top.image} alt={result.top.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d6b16b" }}>
                  MATCHED MC
                </p>
                <p className="text-white font-bold" style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "15px" }}>
                  {result.top.name} 사회자
                </p>
                <p className="text-white/40 text-xs truncate">{result.top.highlight}</p>
              </div>
              <a
                href={result.top.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold"
                style={{ background: "rgba(214,177,107,0.15)", border: "1px solid rgba(214,177,107,0.4)", color: "#d6b16b" }}
              >
                프로필 보기
              </a>
            </div>

            {/* 공유 */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#FEE500", color: "#3C1E1E" }}
              >
                <Copy size={13} />
                카카오톡 공유
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg text-sm transition-all duration-200 hover:opacity-80"
                style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              >
                <RotateCcw size={13} />
                다시 하기
              </button>
              <a
                href="https://pf.kakao.com/_wxovaM/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#5BB5A2", color: "#fff" }}
              >
                💬 카카오 상담하기
              </a>
            </div>
          </div>
        )}

        {toast && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-semibold z-[300] pointer-events-none"
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              background: "rgba(91,181,162,0.95)",
              color: "#0d0d0d",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              animation: "bgFadeInUp 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            {toast}
          </div>
        )}

        <style>{`
          @keyframes bgFadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
