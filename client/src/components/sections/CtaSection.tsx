import { useState } from "react";
import { useLocation } from "wouter";
import DateField from "@/components/DateField";
import { CalendarCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTA_BG = "/images/wedding-stage-mic.webp";

export default function CtaSection() {
  const anim1 = useScrollAnimation();
  const [, navigate] = useLocation();
  const t = new Date();
  const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState("");

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={CTA_BG} alt="웨딩 스테이지" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            START YOUR PERFECT WEDDING
          </span>
          <h2
            className="mt-6 text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            예식 날짜를 입력하면
            <br />
            <span className="text-[#5BB5A2]">가능한 사회자</span>가 바로 나옵니다
          </h2>
          <p className="mt-5 text-white/60 text-sm sm:text-base leading-relaxed">
            연락처 없이 날짜만으로 확인 · 계약금은 예식 전주까지 100% 환불
          </p>

          <form
            className="mt-9 mx-auto max-w-md flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(date ? `/schedule?date=${date}` : "/schedule");
            }}
          >
            <DateField
              value={date}
              onChange={setDate}
              min={todayStr}
              className="flex-1 min-w-0 px-4 py-3.5 rounded-sm bg-white/10 border border-white/40 focus-within:border-[#5BB5A2]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#5BB5A2] text-white text-base font-bold tracking-wide hover:bg-[#4da393] transition-colors rounded-sm whitespace-nowrap"
              style={{ boxShadow: "0 12px 34px -10px rgba(91,181,162,0.75)" }}
            >
              <CalendarCheck size={18} />
              가능한 사회자 확인
            </button>
          </form>

          <div className="mt-6">
            <a
              href="https://pf.kakao.com/_wxovaM/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 border border-white/30 text-white/85 text-sm tracking-wide hover:bg-white/10 transition-colors rounded-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FEE500">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.735 1.805 5.136 4.517 6.491-.157.58-.57 2.105-.652 2.432-.1.397.146.392.307.285.126-.084 2.005-1.362 2.82-1.919.64.093 1.3.142 1.975.142h.033c5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
              </svg>
              날짜를 모르면 카톡으로 먼저 상담
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
