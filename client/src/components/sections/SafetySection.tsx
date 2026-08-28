/**
 * SafetySection - 예식 당일 안심 시스템 (컴팩트)
 * 특별 이벤트 섹션 바로 아래 배치. 내용은 유지하고 여백·장식만 압축
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, FileText, Clock, Users, Check } from "lucide-react";

const SYSTEMS = [
  { icon: FileText, l1: "전속 계약 진행으로", l2: "No-show 걱정 없음" },
  { icon: Clock, l1: "예식 2시간 전 / 1시간 전", l2: "이중 체크" },
  { icon: Users, l1: "예비 인력 시스템", l2: "상시 대기" },
];

export default function SafetySection() {
  const anim = useScrollAnimation();

  return (
    <section id="safety" className="bg-[#f8f6f3] py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={anim.ref} className={`fade-up ${anim.isVisible ? "visible" : ""}`}>
          {/* Header */}
          <div className="text-center mb-7 sm:mb-9">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <div className="h-px w-8 bg-[#d4b896]/50" />
              <ShieldCheck size={17} className="text-[#2f8b78]" />
              <div className="h-px w-8 bg-[#d4b896]/50" />
            </div>

            <h2
              className="text-[#1a1a1a] text-[19px] min-[375px]:text-[21px] sm:text-[26px] leading-snug break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              <span className="whitespace-nowrap">예식 당일,</span>{" "}
              <span className="text-[#2f8b78] whitespace-nowrap">가장 걱정되는 부분</span>
            </h2>

            <p className="mt-2 text-[#777] text-[13px] sm:text-sm leading-relaxed break-keep">
              <span className="whitespace-nowrap">혹시 모를 변수나</span>{" "}
              <span className="whitespace-nowrap">당일 진행에 대한 불안감</span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> — </span>
              <span className="text-[#2f8b78] font-semibold whitespace-nowrap">시스템으로 대비합니다.</span>
            </p>
          </div>

          {/* 3 Systems */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            {SYSTEMS.map((c) => (
              <div
                key={c.l2}
                className="flex items-center gap-3 md:flex-col md:text-center bg-white border border-[#e8e4df] rounded-lg px-4 py-3.5 sm:py-5 transition-all duration-300 hover:border-[#2f8b78]/30 hover:shadow-md"
              >
                <div className="w-9 h-9 rounded-full border border-[#d4b896]/40 flex items-center justify-center flex-shrink-0">
                  <c.icon size={17} className="text-[#c09a7e]" strokeWidth={1.6} />
                </div>
                <div className="min-w-0 flex-1 md:flex-none">
                  <p className="text-[#1a1a1a] text-[13.5px] sm:text-[15px] font-semibold leading-snug break-keep">
                    {c.l1}
                  </p>
                  <p className="text-[#1a1a1a] text-[13.5px] sm:text-[15px] font-semibold leading-snug break-keep">
                    {c.l2}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#2f8b78] flex items-center justify-center flex-shrink-0 md:mt-2">
                  <Check size={12} className="text-white" />
                </div>
              </div>
            ))}
          </div>

          {/* 마무리 */}
          <p className="mt-5 text-center text-[#666] text-[12.5px] sm:text-sm leading-relaxed break-keep">
            <span className="whitespace-nowrap">마지막까지</span>{" "}
            <span className="text-[#2f8b78] font-semibold whitespace-nowrap">안정적으로 완성되는 예식</span>
            <span className="whitespace-nowrap">을 직접 경험하실 수 있습니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
