import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FileText, Heart, Music, Mic } from "lucide-react";

const MATERIAL_GROUPS = [
  {
    icon: FileText,
    category: "진행 자료",
    items: [
      { title: "식순 멘트지", desc: "맞춤 식순지 제공" },
      { title: "식순 체크지 & 사전 질문지", desc: "맞춤형 사전 질문지 제공" },
    ],
  },
  {
    icon: Heart,
    category: "서약 · 선언",
    items: [
      { title: "혼인서약서 샘플", desc: "8종" },
      { title: "성혼선언문 샘플", desc: "8종" },
      { title: "덕담 샘플", desc: "6종" },
    ],
  },
  {
    icon: Music,
    category: "BGM",
    items: [
      { title: "BGM 약 100여곡 제공", desc: "상황별 맞춤 bgm" },
      { title: "BGM 편집", desc: "원하시는 bgm 편집" },
    ],
  },
];

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

        {/* Divider */}
        <div className="max-w-3xl mx-auto my-16 sm:my-20 flex items-center gap-6">
          <div className="flex-1 h-px bg-[#ddd]" />
          <span className="text-[#d4b896] text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>PROVIDED MATERIALS</span>
          <div className="flex-1 h-px bg-[#ddd]" />
        </div>

        {/* Materials - Grouped Cards */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="max-w-4xl mx-auto">
            <h3
              className="text-[#1a1a1a] text-lg sm:text-xl mb-10 text-center"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600 }}
            >
              예약 시 <span className="text-[#5BB5A2]">제공 자료</span> 안내
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MATERIAL_GROUPS.map((group, gi) => {
                const Icon = group.icon;
                return (
                  <div
                    key={gi}
                    className="bg-white border border-[#e8e4df] rounded-sm p-6 sm:p-7 hover:border-[#5BB5A2]/30 hover:shadow-md transition-all duration-500"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#f0ece7]">
                      <div className="w-9 h-9 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[#5BB5A2]" />
                      </div>
                      <span
                        className="text-[#1a1a1a] text-base font-semibold"
                        style={{ fontFamily: "'Noto Serif KR', serif" }}
                      >
                        {group.category}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-3.5">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex items-start gap-2.5">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#5BB5A2] flex items-center justify-center mt-0.5">
                            <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <div>
                            <p className="text-[#1a1a1a] text-sm font-medium leading-snug">{item.title}</p>
                            <p className="text-[#999] text-xs mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 실시간 문의하기 버튼 */}
            <div className="text-center mt-12">
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
