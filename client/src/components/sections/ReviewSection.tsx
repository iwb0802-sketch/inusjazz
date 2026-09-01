/*
 * ReviewSection — 고객님들의 생생한 후기
 * Design: Dark bg (#1a1a1a), gold accents throughout
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

const GOLD = "#d4b896";

// 후기 2500+ 증빙 자료 (숨고 프로필, 홈페이지 후기게시판, 블로그 사회자 후기글, 네이버 스마트스토어)
const PROOF_IMAGES = [
  {
    src: "/images/proof/proof-soomgo.jpg",
    alt: "숨고 프로필 리뷰수 733건",
    label: "출처 · 숨고",
    source: "숨고",
    count: 733,
    url: "https://soomgo.com/profile/users/4719699",
    linkLabel: "숨고 프로필에서 확인",
  },
  {
    src: "/images/proof/proof-blog.jpg",
    alt: "홈페이지 후기게시판 Total 575건",
    label: "출처 · 후기 게시판",
    source: "후기 게시판",
    count: 575,
    url: "http://musicin.godohosting.com/bbs/board.php?bo_table=forum",
    linkLabel: "후기 게시판에서 확인",
  },
  {
    src: "/images/proof/proof-singer-blog.jpg",
    alt: "블로그 사회자 후기글 965건",
    label: "출처 · 블로그",
    source: "블로그",
    count: 965,
    url: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=71&parentCategoryNo=71",
    linkLabel: "블로그 후기글에서 확인",
  },
  {
    src: "/images/proof/proof-smartstore.jpg",
    alt: "네이버 스마트스토어 리뷰 245건",
    label: "출처 · 스마트스토어",
    source: "네이버 스마트스토어",
    count: 245,
    url: "https://smartstore.naver.com/inus_store/products/5466083565",
    linkLabel: "스마트스토어에서 확인",
  },
];

const PROOF_TOTAL = PROOF_IMAGES.reduce((sum, p) => sum + p.count, 0);
const PROOF_AS_OF = "2026.09.01";

export default function ReviewSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightbox, setLightbox] = useState<(typeof PROOF_IMAGES)[number] | null>(null);
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
      {/* Subtle background pattern — gold only */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #d4b896 0%, transparent 60%), radial-gradient(circle at 80% 50%, #c9a87a 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={anim1.ref}
          className={`text-center mb-14 sm:mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}
        >
          {/* Icon badge — gold */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5"
            style={{
              background: "rgba(212,184,150,0.10)",
              border: "1px solid rgba(212,184,150,0.25)",
            }}>
            <MessageSquare size={20} style={{ color: GOLD }} />
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
            고객님들의 <span style={{ color: GOLD }}>생생한 후기</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium break-keep" style={{ color: GOLD }}>
            업계 최다 수준의 실제 후기, 이너스뮤직이 증명합니다
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm sm:text-base font-bold tracking-wide"
              style={{
                background: "rgba(212,184,150,0.16)",
                border: "1px solid rgba(212,184,150,0.55)",
                color: GOLD,
                boxShadow: "0 0 16px rgba(212,184,150,0.25)",
              }}
            >
              2500+ 후기
            </span>
          </div>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-sm mx-auto leading-relaxed break-keep">
            실제 예식을 진행하신 신랑, 신부님의<br className="hidden sm:block" /> 카카오톡, 문자 후기입니다
          </p>
          <p className="mt-2 text-white/35 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed break-keep">
            숨고·네이버 스마트스토어·블로그 등 모든 플랫폼 후기를 합산하면
            <br className="sm:hidden" />
            {" "}2,500건 이상 (사회자 개별 후기 포함)
          </p>

          {/* 증빙 자료 — 숨고/홈페이지/블로그/스마트스토어 실제 후기 캡처 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-lg sm:max-w-2xl mx-auto">
            {PROOF_IMAGES.map((img) => (
              <div key={img.src} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLightbox(img)}
                  className="group relative w-full rounded-lg overflow-hidden bg-[#161616] transition-transform duration-300 hover:scale-[1.03]"
                  style={{ border: "1px solid rgba(212,184,150,0.3)" }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-24 sm:h-32 object-contain p-1.5"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center pb-1.5">
                    <span className="text-white/0 group-hover:text-white/90 text-[10px] transition-colors duration-300">
                      크게보기
                    </span>
                  </div>
                </button>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white/45 text-[10px] sm:text-xs tracking-wide break-keep text-center">
                    {img.label}
                  </span>
                  <span
                    className="text-xl sm:text-2xl font-bold tabular-nums leading-none tracking-tight"
                    style={{ color: GOLD }}
                  >
                    {img.count.toLocaleString()}
                    <span className="text-[11px] sm:text-xs font-medium text-white/45 ml-0.5">건</span>
                  </span>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 mt-1.5 w-full px-2 py-2 rounded-md text-[12px] sm:text-[13px] font-bold tracking-wide transition-all duration-300 break-keep text-center"
                    style={{
                      color: "#1a1a1a",
                      background: "linear-gradient(135deg, #d4b896, #c9a87a)",
                      boxShadow: "0 2px 10px rgba(212,184,150,0.28)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(212,184,150,0.5)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 10px rgba(212,184,150,0.28)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    }}
                  >
                    직접 확인
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 합산 근거 */}
          <div
            className="mt-6 mx-auto max-w-md rounded-lg py-4 px-5"
            style={{ background: "rgba(212,184,150,0.06)", border: "1px dashed rgba(212,184,150,0.35)" }}
          >
            <p className="text-xs sm:text-sm text-white/55 tracking-wide break-keep leading-relaxed">
              {PROOF_IMAGES.map((p, i) => (
                <span key={p.source}>
                  {i > 0 && " + "}
                  <span className="text-white/70">{p.count.toLocaleString()}</span>
                </span>
              ))}{" = "}
              <span className="font-bold" style={{ color: GOLD, fontFamily: "'JetBrains Mono', monospace" }}>
                {PROOF_TOTAL.toLocaleString()}건
              </span>
            </p>
            <p className="mt-2.5 text-[11.5px] sm:text-xs break-keep leading-relaxed" style={{ color: "rgba(212,184,150,0.75)" }}>
              위 캡처는 <span className="font-bold" style={{ color: GOLD }}>{PROOF_AS_OF} 기준</span>입니다
            </p>
            <p className="mt-2 text-xs sm:text-[13px] font-medium text-white/70 break-keep leading-relaxed">
              후기는 계속 쌓이고 있어 <span className="font-bold text-white/95">현재 건수는 더 많습니다</span>
              <br />
              <span className="font-bold" style={{ color: GOLD }}>직접 확인</span>으로 실시간 수치를 보실 수 있습니다
            </p>
          </div>

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
              {/* Left arrow — gold hover */}
              <button
                onClick={prev}
                aria-label="이전 후기"
                className="absolute left-0 sm:-left-2 lg:-left-14 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,184,150,0.20)";
                  (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(212,184,150,0.50)";
                  (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(212,184,150,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
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
                          border: "1px solid rgba(212,184,150,0.35)",
                          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,184,150,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Top highlight line — gold */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[2px] z-10"
                          style={{ background: "linear-gradient(90deg, transparent, #d4b896, transparent)" }}
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

                  {/* Center (active) — gold border + top line */}
                  <div
                    className="w-[300px] lg:w-[370px] shrink-0 transition-all duration-500 ease-in-out z-10"
                  >
                    <div
                      className="relative rounded-xl overflow-hidden bg-[#222]"
                      style={{
                        border: "1px solid rgba(212,184,150,0.40)",
                        boxShadow:
                          "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(212,184,150,0.12), 0 0 0 1px rgba(212,184,150,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Top highlight line — gold only */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] z-10"
                        style={{ background: "linear-gradient(90deg, transparent 5%, #d4b896 40%, #c9a87a 60%, transparent 95%)" }}
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

              {/* Right arrow — gold hover */}
              <button
                onClick={next}
                aria-label="다음 후기"
                className="absolute right-0 sm:-right-2 lg:-right-14 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,184,150,0.20)";
                  (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(212,184,150,0.50)";
                  (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(212,184,150,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dots indicator — gold active */}
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
                      ? "linear-gradient(90deg, #d4b896, #c9a87a)"
                      : "rgba(255,255,255,0.18)",
                    boxShadow: i === current ? "0 0 8px rgba(212,184,150,0.5)" : "none",
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

          {/* 후기 출처 안내 */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-white/25 text-xs tracking-wider">
              카카오톡, 문자로 직접 받은 후기만 게재합니다
            </p>
          </div>

        </div>
      </div>

      {/* Bottom gradient transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0d0d0d 0%, transparent 100%)" }}
      />

      {/* 증빙 자료 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="닫기"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            ✕
          </button>
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[74vh] object-contain rounded-lg"
              style={{ border: "1px solid rgba(212,184,150,0.4)" }}
            />
            {lightbox.url && (
              <a
                href={lightbox.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[#1a1a1a] text-[12.5px] sm:text-sm font-medium tracking-wide rounded-sm transition-all duration-300 break-keep text-center"
                style={{ background: "linear-gradient(135deg, #d4b896, #c9a87a)", boxShadow: "0 4px 18px rgba(212,184,150,0.3)" }}
              >
                {lightbox.linkLabel}
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
