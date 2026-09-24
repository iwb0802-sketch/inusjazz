/**
 * ProcessSection - 웨딩 사회자 서비스 프로세스 7단계
 * Design: Dark background, 3 grouped phase cards
 * Brand: Gold (#d4b896) primary accent
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import {
  CalendarCheck,
  FileText,
  Mail,
  PenTool,
  Headphones,
  MessageSquare,
  MapPin,
  ClipboardList,
  Pencil,
  PartyPopper,
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
    desc: "화요일 본사 최종 체크, 수요일엔 사회자가 신랑신부님께 직접 연락드려 이미 전달받은 대본을 한 번 더 점검합니다.",
  },
  {
    num: "04",
    icon: Crown,
    label: "대표 상시 대기",
    title: "돌발 변수까지 책임집니다",
    desc: "예비 사회자 상시 대기는 물론, 대표가 예식 당일까지 직접 함께해 현장 변수도 그 자리에서 바로 잡습니다.",
  },
];

const PHASES = [
  {
    phase: "PHASE 1",
    title: "예약 준비",
    icon: ClipboardList,
    steps: [
      {
        num: "01",
        icon: CalendarCheck,
        title: "예약 & 사회자 지정",
        desc: "원하시는 스타일에 맞는 사회자를 직접 지정",
        note: "지정된 사회자는 인사차 1차 해피콜 연락드립니다",
      },
      {
        num: "02",
        icon: FileText,
        title: "사전 질문지 & 예식자료 제공",
        desc: "두 사람의 스토리와 예식 정보를 담은 질문지와 정보체크지 전달",
      },
    ],
  },
  {
    phase: "PHASE 2",
    title: "대본 제작",
    icon: Pencil,
    steps: [
      {
        num: "03",
        icon: Mail,
        title: "대본 내용 회신",
        desc: "예식 2~3주 전까지, 두 분의 스토리가 담긴 질문지와 정보체크지 회신",
        note: "질문지와 정보체크지를 미리 보내주실수록 맞춤 대본 제작이 더 빨라집니다",
      },
      {
        num: "04",
        icon: PenTool,
        title: "대표 맞춤 대본 제작",
        badge: "무제한 수정 가능",
        desc: "10년+ 경력 대표가 직접 제작해 두 분과 사회자에게 함께 전달, 마음에 드실 때까지 자유롭게 수정해드립니다 (제작기간: 3~5일)",
      },
      {
        num: "05",
        icon: Headphones,
        title: "본사 최종 안내",
        desc: "예식주 화요일, 전문 상담 직원이 일정과 진행사항 최종 체크",
      },
    ],
  },
  {
    phase: "PHASE 3",
    title: "당일 진행",
    icon: PartyPopper,
    steps: [
      {
        num: "06",
        icon: MessageSquare,
        title: "사회자 최종 확인",
        desc: "예식주 수요일, 이미 전달받은 대본을 바탕으로 사회자가 신랑신부님께 다시 연락드려 함께 점검하고 한 번 더 다듬는 최종 확인",
      },
      {
        num: "07",
        icon: MapPin,
        title: "예식당일 현장 도착",
        desc: "예식 40~50분 전 도착, 리허설 및 준비 마무리",
      },
    ],
  },
];

export default function ProcessSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <section id="process" className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 sm:mb-20 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SERVICE PROCESS
          </span>
          <h2
            className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            체계적인 <span style={{ color: GOLD }}>7단계</span> 맞춤 진행
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base">
            예약부터 당일 진행까지, 빈틈없는 프로세스로 완성도를 높입니다
          </p>
        </div>

        {/* Phase Cards */}
        <div
          ref={anim2.ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 fade-up ${anim2.isVisible ? "visible" : ""}`}
        >
          {PHASES.map((phase, pi) => {
            const PhaseIcon = phase.icon;
            return (
              <div
                key={pi}
                className="group bg-[#141414] rounded-sm overflow-hidden transition-all duration-500"
                style={{
                  border: "1px solid rgba(212,184,150,0.18)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(212,184,150,0.45)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212,184,150,0.10)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(212,184,150,0.18)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.4)";
                }}
              >
                {/* Phase Header */}
                <div
                  className="px-6 py-5 border-b"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,184,150,0.08), transparent)",
                    borderColor: "rgba(212,184,150,0.12)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(212,184,150,0.15)",
                        border: "1px solid rgba(212,184,150,0.35)",
                      }}
                    >
                      <PhaseIcon size={18} style={{ color: GOLD }} />
                    </div>
                    <div>
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase block"
                        style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {phase.phase}
                      </span>
                      <h3
                        className="text-white text-base sm:text-lg font-semibold"
                        style={{ fontFamily: "'Noto Serif KR', serif" }}
                      >
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="px-6 py-5 space-y-4">
                  {phase.steps.map((step, si) => {
                    return (
                      <div key={si} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <span
                            className="font-semibold text-xs"
                            style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            {step.num}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 text-sm font-medium leading-snug flex items-center gap-1.5 flex-wrap break-keep">
                            {step.title}
                            {"badge" in step && step.badge && (
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm tracking-wide"
                                style={{
                                  color: GOLD,
                                  backgroundColor: "rgba(212,184,150,0.15)",
                                  border: "1px solid rgba(212,184,150,0.4)",
                                }}
                              >
                                {step.badge}
                              </span>
                            )}
                          </p>
                          <p className="text-white/65 text-xs mt-1 leading-relaxed break-keep">
                            {step.desc}
                          </p>
                          {"note" in step && step.note && (
                            <p className="text-white/45 text-[11px] mt-1 leading-relaxed break-keep">
                              {step.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom flow indicator */}
        <div className="mt-10 sm:mt-14 flex items-center justify-center gap-3 sm:gap-4">
          {PHASES.map((phase, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                <span className="text-white/50 text-xs sm:text-sm">{phase.title}</span>
              </div>
              {i < PHASES.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* 대본 제작 과정 맛보기 버튼 */}
        <div className="mt-10 sm:mt-14 flex justify-center">
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

        {/* Final Step - 예약 결정 전 신뢰 포인트 */}
        <div className="mt-20 sm:mt-28 pt-14 sm:pt-16 border-t" style={{ borderColor: "rgba(212,184,150,0.15)" }}>
          <div className="text-center mb-10 sm:mb-14">
            <span
              className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              FINAL STEP
            </span>
            <h3
              className="mt-4 text-white text-xl sm:text-2xl md:text-3xl break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              예약 <span style={{ color: GOLD }}>결정</span> 전,
              <br className="sm:hidden" /> 꼭 확인하시면 좋은 것
            </h3>
            <p className="mt-4 text-white/50 text-sm sm:text-base break-keep">
              결혼식은 단 한 번뿐입니다. 이너스뮤직은 그 무게를 시스템으로 지킵니다.
            </p>
          </div>

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
