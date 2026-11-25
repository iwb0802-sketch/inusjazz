/**
 * 하단 플로팅 바
 * [ 사회자 선택 ] [ 날짜 확인 ] [ 카톡 상담 ]
 * 히어로를 지나 스크롤하면 나타남. SNS 링크는 Footer에 있음.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MessageCircle, Mic2, CalendarCheck } from "lucide-react";

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 1.0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const base =
    "flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 text-[12px] sm:text-xs tracking-wide transition-all duration-300 shadow-lg shadow-black/40 group";
  const enable = visible ? "pointer-events-auto" : "pointer-events-none";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className="flex justify-center items-stretch gap-2 px-3 sm:px-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={() => document.getElementById("mc")?.scrollIntoView({ behavior: "smooth" })}
          className={`${enable} ${base} bg-[#0d0d0d]/95 backdrop-blur-sm border border-[#d4b896]/30 text-white/85 hover:bg-[#161616] hover:border-[#d4b896]/60`}
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          <Mic2 className="w-4 h-4 text-[#d4b896]" strokeWidth={1.5} />
          <span className="whitespace-nowrap">사회자 선택</span>
        </button>

        <Link
          href="/schedule"
          className={`${enable} ${base} bg-[#0d0d0d]/95 backdrop-blur-sm border border-[#d4b896]/30 text-white/85 hover:bg-[#161616] hover:border-[#d4b896]/60`}
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          <CalendarCheck className="w-4 h-4 text-[#d4b896]" strokeWidth={1.5} />
          <span className="whitespace-nowrap">날짜 확인</span>
        </Link>

        <a
          href="https://pf.kakao.com/_wxovaM/chat"
          target="_blank"
          rel="noopener noreferrer"
          className={`${enable} ${base} bg-[#5BB5A2] text-white hover:bg-[#4da393] font-medium`}
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="whitespace-nowrap">카톡 상담</span>
        </a>
      </div>
    </div>
  );
}
