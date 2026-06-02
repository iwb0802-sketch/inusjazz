import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp, Gift } from "lucide-react";

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
    <div
      className="fixed top-20 left-4 sm:left-6 z-[100]"
      style={{ animation: "fadeInUp 0.4s cubic-bezier(0.23,1,0.32,1)" }}
    >
      {/* 미니 버튼 */}
      <div className="flex items-center gap-2 mb-2">
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
            ? <ChevronUp size={13} className="text-white/60" />
            : <ChevronDown size={13} className="text-white/60" />
          }
        </button>
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1a1a1a]/80 border border-white/10 text-white/60 hover:text-white transition-colors shadow-md"
        >
          <X size={12} />
        </button>
      </div>

      {/* 펼쳐진 내용 */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-out origin-top-left ${
          expanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden border border-[#e8e4df]"
          style={{ width: "min(520px, calc(100vw - 2rem))" }}
        >
          {/* 팝업 이미지 */}
          <img
            src={POPUP_IMG}
            alt="이너스 모바일 청첩장 오픈"
            className="w-full block"
          />

          {/* 이벤트 배너 */}
          <div
            className="px-5 py-4 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)" }}
          >
            <div className="mt-0.5 flex-shrink-0">
              <Gift size={18} style={{ color: "#d4b896" }} />
            </div>
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: "#d4b896", fontFamily: "'Cormorant Garamond', serif" }}
              >
                모바일 청첩장 이벤트
              </p>
              <p
                className="text-white text-sm leading-relaxed"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                💌 <span className="font-medium">20만원 이상 예약 고객</span>
                <br />
                모바일 청첩장 <span style={{ color: "#5BB5A2" }} className="font-semibold">무료 제작 지원</span>
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="p-4 bg-white flex flex-col gap-2">
            <a
              href={INUSCARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center text-white text-sm font-medium tracking-wider rounded-sm transition-colors duration-300"
              style={{ background: "#5BB5A2", fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              모바일 청첩장 바로가기 →
            </a>
            <div className="flex justify-between text-xs text-gray-400 pt-0.5">
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
    </div>
  );
}
