import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Calendar, FileText, Users, ShieldCheck, ScrollText, Zap } from "lucide-react";
import CountUpNumber from "@/components/CountUpNumber";

export default function IntroSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();
  const anim4 = useScrollAnimation();

  return (
    <section id="intro" className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-40 relative">
      {/* 상단 Hero → Intro 전환 그라데이션 */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #050505 0%, transparent 100%)" }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Top badge */}
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Since 2015 &middot; Trusted Experience
          </span>
          <div className="w-12 h-px bg-[#d4b896]/40 mx-auto mt-6 mb-12" />
        </div>

        {/* Main heading */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
            이미 수많은 신랑신부님들이 선택한
          </p>
          <h2
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            검증된 웨딩 전문 브랜드,
            <br />
            <span className="text-[#5BB5A2]">이너스뮤직</span>입니다.
          </h2>
        </div>

        {/* Stats - 큰 숫자 강조 카드 */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {/* SINCE 2015 */}
            <div className="relative rounded-sm px-6 py-10 sm:py-12 hover:border-[#d4b896]/30 transition-all duration-500 group overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.06) 0%, rgba(212,184,150,0.02) 100%)", border: "1px solid rgba(212,184,150,0.12)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,184,150,0.4), transparent)" }} />
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(212,184,150,0.10)", border: "1px solid rgba(212,184,150,0.20)" }}>
                  <Calendar size={24} className="text-[#d4b896]" />
                </div>
              </div>
              <p
                className="text-[#d4b896] text-4xl sm:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                2015
              </p>
              <div className="w-8 h-px bg-[#d4b896]/25 mx-auto my-3" />
              <p className="text-white/35 text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Since</p>
              <p
                className="text-white text-sm sm:text-base font-semibold"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                10년 이상 웨딩 진행 경험
              </p>
            </div>

            {/* 본식 후기 1,000건 */}
            <div className="relative rounded-sm px-6 py-10 sm:py-12 hover:border-[#d4b896]/30 transition-all duration-500 group overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.06) 0%, rgba(212,184,150,0.02) 100%)", border: "1px solid rgba(212,184,150,0.12)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,184,150,0.4), transparent)" }} />
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(212,184,150,0.10)", border: "1px solid rgba(212,184,150,0.20)" }}>
                  <FileText size={24} className="text-[#d4b896]" />
                </div>
              </div>
              <p className="text-[#d4b896] text-4xl sm:text-5xl font-bold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <CountUpNumber
                  targetNumber={1000}
                  duration={2000}
                  className="text-[#d4b896]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                />
                <span className="text-xl text-white/40 ml-1">+</span>
              </p>
              <div className="w-8 h-px bg-[#d4b896]/25 mx-auto my-3" />
              <p className="text-white/35 text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Reviews</p>
              <p
                className="text-white text-sm sm:text-base font-semibold"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                실제 고객 본식 후기
              </p>
            </div>

            {/* 40,000쌍 이상 */}
            <div className="relative rounded-sm px-6 py-10 sm:py-12 hover:border-[#d4b896]/30 transition-all duration-500 group overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.06) 0%, rgba(212,184,150,0.02) 100%)", border: "1px solid rgba(212,184,150,0.12)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,184,150,0.4), transparent)" }} />
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(212,184,150,0.10)", border: "1px solid rgba(212,184,150,0.20)" }}>
                  <Users size={24} className="text-[#d4b896]" />
                </div>
              </div>
              <p className="text-[#d4b896] text-4xl sm:text-5xl font-bold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <CountUpNumber
                  targetNumber={40000}
                  duration={2000}
                  className="text-[#d4b896]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                />
                <span className="text-xl text-white/40 ml-1">+</span>
              </p>
              <div className="w-8 h-px bg-[#d4b896]/25 mx-auto my-3" />
              <p className="text-white/35 text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Couples</p>
              <p
                className="text-white text-sm sm:text-base font-semibold"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                함께한 소중한 예식
              </p>
            </div>
          </div>
        </div>

        <div className="w-16 h-px bg-white/10 mx-auto my-12 sm:my-16" />

        {/* Description */}
        <div ref={anim4.ref} className={`fade-up ${anim4.isVisible ? "visible" : ""}`}>
          <p className="text-white/60 text-sm sm:text-base leading-[1.9] max-w-2xl mx-auto break-keep">
            결혼식 사회자는 단순 진행자가 아닌 예식의 분위기와 흐름을 결정하는 <strong className="text-white">핵심 요소</strong>입니다.
          </p>
          <p className="text-white/60 text-sm sm:text-base leading-[1.9] max-w-2xl mx-auto mt-4 break-keep">
            이너스뮤직은 <strong className="text-[#5BB5A2]">300회 이상</strong> 실전 경험을 갖춘<br className="sm:hidden" />
            전문 사회자만 엄선하여<br className="sm:hidden" />
            완성도 높은 예식을 만들어드립니다.
          </p>

          {/* Trust badges */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { Icon: ShieldCheck, label: "No-show 걱정 없는", sub: "철저한 인력 관리 시스템", color: "#d4b896" },
              { Icon: ScrollText, label: "전속 계약 시스템으로", sub: "100% 책임 진행 보장", color: "#d4b896" },
              { Icon: Zap, label: "돌발 상황에도", sub: "즉각적인 완벽 대응", color: "#d4b896" },
            ].map(({ Icon, label, sub, color }, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-sm px-6 py-6 sm:py-8 transition-all duration-500 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}55, transparent)` }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.05) 0%, transparent 100%)" }} />
                <div className="flex justify-center mb-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(212,184,150,0.10)", border: "1px solid rgba(212,184,150,0.20)" }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                </div>
                <p className="text-white text-sm sm:text-base font-semibold leading-snug" style={{ fontFamily: "'Noto Serif KR', serif" }}>{label}</p>
                <p className="text-white/50 text-xs sm:text-sm mt-2">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
