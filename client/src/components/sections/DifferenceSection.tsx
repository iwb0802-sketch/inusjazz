import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, Video, Shield } from "lucide-react";

const HALL_IMG = "/images/wedding-stage-mic.webp";

const DIFFERENCES = [
  {
    icon: Shield,
    num: "01",
    title: "합리적인 가격 구조, 검증된 완성도",
  },
  {
    icon: Video,
    num: "02",
    title: "영상 기반, 선택 가능한 사회자 시스템",
  },
  {
    icon: CheckCircle,
    num: "03",
    title: "완성형 웨딩 패키지 설계",
  },
];

export default function DifferenceSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();

  return (
    <section className="relative bg-[#f8f6f3] py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 sm:mb-20 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            INUSMUSIC DIFFERENCE
          </span>
          <h2
            className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            합리적인 선택, <span className="text-[#5BB5A2]">확실한 차이</span>
          </h2>
        </div>

        {/* Content: Image + Cards */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image */}
            <div className="relative rounded-sm overflow-hidden aspect-[4/3]">
              <img
                src={HALL_IMG}
                alt="프리미엄 웨딩 무대"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Cards */}
            <div className="space-y-6">
              {DIFFERENCES.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white border border-[#e8e4df] rounded-sm p-6 sm:p-8 hover:border-[#5BB5A2]/40 hover:shadow-lg transition-all duration-500"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                      <span
                        className="text-[#d4b896] text-3xl font-light"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {item.num}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <h3 className="text-[#1a1a1a] text-xs sm:text-lg font-semibold leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
