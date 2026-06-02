import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "메인", href: "#hero" },
  { label: "소개", href: "#intro" },
  { label: "사회자", href: "#mc" },
  { label: "영상", href: "#video" },
  { label: "후기", href: "#review" },
  { label: "견적", href: "#pricing" },
];

const SERVICE_LINKS = [
  { label: "클래식 연주", href: "https://inusclassic.kr/" },
  { label: "재즈 연주", href: "https://inusjazz.kr/" },
  { label: "뮤지컬 웨딩", href: "https://inusmw.kr/" },
  { label: "축가", href: "https://inusmusic.kr/" },
  { label: "모바일 청첩장", href: "https://inuscard.com" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <span
              className="text-xl lg:text-2xl tracking-[0.2em] text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              INUSMUSIC
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-300 tracking-wider"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                {link.label}
              </a>
            ))}

            {/* 서비스 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServiceOpen(!serviceOpen)}
                className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors duration-300 tracking-wider"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                서비스
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${serviceOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* 드롭다운 패널 */}
              <div
                className={`absolute top-full right-0 mt-2 w-44 bg-[#161616] border border-white/10 rounded-sm shadow-xl transition-all duration-200 origin-top ${
                  serviceOpen
                    ? "opacity-100 scale-y-100 pointer-events-auto"
                    : "opacity-0 scale-y-95 pointer-events-none"
                }`}
              >
                {SERVICE_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setServiceOpen(false)}
                    className="block px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-0 tracking-wide"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="https://pf.kakao.com/_wxovaM/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-5 py-2.5 bg-[#5BB5A2] text-white text-sm rounded-sm hover:bg-[#4da393] transition-colors duration-300 tracking-wider"
            >
              상담하기
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden relative p-2.5 rounded-full bg-[#5BB5A2]/90 text-white transition-all duration-300 ${showPulse ? "animate-[hamburger-pulse_1s_ease-in-out_3]" : ""}`}
            onClick={() => {
              const next = !mobileOpen;
              setMobileOpen(next);
              setShowPulse(false);
              window.dispatchEvent(new Event(next ? "mobile-menu-open" : "mobile-menu-close"));
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 ${
          mobileOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-[#0d0d0d] backdrop-blur-md px-4 pb-6 pt-2 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new Event("mobile-menu-close"));
              }}
              className="block py-3 text-white/70 hover:text-white transition-colors border-b border-white/5 text-sm tracking-wider"
            >
              {link.label}
            </a>
          ))}

          {/* 모바일 서비스 아코디언 */}
          <div className="border-b border-white/5">
            <button
              onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
              className="flex items-center justify-between w-full py-3 text-white/70 hover:text-white transition-colors text-sm tracking-wider"
            >
              서비스
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${mobileServiceOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileServiceOpen ? "max-h-60" : "max-h-0"
              }`}
            >
              {SERVICE_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pl-4 py-2.5 text-white/50 hover:text-white transition-colors text-sm tracking-wide"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <a
            href="https://pf.kakao.com/_wxovaM/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center py-3 bg-[#5BB5A2] text-white rounded-sm text-sm tracking-wider"
          >
            카카오톡 상담하기
          </a>
        </div>
      </div>
    </nav>
  );
}
