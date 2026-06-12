/**
 * RecommendSection - "이런 분들께 전문 사회자를 추천드립니다"
 * Design: Dark bg, 2x2 card grid with mint accent icons, closing statement
 * Matches premium dark tone of IntroSection
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { UserX, CircleDollarSign, ShieldQuestion, Sparkles } from "lucide-react";

const RECOMMEND_ITEMS = [
  {
    icon: UserX,
    title: "지인에게 맡기기엔 부담되시는 분",
    sub: "사회경험 없는 지인 대신 전문가에게",
  },
  {
    icon: CircleDollarSign,
    title: "사례금 고민이 되시는 분",
    sub: "명확한 가격, 투명한 비용 구조",
  },
  {
    icon: ShieldQuestion,
    title: "검증되지 않은 업체가 불안하신 분",
    sub: "10년 경력, 실제 영상으로 검증",
  },
  {
    icon: Sparkles,
    title: "한정된 예산 내 완성도를 원하시는 분",
    sub: "합리적 예산으로 높은 퀄리티",
  },
];

export default function RecommendSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-36 relative overflow-hidden">

      {/* 하단 페이드아웃 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, #0d0d0d 100%)" }} />
      {/* Subtle background accent */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4b896] blur-[200px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-14 sm:mb-18 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            WHO WE RECOMMEND
          </span>
          <h2
            className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl leading-snug"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            이런 분들께<br className="sm:hidden" /> <span className="text-[#d4b896]">전문 사회자</span>를 추천드립니다
          </h2>
        </div>

        {/* 2x2 Card Grid */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {RECOMMEND_ITEMS.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-sm p-6 sm:p-8 transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* 상단 라인 강조 */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to right, transparent, rgba(212,184,150,0.6), transparent)" }} />
                {/* hover 배경 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.05) 0%, transparent 100%)" }} />

                <div className="relative flex items-start gap-5">
                  {/* 아이콘 번호 배지 */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{ background: "rgba(212,184,150,0.1)", border: "1px solid rgba(212,184,150,0.25)" }}>
                      <item.icon size={19} className="text-[#d4b896]" />
                    </div>
                    <span className="text-[#d4b896]/60 text-[10px] tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      0{i + 1}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3
                      className="text-white text-sm sm:text-base font-semibold leading-snug"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-white/45 text-xs sm:text-sm mt-2 leading-relaxed">
                      {item.sub}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <div className="mt-14 sm:mt-18 text-center">
            <div className="w-12 h-px bg-[#d4b896]/40 mx-auto mb-8" />
            <p className="text-white/70 text-sm sm:text-base leading-[1.9] max-w-xl mx-auto break-keep">
              이너스뮤직은 <strong className="text-white">친한 지인의 예식이라 생각하는 마음</strong>으로,
              <br className="hidden sm:block" />
              합리적인 예산과 체계적인 설계를 통해
              <br />
              소중한 순간을 더욱 완성도 높게 만들어드립니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
