import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Calendar, FileText, Users } from "lucide-react";

export default function IntroSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();
  const anim4 = useScrollAnimation();

  return (
    <section id="intro" className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-40">
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
            <div className="relative border border-white/10 rounded-sm px-6 py-8 sm:py-10 hover:border-[#5BB5A2]/30 transition-all duration-500 group">
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center group-hover:bg-[#5BB5A2]/20 transition-colors duration-500">
                  <Calendar size={22} className="text-[#5BB5A2]" />
                </div>
              </div>
              <p
                className="text-[#5BB5A2] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                SINCE 2015
              </p>
              <p
                className="text-white text-base sm:text-lg font-semibold mt-3"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                10년 이상 축적된 웨딩 진행 경험
              </p>
            </div>

            {/* 본식 후기 1,000건 */}
            <div className="relative border border-white/10 rounded-sm px-6 py-8 sm:py-10 hover:border-[#5BB5A2]/30 transition-all duration-500 group">
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center group-hover:bg-[#5BB5A2]/20 transition-colors duration-500">
                  <FileText size={22} className="text-[#5BB5A2]" />
                </div>
              </div>
              <p className="text-[#5BB5A2] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>1,000</span>
                <span className="text-lg sm:text-xl lg:text-2xl text-white/60 ml-1">건 이상</span>
              </p>
              <p
                className="text-white text-base sm:text-lg font-semibold mt-3"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                실제 고객이 남긴 본식 후기
              </p>
            </div>

            {/* 40,000쌍 이상 */}
            <div className="relative border border-white/10 rounded-sm px-6 py-8 sm:py-10 hover:border-[#5BB5A2]/30 transition-all duration-500 group">
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center group-hover:bg-[#5BB5A2]/20 transition-colors duration-500">
                  <Users size={22} className="text-[#5BB5A2]" />
                </div>
              </div>
              <p className="text-[#5BB5A2] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>40,000</span>
                <span className="text-lg sm:text-xl lg:text-2xl text-white/60 ml-1">쌍 이상</span>
              </p>
              <p
                className="text-white text-base sm:text-lg font-semibold mt-3"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                오랜 시간 축적된 운영 노하우
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
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "No-show 걱정 없는", sub: "철저한 인력 관리" },
              { label: "전속 계약 시스템으로", sub: "100% 책임 진행" },
              { label: "돌발 상황에도", sub: "완벽 대응" },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-sm px-8 py-7 hover:border-[#5BB5A2]/30 transition-colors duration-500"
              >
                <p className="text-white text-base sm:text-lg font-semibold">{item.label}</p>
                <p className="text-white/60 text-sm sm:text-base mt-2">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
