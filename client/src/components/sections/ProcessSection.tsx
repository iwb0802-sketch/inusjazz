/**
 * ProcessSection - 책임 설계 (환불 타임라인 + 4단계 + 신뢰 포인트)
 * Design: Dark background, refund timeline → 4 steps → trust cards
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import {
  CalendarCheck,
  PenTool,
  Headphones,
  MapPin,
  Sparkles,
  ShieldCheck,
  FileEdit,
  RefreshCw,
  Crown,
} from "lucide-react";
import ScriptPreviewModal from "./ScriptPreviewModal";

const GOLD = "#d4b896";

const TRUST_POINTS = [
  {
    num: "01",
    icon: ShieldCheck,
    label: "검증된 사회자",
    title: "18인 전원, 예약 전에 직접 확인",
    desc: "목소리와 진행 영상을 예약 전 미리 확인하고 지정합니다. 현장에서 처음 만나는 사회자는 없습니다.",
  },
  {
    num: "02",
    icon: FileEdit,
    label: "맞춤 대본",
    title: "두 분의 이야기로 만든 대본",
    desc: "10년+ 경력 대표가 두 분의 스토리를 담아 직접 제작하고, 마음에 드실 때까지 무제한 수정해드립니다.",
  },
  {
    num: "03",
    icon: RefreshCw,
    label: "이중 점검 시스템",
    title: "예식주, 두 번 다시 확인합니다",
    desc: "화요일 본사 최종 체크, 수요일엔 사회자가 신랑신부님께 다시 연락드려 이미 전달받은 대본을 한 번 더 점검합니다.",
  },
  {
    num: "04",
    icon: Crown,
    label: "대표 상시 대기",
    title: "돌발 변수까지 책임집니다",
    desc: "예비 사회자가 대기하고, 대표도 서브 인원으로 대기하며 현장을 직접 확인합니다. 돌발 변수는 그 자리에서 바로 잡습니다.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: CalendarCheck,
    title: "예약 · 사회자 지정",
    desc: "목소리와 진행 영상을 확인하고 원하는 사회자를 직접 지정합니다. 지정 후 사회자가 인사 연락을 드립니다.",
  },
  {
    num: "02",
    icon: PenTool,
    title: "질문지 → 대표 맞춤 대본",
    badge: "무제한 수정",
    desc: "질문지와 정보체크지를 바탕으로 10년+ 경력 대표가 대본을 직접 제작합니다. 제작기간 3~5일.",
  },
  {
    num: "03",
    icon: Headphones,
    title: "예식주 점검",
    desc: "화요일 본사가 일정과 진행사항을 체크하고, 수요일엔 사회자가 신랑신부님께 다시 연락해 대본을 다듬습니다.",
  },
  {
    num: "04",
    icon: MapPin,
    title: "예식 당일",
    desc: "2시간 전·1시간 전 두 번 확인하고, 사회자는 예식 40~50분 전에 도착합니다.",
  },
];

export default function ProcessSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <section id="process" className="relative bg-[#0d0d0d] pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16" style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #0d0d0d 100%)" }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-10 sm:mb-12 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            OUR PROMISE
          </span>
          <h2
            className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            예식 당일까지 <span style={{ color: GOLD }}>책임 설계</span>합니다
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base break-keep">
            계약부터 예식까지, 4단계로 빈틈을 줄였습니다
          </p>
        </div>

        {/* 환불 타임라인 */}
        <div
          ref={anim2.ref}
          className={`mb-10 sm:mb-12 rounded-sm px-5 sm:px-8 py-6 sm:py-7 fade-up ${anim2.isVisible ? "visible" : ""}`}
          style={{ background: "#141414", border: "1px solid rgba(212,184,150,0.25)" }}
        >
          <div className="relative flex items-stretch">
            <div className="flex flex-col items-start flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
              <span className="mt-2 text-white/80 text-xs sm:text-sm">계약</span>
            </div>
            <div className="relative flex-1 mx-2 sm:mx-3">
              <div className="absolute left-0 right-0 top-[4px] h-[2px]" style={{ background: "linear-gradient(90deg, #d4b896, #d4b896)" }} />
              <p className="pt-4 sm:pt-5 text-center">
                <span
                  className="text-[26px] sm:text-[34px] leading-none"
                  style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                >
                  100%
                </span>
                <span className="ml-2 text-white text-xs sm:text-sm">계약금 환불</span>
              </p>
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: GOLD, background: "#0d0d0d" }} />
              <span className="mt-2 text-white/80 text-xs sm:text-sm whitespace-nowrap">예식 전주</span>
            </div>
            <div className="relative w-10 sm:w-20 mx-2 sm:mx-3">
              <div className="absolute left-0 right-0 top-[4px] h-[2px] bg-white/15" />
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <span className="mt-2 text-white/50 text-xs sm:text-sm">예식</span>
            </div>
          </div>
          <p className="mt-5 text-white/45 text-[11px] sm:text-xs text-center break-keep">
            사회자를 확정한 뒤에도 예식 전주까지는 계약금 전액을 돌려드립니다
          </p>
        </div>

        {/* 4 Steps */}
        <div ref={anim3.ref} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-up ${anim3.isVisible ? "visible" : ""}`}>
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#141414] rounded-sm p-5"
                style={{ border: "1px solid rgba(212,184,150,0.18)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl leading-none" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                    {step.num}
                  </span>
                  <Icon size={18} style={{ color: GOLD }} />
                </div>
                <p className="text-white text-[15px] font-semibold leading-snug break-keep flex items-center gap-1.5 flex-wrap" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {step.title}
                </p>
                {"badge" in step && step.badge && (
                  <span
                    className="inline-block mt-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm tracking-wide"
                    style={{ color: GOLD, backgroundColor: "rgba(212,184,150,0.15)", border: "1px solid rgba(212,184,150,0.4)" }}
                  >
                    {step.badge}
                  </span>
                )}
                <p className="mt-2.5 text-white/60 text-xs leading-relaxed break-keep">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 대본 제작 과정 맛보기 버튼 */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300"
            style={{
              background: "rgba(212,184,150,0.08)",
              border: "1px solid rgba(212,184,150,0.35)",
              color: GOLD,
              animation: "scriptGlowPulse 2.6s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,184,150,0.15)";
              (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(212,184,150,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,184,150,0.08)";
              (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(212,184,150,0.35)";
            }}
          >
            <Sparkles size={15} />
            대본 제작 과정 맛보기
          </button>
        </div>

        {/* 신뢰 포인트 */}
        <div className="mt-14 sm:mt-16 pt-10 sm:pt-12 border-t" style={{ borderColor: "rgba(212,184,150,0.15)" }}>
          <h3
            className="text-center mb-8 text-white text-lg sm:text-2xl break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            예약 <span style={{ color: GOLD }}>결정</span> 전, 꼭 확인하시면 좋은 것
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {TRUST_POINTS.map((point, ti) => {
              const PointIcon = point.icon;
              return (
                <div
                  key={ti}
                  className="flex items-start gap-4 px-6 py-6 rounded-sm bg-[#141414] transition-all duration-500"
                  style={{ border: "1px solid rgba(212,184,150,0.18)" }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "rgba(212,184,150,0.12)",
                      border: "1px solid rgba(212,184,150,0.35)",
                    }}
                  >
                    <PointIcon size={19} style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] tracking-[0.1em]" style={{ color: GOLD }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>{point.num}</span>
                      {" · "}
                      {point.label}
                    </span>
                    <p
                      className="mt-1.5 text-white text-base sm:text-lg font-semibold leading-snug break-keep"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {point.title}
                    </p>
                    <p className="mt-1.5 text-white/60 text-xs sm:text-sm leading-relaxed break-keep">
                      {point.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scriptGlowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,184,150,0.25), 0 0 8px rgba(212,184,150,0.15); }
          50% { box-shadow: 0 0 0 5px rgba(212,184,150,0), 0 0 18px rgba(212,184,150,0.4); }
        }
      `}</style>

      <ScriptPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </section>
  );
}
