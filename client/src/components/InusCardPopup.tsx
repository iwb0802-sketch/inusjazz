import { useEffect, useState } from "react";
import { X } from "lucide-react";

const POPUP_IMG = "/manus-storage/popup-inuscard_cc6b7bb0.png";
const INUSCARD_URL = "https://inuscard.com";
const STORAGE_KEY = "inuscard_popup_closed";

export default function InusCardPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 오늘 닫은 경우 표시 안 함
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
    // 0.5초 후 팝업 표시
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  const handleCloseTodayOff = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-lg overflow-hidden shadow-2xl"
        style={{ animation: "fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
        >
          <X size={16} />
        </button>

        {/* 팝업 이미지 */}
        <img
          src={POPUP_IMG}
          alt="이너스 모바일 청첩장 오픈"
          className="w-full block"
        />

        {/* 버튼 영역 */}
        <div className="p-4 bg-white flex flex-col gap-2">
          <a
            href={INUSCARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 text-center text-white text-sm font-medium tracking-wider rounded-sm transition-colors duration-300"
            style={{ background: "#5BB5A2", fontFamily: "'Noto Sans KR', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4da393")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#5BB5A2")}
          >
            모바일 청첩장 바로가기 →
          </a>
          <div className="flex justify-between text-xs text-gray-400 pt-1">
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
  );
}
