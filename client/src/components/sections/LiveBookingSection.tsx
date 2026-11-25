/**
 * LiveBookingSection - 가격표 직전 한 줄 띠
 * (기존 입금 현황 마퀴 2줄은 제거 — 전체 예약 현황은 외부 링크로 연결)
 */
import { ExternalLink } from "lucide-react";

const GOLD = "#d4b896";
const BOOKING_STATUS_URL = "https://www.inusmc.co.kr/weekend-performance";

export default function LiveBookingSection() {
  return (
    <div
      className="bg-[#1a1a1a]"
      style={{ borderTop: "1px solid rgba(212,184,150,0.15)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-center">
        <p className="text-sm sm:text-base break-keep" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Noto Sans KR', sans-serif" }}>
          주말 예식 · 인기 사회자는{" "}
          <span className="whitespace-nowrap font-semibold" style={{ color: GOLD }}>평균 6개월~1년 전 마감</span>
        </p>
        <a
          href={BOOKING_STATUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#5BB5A2] hover:text-[#7fcab9] transition-colors"
        >
          예약현황 보기
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
