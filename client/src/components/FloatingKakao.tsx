import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";

export default function FloatingKakao() {
  const [show, setShow] = useState(false);
  const [hoveredKakao, setHoveredKakao] = useState(false);
  const [hoveredMc, setHoveredMc] = useState(false);
  const [autoTooltip, setAutoTooltip] = useState(false);
  const autoTooltipShown = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 400;
      setShow(scrolled);

      // 처음 스크롤로 버튼이 나타날 때 자동 툴팁 3초간 표시
      if (scrolled && !autoTooltipShown.current) {
        autoTooltipShown.current = true;
        setAutoTooltip(true);
        setTimeout(() => setAutoTooltip(false), 3000);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 자동 툴팁 또는 호버 시 표시
  const showKakaoTooltip = hoveredKakao || autoTooltip;
  const showMcTooltip = hoveredMc || autoTooltip;

  return (
    <>
      {/* Floating Kakao button - 우하단 */}
      <div
        className={`fixed bottom-20 right-6 z-50 transition-all duration-500 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        onMouseEnter={() => setHoveredKakao(true)}
        onMouseLeave={() => setHoveredKakao(false)}
      >
        {/* 툴팁 - 자동 또는 호버 시 표시 */}
        <div
          className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 transition-all duration-300 ${
            showKakaoTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <div className="relative bg-[#0d0d0d] text-white text-xs sm:text-sm px-4 py-2.5 rounded-sm whitespace-nowrap shadow-lg">
            실시간 문의하기
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-[#0d0d0d]" />
          </div>
        </div>

        <a
          href="https://pf.kakao.com/_wxovaM/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#FEE500] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#1a1a1a">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.735 1.805 5.136 4.517 6.491-.157.58-.57 2.105-.652 2.432-.1.397.146.392.307.285.126-.084 2.005-1.362 2.82-1.919.64.093 1.3.142 1.975.142h.033c5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
          </svg>
        </a>
      </div>

      {/* 좌하단 버튼 그룹 */}
      <div
        className={`fixed bottom-20 left-6 z-50 flex flex-col items-start gap-3 transition-all duration-500 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* 사회자 프로필 보러가기 버튼 */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredMc(true)}
          onMouseLeave={() => setHoveredMc(false)}
        >
          {/* 툴팁 - 자동 또는 호버 시 표시 */}
          <div
            className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 transition-all duration-300 ${
              showMcTooltip ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
          >
            <div className="relative bg-[#0d0d0d] text-white text-xs sm:text-sm px-4 py-2.5 rounded-sm whitespace-nowrap shadow-lg">
              사회자 프로필 보러가기
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-[#0d0d0d]" />
            </div>
          </div>

          <a
            href="#video-guide"
            onClick={(e) => {
              e.preventDefault();
              setHoveredMc(false);
              const el = document.getElementById("video-guide");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onTouchStart={() => setHoveredMc(true)}
            onTouchEnd={() => setTimeout(() => setHoveredMc(false), 1500)}
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

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center justify-center w-11 h-11 bg-[#1a1a1a] border border-[#333] rounded-full text-white/80 hover:bg-[#2a2a2a] hover:text-white shadow-md transition-all duration-300"
        >
          <ChevronUp size={18} />
        </button>
      </div>
    </>
  );
}
