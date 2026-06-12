import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, Video, Shield } from "lucide-react";

const HALL_IMG = "/images/wedding-stage-mic.webp";

const DIFFERENCES = [
  {
    icon: Shield,
    num: "01",
    title: "합리적인 가격 구조, 검증된 완성도",
    desc: "숨겨진 추가 비용 없이 명확한 견적으로 신뢰를 드립니다.",
  },
  {
    icon: Video,
    num: "02",
    title: "영상 기반, 선택 가능한 사회자 시스템",
    desc: "실제 진행 영상을 미리 확인하고 직접 선택하세요.",
  },
  {
    icon: CheckCircle,
    num: "03",
    title: "완성형 웨딩 패키지 설계",
    desc: "사회자부터 음향·연주까지 한 번에 설계해드립니다.",
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
            합리적인 선택, <span className="text-[#d4b896]">확실한 차이</span>
          </h2>
        </div>

        {/* Content: Image + Cards */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
            {/* Image */}
            <div className="relative rounded-sm overflow-hidden min-h-[340px] lg:min-h-0">
              <img
                src={HALL_IMG}
                alt="프리미엄 웨딩 무대"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {DIFFERENCES.map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white rounded-sm p-6 sm:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5"
                  style={{
                    border: "1px solid rgba(212,184,150,0.22)",
                    boxShadow: "0 2px 12px rgba(212,184,150,0.08)",
                  }}
                >
                  {/* 왼쪽 컬러 라인 */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-500 group-hover:w-1"
                    style={{ background: "linear-gradient(to bottom, #d4b896, #c9a87a)" }} />
                  {/* hover 배경 */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(135deg, rgba(212,184,150,0.06) 0%, transparent 60%)" }} />

                  <div className="relative flex items-start gap-5">
                    {/* 아이콘 원 — 골드 */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: "linear-gradient(145deg, rgba(212,184,150,0.18), rgba(212,184,150,0.08))",
                        border: "1px solid rgba(212,184,150,0.35)",
                      }}>
                      <item.icon size={20} style={{ color: "#d4b896" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {/* 번호 — 더 크고 강조 */}
                        <span
                          className="text-[#d4b896] font-semibold leading-none"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem" }}
                        >
                          {item.num}
                        </span>
                        <div className="flex-1 h-px bg-[#e8e4df]" />
                      </div>
                      <h3 className="text-[#1a1a1a] text-sm sm:text-base font-semibold leading-snug" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                        {item.title}
                      </h3>
                      <p className="text-[#666] text-xs sm:text-sm mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
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
