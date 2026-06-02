/*
 * ReviewSection — 고객님들의 생생한 후기
 * Design: Dark bg (#1a1a1a), mint/gold accents
 * Auto-sliding image carousel with smooth transitions
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
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
    <section id="review" className="bg-[#1a1a1a] py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={anim1.ref}
          className={`text-center mb-14 sm:mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}
        >
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Real Reviews, Real Stories
          </span>
          <h2
            className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            고객님들의 <span className="text-[#5BB5A2]">생생한 후기</span>
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base">
            실제 예식을 진행하신 신랑, 신부님의 카카오톡 후기입니다
          </p>
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
                className="absolute left-0 sm:-left-4 lg:-left-12 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#5BB5A2]/30 hover:text-white hover:border-[#5BB5A2]/40 transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Images container — show 1 on mobile, 3 on desktop */}
              <div className="w-full overflow-hidden px-8 sm:px-14 lg:px-16">
                {/* Mobile: single image */}
                <div className="block md:hidden">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[320px] transition-all duration-600 ease-in-out">
                      <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-2xl shadow-black/30 bg-[#222]">
                        <img
                          src={REVIEW_IMAGES[current].src}
                          alt={REVIEW_IMAGES[current].alt}
                          className="w-full h-auto object-contain transition-opacity duration-600"
                          style={{ aspectRatio: '3/4', minHeight: '360px' }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: 3 images with center focus */}
                <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
                  {/* Left preview */}
                  <div
                    className="w-[200px] lg:w-[240px] shrink-0 cursor-pointer transition-all duration-600 ease-in-out opacity-40 hover:opacity-60 scale-90"
                    onClick={prev}
                  >
                    <div className="rounded-lg overflow-hidden border border-white/5 bg-[#222]">
                      <img
                        src={REVIEW_IMAGES[(current - 1 + total) % total].src}
                        alt={REVIEW_IMAGES[(current - 1 + total) % total].alt}
                        className="w-full h-auto object-contain"
                        style={{ aspectRatio: '3/4', minHeight: '260px' }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Center (active) */}
                  <div className="w-[300px] lg:w-[360px] shrink-0 transition-all duration-600 ease-in-out z-10">
                    <div className="rounded-lg overflow-hidden border border-[#5BB5A2]/20 shadow-2xl shadow-[#5BB5A2]/10 bg-[#222]">
                      <img
                        src={REVIEW_IMAGES[current].src}
                        alt={REVIEW_IMAGES[current].alt}
                        className="w-full h-auto object-contain"
                        style={{ aspectRatio: '3/4', minHeight: '360px' }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Right preview */}
                  <div
                    className="w-[200px] lg:w-[240px] shrink-0 cursor-pointer transition-all duration-600 ease-in-out opacity-40 hover:opacity-60 scale-90"
                    onClick={next}
                  >
                    <div className="rounded-lg overflow-hidden border border-white/5 bg-[#222]">
                      <img
                        src={REVIEW_IMAGES[(current + 1) % total].src}
                        alt={REVIEW_IMAGES[(current + 1) % total].alt}
                        className="w-full h-auto object-contain"
                        style={{ aspectRatio: '3/4', minHeight: '260px' }}
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
                className="absolute right-0 sm:-right-4 lg:-right-12 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#5BB5A2]/30 hover:text-white hover:border-[#5BB5A2]/40 transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
              {REVIEW_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`후기 ${i + 1}번으로 이동`}
                  className={`rounded-full transition-all duration-400 ${
                    i === current
                      ? "w-8 h-2.5 bg-[#5BB5A2]"
                      : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="text-center text-white/30 text-xs mt-4 tracking-wider">
              {current + 1} / {total}
            </p>
          </div>

          {/* CTA button */}
          <div className="mt-12 sm:mt-14 flex items-center justify-center">
            <a
              href="http://musicin.godohosting.com/bbs/board.php?bo_table=forum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5BB5A2] text-white text-sm tracking-wider hover:bg-[#4da393] transition-colors rounded-sm"
            >
              실제 고객 후기 전체보기
              <ExternalLink size={16} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
