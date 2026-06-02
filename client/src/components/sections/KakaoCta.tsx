import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function KakaoCta() {
  const anim1 = useScrollAnimation();

  return (
    <section className="bg-[#0d0d0d] py-20 sm:py-24">
      <div ref={anim1.ref} className={`max-w-2xl mx-auto px-4 sm:px-6 text-center fade-up ${anim1.isVisible ? "visible" : ""}`}>
        <span
          className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          KAKAO TALK CONSULTATION
        </span>
        <h2
          className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl mb-6"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
        >
          카카오톡으로 간편하게
          <br />
          <span className="text-[#5BB5A2]">상담</span> 받아보세요
        </h2>
        <p className="text-white/50 text-sm mb-10">
          실제 본식 진행 영상과 전체 흐름을 확인해보신 후, 현재 예약 진행 상황도 함께 확인해보시기 바랍니다.
        </p>
        <a
          href="https://pf.kakao.com/_wxovaM/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-[#FEE500] text-[#1a1a1a] text-sm sm:text-base font-medium tracking-wider hover:bg-[#f5dc00] transition-colors duration-300 rounded-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.735 1.805 5.136 4.517 6.491-.157.58-.57 2.105-.652 2.432-.1.397.146.392.307.285.126-.084 2.005-1.362 2.82-1.919.64.093 1.3.142 1.975.142h.033c5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
          </svg>
          카카오톡 상담하기
        </a>
      </div>
    </section>
  );
}
