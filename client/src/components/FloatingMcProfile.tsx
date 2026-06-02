/**
 * FloatingMcProfile - 사회자 프로필 보러가기 플로팅 버튼
 * 오른쪽 하단에 위치, 하단 CTA 바 위에 배치
 * 스크롤 후 나타남
 */
import { useState, useEffect, useRef } from "react";

export default function FloatingMcProfile() {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [autoTooltip, setAutoTooltip] = useState(false);
  const autoTooltipShown = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 400;
      setShow(scrolled);
      if (scrolled && !autoTooltipShown.current) {
        autoTooltipShown.current = true;
        setAutoTooltip(true);
        setTimeout(() => setAutoTooltip(false), 3000);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showTooltip = hovered || autoTooltip;

  return (
    <div
      className={`fixed bottom-28 right-5 z-50 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 툴팁 */}
      <div
        className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <div className="relative bg-[#0d0d0d] text-white text-xs sm:text-sm px-4 py-2.5 rounded-sm whitespace-nowrap shadow-lg">
          사회자 프로필 보러가기
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-[#0d0d0d]" />
        </div>
      </div>
      {/* 버튼 */}
      <a
        href="#video-guide"
        onClick={(e) => {
          e.preventDefault();
          setHovered(false);
          const el = document.getElementById("video-guide");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setTimeout(() => setHovered(false), 1500)}
        className="flex items-center justify-center w-14 h-14 bg-[#5BB5A2] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7" r="3.5" />
          <path d="M5.5 21v-1.5a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5V21" />
          <line x1="18" y1="3" x2="18" y2="8" />
          <path d="M16.5 3.5a1.5 1.5 0 0 1 3 0v3a1.5 1.5 0 0 1-3 0z" />
          <path d="M16 8.5a2 2 0 0 0 4 0" />
        </svg>
      </a>
    </div>
  );
}
