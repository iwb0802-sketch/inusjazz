import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const POPUP_IMG = "/images/popup-inuscard.png";
const INUSCARD_URL = "https://inuscard.com";
const STORAGE_KEY = "inuscard_popup_closed";

export default function InusCardPopup() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const closed = localStorage.getItem(STORAGE_KEY);
    if (closed) {
      const closedDate = new Date(closed);
      const now = new Date();
      const isSameDay =
        closedDate.getFullYear() === now.getFullYear() &&
        closedDate.getMonth() === now.getMonth() &&
        closedDate.getDate() === now.getDate();
      if (isSameDay) return;
    }
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExpanded(false);
    setTimeout(() => setVisible(false), 200);
  };

  const handleCloseTodayOff = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    handleClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-[100]" style={{ animation: "fadeInUp 0.4s cubic-bezier(0.23,1,0.32,1)" }}>
      {/* 펼쳐진 내용 */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-out origin-bottom-left ${
          expanded ? "max-h-[700px] opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <div className="w-80 bg-white rounded-lg shadow-2xl overflow-hidden border border-[#e8e4df]">
          <img
            src={POPUP_IMG}
            alt="이너스 모바일 청첩장 오픈"
            className="w-full block"
          />
          <div className="p-3 bg-white flex flex-col gap-2">
            <a
              href={INUSCARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center text-white text-xs font-medium tracking-wider rounded-sm transition-colors duration-300"
              style={{ background: "#5BB5A2", fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              모바일 청첩장 바로가기 →
            </a>
            <div className="flex justify-between text-[11px] text-gray-400 pt-0.5">
              <button
                onClick={handleCloseTodayOff}
                className="hover:text-gray-600 transition-colors"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                오늘 하루 보지 않기
              </button>
              <button
                onClick={handleClose}
                className="hover:text-gray-600 transition-colors"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 미니 버튼 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full shadow-lg text-white text-xs font-medium tracking-wider transition-all duration-300 hover:shadow-xl active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            border: "1px solid rgba(212,184,150,0.4)",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          <span
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d4b896" }}
          >
            NEW
          </span>
          <span className="text-white/90">모바일 청첩장 OPEN</span>
          {expanded
            ? <ChevronDown size={13} className="text-white/60" />
            : <ChevronUp size={13} className="text-white/60" />
          }
        </button>
        {/* X 버튼 */}
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1a1a1a]/80 border border-white/10 text-white/60 hover:text-white transition-colors shadow-md"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
