import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { VENUE_NAMES } from "@/data/venues";
import { PROOF_TOTAL, PROOF_AS_OF } from "@/data/reviewStats";

const PROOFS = [
  { value: PROOF_TOTAL.toLocaleString(), unit: "건", label: "누적 후기", sub: "6개 채널", href: "#review" },
  { value: "18", unit: "인", label: "사회자 전원", sub: "목소리·영상 공개", href: "#mc" },
  { value: "100", unit: "%", label: "계약금 환불", sub: "예식 전주까지", href: "#process" },
  { value: "14", unit: "만원~", label: "정가 기준", sub: "경기·인천 출장비 별도", href: "#pricing" },
];

const HERO_BG = "/images/hero-v2-option2.webp";
const HERO_BG_MOBILE = "/images/hero-mobile-v3.webp";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Desktop image */}
        <img
          src={HERO_BG}
          alt="웨딩홀"
          className="hidden sm:block w-full h-full object-cover"
        />
        {/* Mobile image */}
        <img
          src={HERO_BG_MOBILE}
          alt="웨딩홀"
          className="block sm:hidden w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 sm:pb-24">
        <div
          className={`transition-all duration-1000 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-[#d4b896] text-sm sm:text-base tracking-[0.3em] mb-4 sm:mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            PREMIUM WEDDING HOST
          </p>
        </div>

        <h1
          className={`transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span
            className="block text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            사회자 18인 중,
          </span>
          <span
            className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 leading-tight"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900 }}
          >
            <span className="text-white">당신의 예식에 맞는 </span>
            <span className="text-[#5BB5A2] whitespace-nowrap">한 사람.</span>
          </span>
        </h1>

        <p
          className={`mt-5 sm:mt-8 text-white/85 text-sm sm:text-base max-w-lg leading-relaxed transition-all duration-1000 delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ fontFamily: "'Noto Sans KR', sans-serif", textShadow: "0 1px 12px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.6)" }}
        >
          하우스웨딩·호텔·웨딩홀·스몰웨딩,
          <br />
          목소리와 진행 영상 확인부터 예식 당일까지
          <br />
          이너스뮤직의 체계로 빈틈없이 완성합니다.
        </p>

        {/* 증거띠 — 4칸, 각 칸은 해당 구간으로 이동 */}
        <div
          className={`mt-7 sm:mt-9 w-full max-w-[360px] sm:max-w-3xl transition-all duration-1000 delay-[800ms] ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="grid grid-cols-4"
            style={{ borderTop: "1px solid rgba(212,184,150,0.35)", borderBottom: "1px solid rgba(212,184,150,0.35)" }}
          >
            {PROOFS.map((p, i) => (
              <a
                key={p.label}
                href={p.href}
                className="group flex flex-col items-center justify-center py-3 sm:py-4 px-0.5 hover:bg-white/5 transition-colors"
                style={i > 0 ? { borderLeft: "1px solid rgba(212,184,150,0.2)" } : undefined}
              >
                <span className="flex items-baseline whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#d4b896", lineHeight: 1 }}>
                  <span className="text-[1.45rem] sm:text-[2.1rem]">{p.value}</span>
                  <span className="text-[0.8rem] sm:text-base ml-0.5" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500 }}>{p.unit}</span>
                </span>
                <span className="mt-1.5 text-[11px] sm:text-[13px] text-white/85 whitespace-nowrap" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{p.label}</span>
                <span className="mt-0.5 text-[9.5px] sm:text-[11px] text-white/45 whitespace-nowrap" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{p.sub}</span>
              </a>
            ))}
          </div>
          <p className="mt-2 text-[10px] sm:text-xs text-white/40" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            후기 {PROOF_AS_OF} 기준 6개 채널 합산 · 요금은 정가 기준
          </p>
        </div>

        <div
          className={`mt-6 sm:mt-8 w-full max-w-[360px] sm:max-w-none flex flex-col sm:flex-row sm:items-stretch sm:justify-center gap-2.5 sm:gap-4 transition-all duration-1000 delay-900 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* 주 CTA — 단독 강조 */}
          <button
            onClick={() => {
              const el = document.getElementById('mc');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-5 bg-[#5BB5A2] text-white text-base sm:text-lg font-bold tracking-wider hover:bg-[#4da393] transition-all duration-300 rounded-sm"
            style={{ boxShadow: "0 12px 34px -10px rgba(91,181,162,0.75)", fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            사회자 선택하기
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <div className="grid grid-cols-2 sm:flex gap-2.5 sm:gap-4">
            <Link
              href="/schedule"
              className="flex items-center justify-center gap-1.5 text-center px-3 sm:px-8 py-3 sm:py-0 border border-white/30 text-white/90 text-[13px] sm:text-base tracking-wide hover:bg-white/10 transition-all duration-300 rounded-sm"
            >
              <CalendarCheck size={16} className="shrink-0" />
              날짜로 확인
            </Link>
            <a
              href="https://pf.kakao.com/_wxovaM/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-center px-3 sm:px-8 py-3 sm:py-0 border border-white/30 text-white/90 text-[13px] sm:text-base tracking-wide hover:bg-white/10 transition-all duration-300 rounded-sm"
            >
              <MessageCircle size={16} className="shrink-0" />
              카톡 상담
            </a>
          </div>
        </div>
      </div>

      {/* 진행 웨딩홀 실적 — Performed Venues 흡수 */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 overflow-hidden transition-all duration-1000 delay-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          background: "linear-gradient(to top, rgba(8,8,8,0.92), rgba(8,8,8,0.55))",
          borderTop: "1px solid rgba(212,184,150,0.18)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-3 pb-2 px-4 break-keep">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase" style={{ color: "#d4b896", fontFamily: "'Cormorant Garamond', serif" }}>
            Performed Venues
          </span>
          <span className="hidden sm:inline w-8 h-px" style={{ background: "rgba(212,184,150,0.4)" }} />
          <span className="flex items-baseline gap-1">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "clamp(1.35rem,4.5vw,1.9rem)", color: "#d4b896", lineHeight: 1 }}>223</span>
            <span style={{ color: "#5BB5A2", fontWeight: 700, fontSize: "0.95rem" }}>+</span>
            <span className="text-xs sm:text-sm ml-1 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Noto Sans KR', sans-serif" }}>
              진행 웨딩홀 · 호텔
            </span>
          </span>
        </div>

        {/* 웨딩홀 이름 마퀴 */}
        <div className="relative pb-2.5">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.95), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, rgba(8,8,8,0.95), transparent)" }} />
          <style>{`
            @keyframes hero-venue-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .hero-venue-track { display: flex; width: max-content; animation: hero-venue-marquee 420s linear infinite; }
            .hero-venue-track:hover { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) { .hero-venue-track { animation: none; } }
          `}</style>
          <div className="hero-venue-track">
            {[...VENUE_NAMES, ...VENUE_NAMES].map((v, i) => (
              <span key={i} className="flex items-center gap-3 px-4 text-[11px] sm:text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.42)" }}>
                {v}
                <span style={{ color: i % 2 === 0 ? "#d4b896" : "#5BB5A2", opacity: 0.4 }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
