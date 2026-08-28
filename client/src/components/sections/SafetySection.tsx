/**
 * SafetySection - 예식 당일 안심 시스템
 * PricingSection 하단에 있던 블록을 독립 섹션으로 분리 (특별 이벤트 섹션 바로 아래 배치)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, FileText, Clock, Users, Check, Award } from "lucide-react";

export default function SafetySection() {
  const anim = useScrollAnimation();

  return (
    <section id="safety" className="bg-[#f8f6f3] py-20 sm:py-28 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={anim.ref} className={`fade-up ${anim.isVisible ? "visible" : ""}`}>
          {/* Divider */}
          <div className="flex items-center justify-center mb-10">
            <div className="h-px w-16 bg-[#d4b896]/40" />
            <ShieldCheck size={24} className="mx-4 text-[#2f8b78]" />
            <div className="h-px w-16 bg-[#d4b896]/40" />
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h3
              className="text-[#1a1a1a] text-xl sm:text-2xl md:text-3xl break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              <span className="whitespace-nowrap">예식 당일,</span>{" "}
              <span className="text-[#2f8b78] whitespace-nowrap">가장 걱정되는 부분</span>
            </h3>
          </div>
          <p className="text-center text-[#777] text-sm sm:text-base mb-3 break-keep">
            혹시 모를 변수나
          </p>
          <p className="text-center text-[#777] text-sm sm:text-base mb-10 break-keep">
            당일 진행에 대한 불안감
          </p>

          {/* Dots separator */}
          <div className="flex items-center justify-center gap-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896]"></span>
          </div>

          {/* Sub heading */}
          <div className="text-center mb-12 sm:mb-14">
            <h4
              className="text-[#1a1a1a] text-lg sm:text-xl md:text-2xl break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              <span className="whitespace-nowrap">이너스뮤직은</span>{" "}
              <span className="whitespace-nowrap">
                <span className="text-[#2f8b78] underline underline-offset-4 decoration-[#2f8b78]/40 decoration-2">
                  시스템
                </span>
                으로 대비합니다.
              </span>
            </h4>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto mb-10">
            {[
              { icon: FileText, l1: "전속 계약 진행으로", l2: "No-show 걱정 없음" },
              { icon: Clock, l1: "예식 2시간 전 / 1시간 전", l2: "이중 체크" },
              { icon: Users, l1: "예비 인력 시스템", l2: "상시 대기" },
            ].map((c) => (
              <div
                key={c.l2}
                className="bg-white border border-[#e8e4df] rounded-sm p-6 sm:p-8 text-center hover:shadow-lg hover:border-[#5BB5A2]/30 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#d4b896]/30 flex items-center justify-center mx-auto mb-4">
                  <c.icon size={28} className="text-[#c09a7e]" strokeWidth={1.5} />
                </div>
                <div className="w-6 h-6 rounded-full bg-[#2f8b78] flex items-center justify-center mx-auto mb-4">
                  <Check size={14} className="text-white" />
                </div>
                <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                  {c.l1}
                </p>
                <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                  {c.l2}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom conclusion */}
          <div className="max-w-lg mx-auto bg-white border border-[#d4b896]/30 rounded-sm p-6 sm:p-8 text-center">
            <Award size={20} className="text-[#c09a7e] mx-auto mb-3" />
            <p className="text-[#555] text-sm leading-relaxed break-keep">마지막까지 안정적으로</p>
            <p
              className="text-[#1a1a1a] text-base sm:text-lg font-bold leading-relaxed break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              <span className="text-[#2f8b78]">완성되는 예식</span>을
            </p>
            <p className="text-[#555] text-sm leading-relaxed break-keep">직접 경험하실 수 있습니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
