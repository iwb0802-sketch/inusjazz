import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { VENUE_NAMES } from "@/data/venues";

const HERO_BG = "/images/hero-v2-option2.webp";
const HERO_BG_MOBILE = "/images/hero-mobile-v3.webp";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
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
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pb-28 sm:pb-24">
        <div
          className={`transition-all duration-1000 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-[#d4b896] text-sm sm:text-base tracking-[0.3em] mb-6"
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
            결혼식의 완성도는
          </span>
          <span
            className="block text-[#5BB5A2] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 leading-tight"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900 }}
          >
            사회자
            <span className="text-white">에서 결정됩니다.</span>
          </span>
        </h1>

        <p
          className={`mt-8 text-white/70 text-sm sm:text-base max-w-lg leading-relaxed transition-all duration-1000 delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          실제 본식 영상으로 완성도를 증명하는
          <br className="hidden sm:block" />
          웨딩 전문 브랜드
        </p>

        <div
          className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-900 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => {
              const el = document.getElementById('mc');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-[#5BB5A2] text-white text-sm sm:text-base tracking-wider hover:bg-[#4da393] transition-all duration-300 rounded-sm"
          >
            사회자 선택하기
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('vote-on-voice');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="VOTE ON VOICE 이동"
            className="flex items-center justify-center gap-2 px-6 py-4 border rounded-sm text-sm sm:text-base tracking-wider transition-all duration-300"
            style={{ borderColor: "rgba(212,184,150,0.5)", color: "#d4b896", background: "rgba(212,184,150,0.08)" }}
          >
            <Crown size={16} />
            V.O.V
          </button>
          <a
            href="#intro"
            className="px-8 py-4 border border-white/30 text-white text-sm sm:text-base tracking-wider hover:bg-white/10 transition-all duration-300 rounded-sm"
          >
            자세히 알아보기
          </a>
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
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "clamp(1.35rem,4.5vw,1.9rem)", color: "#d4b896", lineHeight: 1 }}>224</span>
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
            .hero-venue-track { display: flex; width: max-content; animation: hero-venue-marquee 180s linear infinite; }
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
