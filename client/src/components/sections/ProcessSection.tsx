/**
 * ProcessSection - 웨딩 사회자 서비스 프로세스 7단계
 * Design: Dark background, 3 grouped phase cards
 * Brand: Gold (#d4b896) primary accent
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
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
} from "lucide-react";

const GOLD = "#d4b896";

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
      },
      {
        num: "02",
        icon: FileText,
        title: "사전 질문지 & 예식자료 제공",
        desc: "두 사람의 스토리와 예식 정보를 담은 질문지 전달",
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
        desc: "예식 2~3주 전, 전하고 싶은 메시지와 스토리 정리",
      },
      {
        num: "04",
        icon: PenTool,
        title: "대표 맞춤 대본 제작",
        desc: "10년+ 경력 대표가 직접 맞춤 대본 제작 (1~3일)",
      },
      {
        num: "05",
        icon: Headphones,
        title: "본사 최종 안내",
        desc: "화요일, 전문 상담 직원이 일정과 진행사항 최종 체크",
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
        desc: "수요일, 완성 대본 기반 최종 확인 및 세밀 조율",
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
                          <p className="text-white/90 text-sm font-medium leading-snug">
                            {step.title}
                          </p>
                          <p className="text-white/40 text-xs mt-1 leading-relaxed">
                            {step.desc}
                          </p>
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
      </div>
    </section>
  );
}
