/**
 * ScriptPreviewModal - 대본 제작 과정 맛보기
 * 프리미엄 제작 프로세스 + 일반 대본 vs 이너스 맞춤 대본 비교 (일부만 공개, 나머지는 블러 처리)
 */
import { useEffect, useRef, useState } from "react";
import { X, FileEdit, Users, Sparkles, CheckCircle2, Lock, ChevronDown } from "lucide-react";

const GOLD = "#d6b16b";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    num: "01",
    icon: FileEdit,
    title: "맞춤 질문지 작성",
    desc: "두 분의 첫 만남, 서로의 매력, 부모님께 드리는 감사 인사 등 예식에 꼭 필요한 이야기를 질문지로 전달받습니다.",
  },
  {
    num: "02",
    icon: Users,
    title: "스토리 매칭",
    desc: "회신받은 답변 속 키워드와 에피소드를 대표가 직접 분석해, 두 사람만의 서사로 재구성합니다.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "맞춤 대본 초안 제작",
    desc: "10년+ 경력 대표가 신랑·신부 입장, 성혼선언, 덕담 등 순서마다 스토리를 입힌 대본을 직접 집필합니다.",
  },
  {
    num: "04",
    icon: CheckCircle2,
    title: "최종 확정 & 사회자 전달",
    desc: "본사 최종 검수 후 담당 사회자에게 전달, 예식 전 사회자가 톤과 디테일을 한 번 더 다듬습니다.",
  },
];

export default function ScriptPreviewModal({ isOpen, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setShowScrollHint(true);
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      const scrollable = el.scrollHeight > el.clientHeight + 24;
      setShowScrollHint(scrollable && !atBottom);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    const timer = setTimeout(checkScroll, 200);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[250] overflow-y-auto flex flex-col items-center py-6 px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", WebkitOverflowScrolling: "touch" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl flex flex-col"
        style={{
          background: "linear-gradient(160deg, #141414 0%, #0d0d0d 100%)",
          border: "1px solid rgba(214,177,107,0.2)",
          borderRadius: "12px",
          animation: "fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(214,177,107,0.12)", background: "#141414", borderRadius: "12px 12px 0 0" }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
            >
              SCRIPT PREVIEW
            </p>
            <h3
              className="text-white text-base sm:text-lg font-bold mt-0.5"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              대본 제작 과정 맛보기
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <X size={15} />
          </button>
        </div>

        <div ref={scrollRef} className="px-5 sm:px-7 py-6 sm:py-8 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* 프로세스 */}
          <p
            className="text-white/50 text-xs sm:text-sm mb-5 leading-relaxed"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            이너스뮤직의 맞춤 대본은 정형화된 템플릿이 아니라, 두 분의 이야기를 직접 취재해 한 줄 한 줄 새로 씁니다.
          </p>

          <div className="space-y-3 mb-8 sm:mb-10">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(214,177,107,0.12)" }}
                >
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(214,177,107,0.12)", border: "1px solid rgba(214,177,107,0.35)" }}
                  >
                    <Icon size={16} style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {s.num}
                      </span>
                      <p className="text-white text-sm sm:text-[15px] font-semibold">{s.title}</p>
                    </div>
                    <p className="text-white/45 text-xs sm:text-sm mt-1.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 대본 제작 철학 — 균형 */}
          <div
            className="mb-8 sm:mb-10 p-4 sm:p-5 rounded-lg"
            style={{ background: "rgba(214,177,107,0.05)", border: "1px solid rgba(214,177,107,0.18)" }}
          >
            <p
              className="text-[11px] font-semibold tracking-[0.15em] mb-2.5"
              style={{ color: GOLD, fontFamily: "'Noto Serif KR', serif" }}
            >
              참고사항
            </p>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed break-keep mb-2.5">
              가뜩이나 신경 쓰실 것 많은 두 분을 위해, 예식에 꼭 필요한 핵심사항을 간결하게 파악해 대본에 담습니다.
            </p>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed break-keep">
              그리고 대본에만 과도하게 의존하면 사회자 고유의 개성이 묻힐 수 있죠.
              <br />
              두 분의 스토리는 살리되, 사회자의 텐션과 스타일이 자연스럽게 드러날 수 있도록 균형 있게 대본을 제작합니다.
            </p>
          </div>

          {/* Before & After 비교 */}
          <div className="mb-2">
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-1"
              style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
            >
              BEFORE / AFTER
            </p>
            <h4
              className="text-white text-sm sm:text-base font-bold mb-4"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              신랑 입장 멘트, 이렇게 달라집니다
            </h4>
          </div>

          <div className="space-y-3">
            {/* 일반 대본 */}
            <div
              className="p-4 sm:p-5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-white/40 text-[11px] tracking-widest uppercase">일반 대본</span>
              <p className="text-white/60 text-sm sm:text-[15px] mt-2 leading-relaxed">
                "자 그럼 멋진 신랑의 입장이 있겠습니다. 신랑 입장할 때 큰 박수 부탁드립니다. 신랑입장!!!!"
              </p>
            </div>

            {/* 이너스 맞춤 대본 - 일부만 공개, 나머지 블러 */}
            <div
              className="relative p-4 sm:p-5 rounded-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(214,177,107,0.08), rgba(255,255,255,0.02))",
                border: "1px solid rgba(214,177,107,0.35)",
              }}
            >
              <span
                className="text-[11px] tracking-widest uppercase font-semibold"
                style={{ color: GOLD }}
              >
                이너스 맞춤 대본
              </span>
              <p className="text-white/85 text-sm sm:text-[15px] mt-2 leading-relaxed">
                "신부는 신랑을 이렇게 말했습니다. '웃을 때마다 해맑게 피어나는 미소가 이 사람의 트레이드마크인데요,{" "}
                <span className="relative inline">
                  <span className="blur-[5px] select-none">
                    다정다감한 성격으로 곁에 있으면 자연스럽게 마음이 편안해집니다. 그리고 어떤 상황에서도 긍정적인 마인드를 잃지 않는 모습이 가장 큰 매력입니다.'
                  </span>
                </span>
              </p>
              <div
                className="mt-3 flex items-center gap-1.5 text-xs"
                style={{ color: GOLD }}
              >
                <Lock size={12} />
                <span>전체 대본은 두 분만을 위해 공개됩니다</span>
              </div>
            </div>
          </div>

          <p className="text-white/30 text-[11px] sm:text-xs mt-6 text-center leading-relaxed">
            질문지 답변을 바탕으로 두 분의 스토리가 담긴 완성 대본이 제작됩니다
          </p>

          <div
            className="mt-5 p-4 sm:p-5 rounded-lg text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
              스토리를 언급하는 것이 부담스러우신 신랑신부님도 계시죠.{" "}
              <br className="hidden sm:block" />
              미리 말씀만 주시면, 담백하고 정중한 톤으로 대본을 만들어드립니다.
            </p>
          </div>
        </div>

        {/* 스크롤 유도 힌트 */}
        {showScrollHint && (
          <div
            className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none"
            style={{
              borderRadius: "0 0 12px 12px",
              background: "linear-gradient(to top, #0d0d0d 20%, rgba(13,13,13,0))",
              paddingTop: "28px",
              paddingBottom: "10px",
            }}
          >
            <div
              className="flex items-center gap-1 text-[11px] sm:text-xs"
              style={{ color: GOLD, animation: "scriptScrollBounce 1.4s ease-in-out infinite" }}
            >
              <span>스크롤해서 더보기</span>
              <ChevronDown size={14} />
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scriptScrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
