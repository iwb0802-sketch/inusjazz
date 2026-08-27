import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function PackageSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();

  return (
    <section id="package" className="bg-[#f8f6f3] py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            WEDDING PACKAGE
          </span>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <h2
              className="text-[#1a1a1a] text-xl sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              완성형 웨딩 패키지
            </h2>
            <span className="text-[#999] text-[10px] sm:text-xs border border-[#ccc] rounded-full px-2.5 py-0.5 tracking-wider whitespace-nowrap">
              참고사항
            </span>
          </div>
          <p className="mt-4 text-[#666] text-xs sm:text-base max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
            사회 · 축가 · 연주 · 뮤지컬웨딩을
            <br className="sm:hidden" />
            각각 따로 준비하지 마세요.
            <br />
            하나로 설계될 때
            <br className="sm:hidden" />
            예식의 흐름과 완성도가 달라집니다.
          </p>
          <a
            href="https://blog.naver.com/inusmusics/220652965646"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 mt-8 px-8 py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] text-sm sm:text-base tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-all duration-500 rounded-sm"
          >
            <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600 }}>완성형 패키지 자세히 보기</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="max-w-4xl mx-auto">
            {/* 실시간 문의하기 버튼 */}
            <div className="text-center mt-16">
              <a
                href="https://pf.kakao.com/_wxovaM/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-[#391B1B] text-white text-sm sm:text-base tracking-wider hover:bg-[#2a1212] transition-all duration-400 rounded-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.88 5.29 4.68 6.68l-.87 3.16c-.1.36.28.64.6.44l3.7-2.27c.62.09 1.25.14 1.89.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 500 }}>실시간 문의하기</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
