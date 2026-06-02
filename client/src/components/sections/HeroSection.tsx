import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const HERO_BG = "/manus-storage/hero-v2-option2_ac61c4e8.webp";
const HERO_BG_MOBILE = "/manus-storage/hero-mobile-v3_b4dd8415.webp";

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
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
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
          <a
            href="https://pf.kakao.com/_wxovaM/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#5BB5A2] text-white text-sm sm:text-base tracking-wider hover:bg-[#4da393] transition-all duration-300 rounded-sm"
          >
            무료 상담 시작하기
          </a>
          <a
            href="#intro"
            className="px-8 py-4 border border-white/30 text-white text-sm sm:text-base tracking-wider hover:bg-white/10 transition-all duration-300 rounded-sm"
          >
            자세히 알아보기
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#intro" className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-xs tracking-[0.2em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>SCROLL</span>
          <ChevronDown size={20} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
