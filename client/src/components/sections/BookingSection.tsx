import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Clock, CalendarDays, AlertTriangle } from "lucide-react";

const AISLE_IMG = "/manus-storage/wedding-aisle_728f895b_ef426b59.jpg";

export default function BookingSection() {
  const anim1 = useScrollAnimation();

  return (
    <section className="relative overflow-hidden">
      {/* Background image section */}
      <div className="relative py-24 sm:py-32">
        <div className="absolute inset-0">
          <img src={AISLE_IMG} alt="웨딩 아일" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
            <div className="text-center mb-14">
              <span
                className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                BOOKING STATUS
              </span>
              <h2
                className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
              >
                현재 예약 진행 상황
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarDays size={18} className="text-[#5BB5A2]" />
                  <span className="text-white text-sm font-medium">주말 예식 / 인기 사회자</span>
                </div>
                <p className="text-white/60 text-sm">평균 6개월~1년 전 마감</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={18} className="text-[#d4b896]" />
                  <span className="text-white text-sm font-medium">11시~2시 주요 시간대</span>
                </div>
                <p className="text-white/60 text-sm">조기 마감 빈도 높음</p>
              </div>
            </div>

            <div className="mt-8 bg-[#5BB5A2]/10 border border-[#5BB5A2]/20 rounded-sm p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                <div className="text-white/70 text-sm leading-relaxed">
                  <p>특히 성수기 시즌에는 상담 이후 일정이 빠르게 마감되는 경우가 많습니다.</p>
                  <p className="mt-2">여러 업체를 비교 중이시라면 원하시는 시간대 확보를 위해 미리 일정 확인을 권장드립니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
