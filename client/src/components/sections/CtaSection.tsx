import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTA_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/dSEPyYhKaURpakfz.jpg";

export default function CtaSection() {
  const anim1 = useScrollAnimation();

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={CTA_BG} alt="웨딩 스테이지" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            START YOUR PERFECT WEDDING
          </span>
          <h2
            className="mt-6 text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            특별한 날, 완벽한 진행
            <br />
            <span className="text-[#5BB5A2]">이너스뮤직</span>과 함께
          </h2>
          <p className="mt-6 text-white/60 text-sm sm:text-base leading-relaxed">
            잊지 못할 결혼식을 만들어보세요
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://pf.kakao.com/_wxovaM/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#FEE500] text-[#1a1a1a] text-sm sm:text-base font-medium tracking-wider hover:bg-[#f5dc00] transition-colors duration-300 rounded-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.735 1.805 5.136 4.517 6.491-.157.58-.57 2.105-.652 2.432-.1.397.146.392.307.285.126-.084 2.005-1.362 2.82-1.919.64.093 1.3.142 1.975.142h.033c5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
              </svg>
              카카오톡 상담하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
