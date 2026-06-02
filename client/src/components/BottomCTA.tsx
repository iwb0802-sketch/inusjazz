/**
 * BottomCTA - 하단 고정 문의 바
 * 민트색 사회자 프로필 보기 + 카카오톡 상담 버튼
 * 스크롤 후 나타나며, 히어로 영역에서는 숨김
 * 모바일 메뉴 열림 시 숨김
 * Brand: Dark + Mint (#5BB5A2) accent
 */
import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function BottomCTA() {
  const [show, setShow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 모바일 메뉴 열림/닫힘 감지 (커스텀 이벤트)
  useEffect(() => {
    const handleMenuOpen = () => setMobileMenuOpen(true);
    const handleMenuClose = () => setMobileMenuOpen(false);
    window.addEventListener("mobile-menu-open", handleMenuOpen);
    window.addEventListener("mobile-menu-close", handleMenuClose);
    return () => {
      window.removeEventListener("mobile-menu-open", handleMenuOpen);
      window.removeEventListener("mobile-menu-close", handleMenuClose);
    };
  }, []);

  const scrollToMc = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("mc");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[60] transition-all duration-500 ${
        show && !mobileMenuOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      }`}
    >
      {/* 상단 그라데이션 페이드 */}
      <div className="h-4 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
      {/* CTA 바 본체 */}
      <div className="bg-[#0d0d0d]/95 backdrop-blur-md border-t border-[#d4b896]/20">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          {/* 좌측: 문구 (PC에서만 표시) */}
          <div className="hidden sm:block">
            <p className="text-white/90 text-sm font-medium" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              웨딩 사회자 무료 상담
            </p>
            <p className="text-white/40 text-xs mt-0.5">
              카카오톡으로 편하게 문의하세요
            </p>
          </div>
          {/* 버튼 영역 */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* 사회자 프로필 보기 버튼 (민트색) */}
            <a
              href="#mc"
              onClick={scrollToMc}
              className="flex items-center justify-center gap-1.5 px-3 py-3 sm:px-4 sm:py-2.5 bg-[#5BB5A2] rounded-sm text-white hover:bg-[#4da393] transition-all duration-300 flex-1 sm:flex-none font-medium whitespace-nowrap"
            >
              <Users size={15} />
              <span className="text-xs sm:text-sm">사회자 프로필 보기</span>
            </a>
            {/* 카카오톡 버튼 */}
            <a
              href="https://pf.kakao.com/_wxovaM/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-3 sm:px-5 sm:py-2.5 bg-[#FEE500] rounded-sm text-[#1a1a1a] hover:bg-[#f5dc00] transition-all duration-300 flex-1 sm:flex-none font-medium whitespace-nowrap"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.735 1.805 5.136 4.517 6.491-.157.58-.57 2.105-.652 2.432-.1.397.146.392.307.285.126-.084 2.005-1.362 2.82-1.919.64.093 1.3.142 1.975.142h.033c5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
              </svg>
              <span className="text-xs sm:text-sm">카카오톡 상담</span>
            </a>
          </div>
        </div>
        {/* iOS safe area 대응 */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </div>
  );
}
