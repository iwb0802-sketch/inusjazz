/**
 * 사회자 페이지 오른쪽 사이드 퀵 네비게이션
 * Design: 블랙/다크 + #d4b896 골드 + #5BB5A2 민트 테마
 */
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const menuItems = [
  { id: "intro",       label: "소개" },
  { id: "mc",          label: "사회자" },
  { id: "video",       label: "영상" },
  { id: "video-guide", label: "가이드" },
  { id: "review",      label: "후기" },
  { id: "process",     label: "진행절차" },
  { id: "package",     label: "패키지" },
  { id: "pricing",     label: "요금" },
  { id: "service",     label: "서비스" },
  { id: "qna",         label: "Q&A" },
];

export default function QuickNav() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 메인 메뉴 열릴 때 숨기기
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setNavMenuOpen(detail.open);
      if (detail.open) setOpen(false);
    };
    window.addEventListener("mainNavToggle", handler);
    return () => window.removeEventListener("mainNavToggle", handler);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionMap = new Map<string, number>();

    menuItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            sectionMap.set(id, entry.intersectionRatio);
          } else {
            sectionMap.delete(id);
          }
          let maxRatio = 0;
          let maxId = "";
          sectionMap.forEach((ratio, sid) => {
            if (ratio > maxRatio) { maxRatio = ratio; maxId = sid; }
          });
          if (maxId) setActiveId(maxId);
        },
        { threshold: [0.1, 0.3, 0.5], rootMargin: "-10% 0px -10% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <div
      ref={panelRef}
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center transition-all duration-500 ${
        (visible && !navMenuOpen) ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 메뉴 패널 */}
      <div
        className={`flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "w-28 opacity-100" : "w-0 opacity-0"
        }`}
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        <div className="bg-[#0d0d0d]/95 backdrop-blur-md border border-[#d4b896]/20 border-r-0 shadow-2xl shadow-black/50 py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-4 py-2.5 text-xs tracking-wide transition-all duration-200 whitespace-nowrap
                ${
                  activeId === item.id
                    ? "text-[#5BB5A2] bg-[#5BB5A2]/10 border-l-2 border-[#5BB5A2]"
                    : "text-white/45 hover:text-[#d4b896] hover:bg-[#d4b896]/8"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 토글 탭 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex flex-col items-center justify-center gap-1 px-1.5 py-5
          bg-[#0d0d0d]/70 backdrop-blur-sm border border-[#d4b896]/20
          hover:bg-[#0d0d0d]/90 hover:border-[#d4b896]/40
          transition-all duration-300 shadow-lg shadow-black/40 group
          ${open ? "border-l-0" : ""}`}
        style={{ borderRadius: open ? "0 4px 4px 0" : "4px 0 0 4px" }}
        aria-label="퀵 메뉴"
      >
        {open ? (
          <ChevronRight className="w-3 h-3 text-[#d4b896]/70 group-hover:text-[#d4b896] transition-colors" strokeWidth={1.5} />
        ) : (
          <>
            <ChevronLeft className="w-3 h-3 text-[#d4b896]/70 group-hover:text-[#d4b896] transition-colors" strokeWidth={1.5} />
            <span
              className="text-[#d4b896]/60 group-hover:text-[#d4b896]/90 transition-colors"
              style={{
                fontSize: "9px",
                letterSpacing: "0.15em",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              메뉴
            </span>
          </>
        )}
      </button>
    </div>
  );
}
