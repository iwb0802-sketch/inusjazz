import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, ScrollText, Zap } from "lucide-react";
import CountUpNumber from "@/components/CountUpNumber";

const GOLD = "#d4b896";

export default function IntroSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();

  return (
    <section id="intro" className="bg-[#0d0d0d] py-16 sm:py-20 lg:py-24 relative">
      {/* 상단 Hero → Intro 전환 그라데이션 */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, #050505 0%, transparent 100%)" }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
        {/* 헤드라인 */}
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-[11px] sm:text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Since 2015 &middot; Trusted Experience
          </span>
          <h2
            className="mt-4 text-white text-xl sm:text-3xl md:text-4xl leading-snug break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            검증된 웨딩 전문 브랜드,
            <br className="sm:hidden" />
            <span className="text-[#5BB5A2]"> 이너스뮤직</span>입니다.
          </h2>
          <p className="mt-4 text-white/55 text-[13px] sm:text-base leading-relaxed max-w-xl mx-auto break-keep">
            <strong className="text-white font-semibold">300회 이상</strong> 실전 경험을 갖춘 전문 사회자만 엄선해
            <br className="hidden sm:block" />
            <span className="whitespace-nowrap"> 예식의 흐름과 분위기</span>를 완성합니다.
          </p>
        </div>

        {/* 숫자 3종 — 한 줄 압축 */}
        <div
          className="mt-9 sm:mt-12 grid grid-cols-3 rounded-sm overflow-hidden"
          style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.06) 0%, rgba(212,184,150,0.02) 100%)", border: "1px solid rgba(212,184,150,0.14)" }}
        >
          {[
            { value: <>2015</>, en: "Since", label: "10년 이상 경험" },
            {
              value: (
                <>
                  <CountUpNumber targetNumber={2500} duration={2000} className="text-[#d4b896]" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                  <span className="text-base sm:text-xl text-white/40 ml-0.5">+</span>
                </>
              ),
              en: "Reviews",
              label: "실제 본식 후기",
            },
            {
              value: (
                <>
                  <CountUpNumber targetNumber={40000} duration={2000} className="text-[#d4b896]" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                  <span className="text-base sm:text-xl text-white/40 ml-0.5">+</span>
                </>
              ),
              en: "Couples",
              label: "함께한 예식",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="px-2 py-6 sm:py-8"
              style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(212,184,150,0.14)" }}
            >
              <p
                className="text-[#d4b896] text-[26px] sm:text-4xl font-bold tracking-tight leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.value}
              </p>
              <p className="text-white/30 text-[9px] sm:text-[11px] tracking-[0.2em] uppercase mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {s.en}
              </p>
              <p className="text-white text-[11px] sm:text-sm font-medium mt-1 break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* 신뢰 보증 3종 — 칩 형태로 압축 */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { Icon: ShieldCheck, label: "No-show 걱정 없는 인력 관리" },
              { Icon: ScrollText, label: "전속 계약 100% 책임 진행" },
              { Icon: Zap, label: "돌발 상황 즉각 대응" },
            ].map(({ Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-sm break-keep"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Icon size={16} style={{ color: GOLD }} className="shrink-0" />
                <span className="text-white/85 text-[12.5px] sm:text-sm" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
