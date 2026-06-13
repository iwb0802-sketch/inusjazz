import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const POPUP_IMG = "/images/popup-inuscard.png";
const INUSCARD_URL = "https://inuscard.com";
const STORAGE_KEY = "inuscard_popup_closed_v2";

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
    const timer = setTimeout(() => setVisible(true), 800);
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
      {/* 미니 토글 버튼 */}
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 pl-3.5 pr-2.5 py-2 rounded-full border border-[#d9b86c]/50 bg-[#0d0a07]/90 text-xs font-semibold text-[#f0e6c8] backdrop-blur transition hover:border-[#d9b86c]/80 hover:bg-[#0d0a07]"
        >
          <span className="text-[#9ed4c0] text-[10px] tracking-[0.18em] uppercase font-bold">NEW</span>
          <span>모바일 청첩장</span>
          {expanded
            ? <ChevronUp size={12} className="text-[#d9b86c]/70" />
            : <ChevronDown size={12} className="text-[#d9b86c]/70" />
          }
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-[#d9b86c]/25 bg-[#0d0a07]/80 text-[#d7ccb4]/60 hover:text-white transition-colors backdrop-blur"
        >
          <X size={12} />
        </button>
      </div>

      {/* 펼쳐진 카드 */}
      <div
        className={`transition-all duration-300 ease-out origin-top-left ${
          expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none max-h-0 overflow-hidden"
        }`}
      >
        <div
          className="rounded-2xl border border-[#d9b86c]/25 bg-[#0f0c09] shadow-2xl shadow-black/60 overflow-y-auto"
          style={{ width: "min(340px, calc(100vw - 2rem))", maxHeight: "calc(100dvh - 7rem)" }}
        >
          {/* 헤더 */}
          <div className="px-5 pt-5 pb-4 border-b border-[#d9b86c]/12">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#9ed4c0] font-bold mb-1.5">Mobile Invitation</p>
            <h3 className="font-serif-kr text-lg font-semibold text-[#fff4d8] leading-snug">
              이너스뮤직 모바일 청첩장
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[#d7ccb4]/75">
              예약 고객님께 무료로 제공해드립니다.
            </p>
          </div>

          {/* 혜택 안내 */}
          <div className="px-5 py-4 space-y-2.5">
            {[
              "이너스뮤직 예약 고객님 전용 혜택",
              "감성적인 모바일 청첩장 무료 제작",
              "카카오톡 공유 · URL 발송 지원",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9ed4c0]" />
                <p className="text-sm text-[#e8dcc1]/85 leading-6">{item}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-5 pb-5 space-y-3">
            {/* 참고 이미지 */}
            <a href={INUSCARD_URL} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={POPUP_IMG}
                alt="모바일 청첩장 미리보기"
                className="w-full rounded-lg border border-[#d9b86c]/20 object-contain"
                style={{ maxHeight: "320px" }}
              />
            </a>
            <a
              href={INUSCARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center rounded-lg border border-[#9ed4c0] bg-[#9ed4c0] text-[#0d2a24] text-sm font-bold transition hover:bg-[#b2ddd2] hover:border-[#b2ddd2]"
            >
              모바일 청첩장 보러가기
            </a>
          </div>

          {/* 하단 */}
          <div className="flex justify-between px-5 pb-4 text-[11px] text-[#d7ccb4]/45">
            <button type="button" onClick={handleCloseTodayOff} className="hover:text-[#d7ccb4]/70 transition-colors">
              오늘 하루 보지 않기
            </button>
            <button type="button" onClick={handleClose} className="hover:text-[#d7ccb4]/70 transition-colors">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
