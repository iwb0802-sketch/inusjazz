/*
 * ReviewSection — 고객님들의 생생한 후기
 * Design: Dark bg (#1a1a1a), mint/gold accents
 * Auto-sliding image carousel with smooth transitions
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ExternalLink, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

const REVIEW_IMAGES = [
  { src: "/images/review1_d832f6e4.jpg", alt: "고객 후기 1" },
  { src: "/images/review2_c7a1d025.jpg", alt: "고객 후기 2" },
  { src: "/images/review3_66458291.jpg", alt: "고객 후기 3" },
  { src: "/images/review4_6af988b6.jpg", alt: "고객 후기 4" },
  { src: "/images/review5_d5052560.jpg", alt: "고객 후기 5" },
  { src: "/images/review6_4590abae.jpg", alt: "고객 후기 6" },
  { src: "/images/review7_e35c2a63.jpg", alt: "고객 후기 7" },
];

export default function ReviewSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = REVIEW_IMAGES.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [total, isTransitioning]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-slide
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  return (
    <section id="review" className="relative bg-[#1a1a1a] py-24 sm:py-32 lg:py-40 overflow-hidden">


      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #5BB5A2 0%, transparent 60%), radial-gradient(circle at 80% 50%, #d4b896 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={anim1.ref}
          className={`text-center mb-14 sm:mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}
        >
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#5BB5A2]/10 border border-[#5BB5A2]/20 mb-5">
            <MessageSquare size={20} className="text-[#5BB5A2]" />
          </div>

          <span
            className="block text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Real Reviews, Real Stories
          </span>
          <h2
            className="text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            고객님들의 <span className="text-[#5BB5A2]">생생한 후기</span>
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            실제 예식을 진행하신 신랑, 신부님의 카카오톡 후기입니다
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-px bg-[#d4b896]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b896]/50" />
            <div className="w-12 h-px bg-[#d4b896]/30" />
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={anim2.ref}
          className={`fade-up ${anim2.isVisible ? "visible" : ""}`}
        >
          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main carousel area */}
            <div className="relative flex items-center justify-center">
              {/* Left arrow */}
              <button
                onClick={prev}
                aria-label="이전 후기"
                className="absolute left-0 sm:-left-2 lg:-left-14 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/60 hover:bg-[#5BB5A2]/25 hover:text-[#5BB5A2] hover:border-[#5BB5A2]/50 hover:shadow-[0_0_16px_rgba(91,181,162,0.3)] transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Images container */}
              <div className="w-full overflow-hidden px-10 sm:px-14 lg:px-20">
                {/* Mobile: single image */}
                <div className="block md:hidden">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[300px]">
                      <div
                        className="relative rounded-xl overflow-hidden bg-[#222]"
                        style={{
                          border: "1px solid rgba(91,181,162,0.35)",
                          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,181,162,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Top highlight line */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[2px] z-10"
                          style={{ background: "linear-gradient(90deg, transparent, #5BB5A2, transparent)" }}
                        />
                        <img
                          src={REVIEW_IMAGES[current].src}
                          alt={REVIEW_IMAGES[current].alt}
                          className="w-full h-auto object-contain transition-opacity duration-500"
                          style={{ aspectRatio: "3/4", minHeight: "360px" }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: 3 images with center focus */}
                <div className="hidden md:flex items-center justify-center gap-5 lg:gap-7">
                  {/* Left preview */}
                  <div
                    className="w-[210px] lg:w-[250px] shrink-0 cursor-pointer transition-all duration-500 ease-in-out hover:opacity-75"
                    style={{ opacity: 0.45, transform: "scale(0.92)" }}
                    onClick={prev}
                  >
                    <div
                      className="rounded-xl overflow-hidden bg-[#222]"
                      style={{
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                      }}
                    >
                      <img
                        src={REVIEW_IMAGES[(current - 1 + total) % total].src}
                        alt={REVIEW_IMAGES[(current - 1 + total) % total].alt}
                        className="w-full h-auto object-contain"
                        style={{ aspectRatio: "3/4", minHeight: "280px" }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Center (active) */}
                  <div
                    className="w-[300px] lg:w-[370px] shrink-0 transition-all duration-500 ease-in-out z-10"
                  >
                    <div
                      className="relative rounded-xl overflow-hidden bg-[#222]"
                      style={{
                        border: "1px solid rgba(91,181,162,0.4)",
                        boxShadow:
                          "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(91,181,162,0.12), 0 0 0 1px rgba(91,181,162,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Top highlight line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] z-10"
                        style={{ background: "linear-gradient(90deg, transparent 5%, #5BB5A2 40%, #d4b896 60%, transparent 95%)" }}
                      />
                      <img
                        src={REVIEW_IMAGES[current].src}
                        alt={REVIEW_IMAGES[current].alt}
                        className="w-full h-auto object-contain"
                        style={{ aspectRatio: "3/4", minHeight: "380px" }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Right preview */}
                  <div
                    className="w-[210px] lg:w-[250px] shrink-0 cursor-pointer transition-all duration-500 ease-in-out hover:opacity-75"
                    style={{ opacity: 0.45, transform: "scale(0.92)" }}
                    onClick={next}
                  >
                    <div
                      className="rounded-xl overflow-hidden bg-[#222]"
                      style={{
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                      }}
                    >
                      <img
                        src={REVIEW_IMAGES[(current + 1) % total].src}
                        alt={REVIEW_IMAGES[(current + 1) % total].alt}
                        className="w-full h-auto object-contain"
                        style={{ aspectRatio: "3/4", minHeight: "280px" }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right arrow */}
              <button
                onClick={next}
                aria-label="다음 후기"
                className="absolute right-0 sm:-right-2 lg:-right-14 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/60 hover:bg-[#5BB5A2]/25 hover:text-[#5BB5A2] hover:border-[#5BB5A2]/50 hover:shadow-[0_0_16px_rgba(91,181,162,0.3)] transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {REVIEW_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`후기 ${i + 1}번으로 이동`}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: i === current ? "28px" : "8px",
                    height: "8px",
                    background: i === current
                      ? "linear-gradient(90deg, #5BB5A2, #d4b896)"
                      : "rgba(255,255,255,0.18)",
                    boxShadow: i === current ? "0 0 8px rgba(91,181,162,0.5)" : "none",
                  }}
                />
              ))}
            </div>

            {/* Counter */}
            <p
              className="text-center text-xs mt-3 tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          </div>

          {/* CTA button */}
          <div className="mt-14 flex flex-col items-center gap-3">
            <a
              href="http://musicin.godohosting.com/bbs/board.php?bo_table=forum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-white text-sm tracking-wider transition-all duration-300 rounded-sm"
              style={{
                background: "linear-gradient(135deg, #5BB5A2, #4da393)",
                boxShadow: "0 4px 20px rgba(91,181,162,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(91,181,162,0.5)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(91,181,162,0.35)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              실제 고객 후기 전체보기
              <ExternalLink size={15} />
            </a>
            <p className="text-white/25 text-xs tracking-wider">
              카카오톡으로 직접 받은 후기만 게재합니다
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0d0d0d 0%, transparent 100%)" }}
      />
    </section>
  );
}
