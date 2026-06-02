import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STAGE_IMG = "/manus-storage/wedding-stage_d8dd01ed_52791386.jpg";

const REASONS = [
  "사회경험 없는 지인에게 맡기기엔 부담을 느끼시는 분",
  "사례금을 얼마를 챙겨야 되는지 고민되시는 분",
  "검증되지 않은 업체에게 맡기기 불안하신 분",
  "한정된 예산 내에서 완성도를 놓치고 싶지 않으신 분",
];

export default function WhyUsSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section className="relative overflow-hidden">
      {/* Top: Dark section with background image */}
      <div className="relative py-24 sm:py-32">
        <div className="absolute inset-0">
          <img src={STAGE_IMG} alt="웨딩 스테이지" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
            <p className="text-white/50 text-sm sm:text-base mb-4">
              여러 업체를 비교하신 고객님들께서
            </p>
            <h2
              className="text-white text-2xl sm:text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              최종적으로 <span className="text-[#5BB5A2]">선택</span>하신 이유는
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10 mt-10 text-white/80 text-base sm:text-lg">
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#5BB5A2]" />
                실제 본식에서 확인되는 분위기
              </span>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#5BB5A2]" />
                완성도 높은 진행의 차이
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Light section */}
      <div className="bg-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div ref={anim2.ref} className={`text-center mb-14 fade-up ${anim2.isVisible ? "visible" : ""}`}>
            <h3
              className="text-[#1a1a1a] text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600 }}
            >
              이런 분들께 <span className="text-[#5BB5A2]">전문 사회자</span>를 추천드립니다
            </h3>
          </div>

          <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REASONS.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 p-6 sm:p-8 bg-[#faf9f7] border border-[#eee] rounded-sm hover:border-[#5BB5A2]/30 transition-all duration-400"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center">
                    <span className="text-[#5BB5A2] text-base sm:text-lg font-bold">{i + 1}</span>
                  </span>
                  <p className="text-[#333] text-base sm:text-lg leading-relaxed pt-1.5">{reason}</p>
                </div>
              ))}
            </div>

            {/* Bottom message */}
            <div className="mt-14 text-center bg-[#0d0d0d] rounded-sm p-8 sm:p-10">
              <p className="text-[#5BB5A2] text-sm tracking-wider mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                INUSMUSIC PROMISE
              </p>
              <p className="text-white text-sm sm:text-base leading-[1.9]">
                친한 지인의 예식이라 생각하는 마음으로,
                <br />
                합리적인 예산과 체계적인 설계를 통해
                <br />
                신랑신부님의 소중한 순간을 더욱 완성도 높게 만들어드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
