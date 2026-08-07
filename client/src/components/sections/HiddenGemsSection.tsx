/**
 * HiddenGemsSection - 아직 저평가된 숨은 강자 사회자 소개
 * Design: Premium dark + mint accent
 * Brand: Mint (#5BB5A2) + Gold (#d4b896)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, ChevronRight } from "lucide-react";

// 아직 널리 알려지지 않았지만 실력이 확실한 사회자 (숨은 강자)
const HIDDEN_GEMS = [
  {
    name: "민준호",
    tier: "PREMIUM",
    highlight: "위트있고 젠틀한 진행, 홈쇼핑 방송으로만 2억+ 매출",
    image: "/images/mc-minjunho.jpg",
    url: "https://blog.naver.com/inusmusics/223597460181",
  },
  {
    name: "심비성",
    tier: "STANDARD",
    highlight: "예식장 음향 감독 출신, 훈훈한 비주얼에 진행까지 깔끔",
    image: "/images/mc-simbiseong.jpg",
    url: "https://blog.naver.com/inusmusics/224198308789",
  },
  {
    name: "이도건",
    tier: "STANDARD",
    highlight: "예식장·호텔 음향 감독 출신, 훈훈한 비주얼과 안정감 있는 진행",
    image: "/images/mc-idogeon.jpg",
    url: "https://blog.naver.com/inusmusics/224099418463",
  },
  {
    name: "김범태",
    tier: "STANDARD",
    highlight: "현직 배우로 활동중, 라디오DJ 같은 부드럽고 위트있는 진행",
    image: "/images/mc-kimbeomtae.jpg",
    url: "https://blog.naver.com/inusmusics/223192531041",
  },
  {
    name: "김태우",
    tier: "BEST",
    highlight: "스탠드업 코미디언 출신, 유쾌한 입담과 뛰어난 순발력",
    image: "/images/mc-kimtaewoo.jpg",
    url: "https://blog.naver.com/inusmusics/224364756942",
  },
];

export default function HiddenGemsSection() {
  const anim3 = useScrollAnimation();

  return (
    <section id="hidden-gems" className="relative bg-[#0d0d0d] pt-0 pb-24 sm:pb-32 lg:pb-40 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
    {/* 숨은 강자 — 아직 널리 알려지지 않은 실력자들 */}
    <div
      ref={anim3.ref}
      className={`fade-up ${anim3.isVisible ? "visible" : ""}`}
    >
      <div className="text-center mb-8 sm:mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(91,181,162,0.10)", border: "1px solid rgba(91,181,162,0.35)" }}
        >
          <Sparkles size={13} className="text-[#5BB5A2]" />
          <span className="text-[#5BB5A2] text-xs font-semibold tracking-[0.15em] uppercase">
            Hidden Gems
          </span>
        </div>

        {/* 규모(17명) 전달 + TOP 9와 우열 뉘앙스 제거 (기준 축: 인기 vs 인지도 대비 실력) */}
        <h3
          className="text-white text-[17px] min-[375px]:text-[19px] leading-snug sm:text-2xl mb-3 break-keep max-w-[19rem] sm:max-w-none mx-auto"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
        >
          <span className="whitespace-nowrap">
            소속 사회자 <span className="text-[#d4b896]">17명</span>.
          </span>
          <br className="sm:hidden" />
          {" "}
          <span className="whitespace-nowrap">그중 <span className="text-[#5BB5A2]">아직 덜 알려진</span></span>
          <br className="sm:hidden" />
          {" "}
          <span className="whitespace-nowrap"><span className="text-[#5BB5A2]">실력자 5인</span>을 따로 소개합니다.</span>
        </h3>

        <p className="text-white/50 text-xs sm:text-sm leading-relaxed break-keep max-w-[19rem] sm:max-w-xl mx-auto">
          <span className="whitespace-nowrap">검증 기준은 위 TOP 사회자와 똑같습니다.</span>
          <br className="sm:hidden" />
          {" "}
          <span className="whitespace-nowrap">다른 건 인지도뿐입니다.</span>
          <br className="sm:hidden" />
          {" "}
          <span className="whitespace-nowrap">
            그래서 지금 예약하시면 <span className="text-[#d4b896] font-semibold">1만원 추가 할인</span>을 드려요.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {HIDDEN_GEMS.map((mc, i) => (
          <a
            key={mc.name}
            href={mc.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col items-center text-center p-3 sm:p-4 rounded-lg transition-all duration-300 ${
              i === HIDDEN_GEMS.length - 1 && HIDDEN_GEMS.length % 2 !== 0
                ? "col-span-2 max-w-[calc(50%-0.375rem)] mx-auto sm:col-span-1 sm:max-w-none sm:mx-0"
                : ""
            }`}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(91,181,162,0.18)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(91,181,162,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(91,181,162,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
              (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(91,181,162,0.18)";
            }}
          >
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 flex-shrink-0"
              style={{ border: "2px solid rgba(91,181,162,0.4)" }}
            >
              <img src={mc.image} alt={`${mc.name} 사회자`} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span
              className="text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full mb-1.5"
              style={{
                background: mc.tier === "PREMIUM" ? "rgba(212,184,150,0.15)" : "rgba(91,181,162,0.15)",
                color: mc.tier === "PREMIUM" ? "#d4b896" : "#5BB5A2",
              }}
            >
              {mc.tier}
            </span>
            <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              {mc.name} 사회자
            </p>
            <p className="text-white/45 text-[11px] leading-snug break-keep">{mc.highlight}</p>
            <div className="flex items-center gap-0.5 text-[#5BB5A2]/70 text-[11px] mt-2 group-hover:gap-1.5 transition-all duration-300">
              <span>프로필 보기</span>
              <ChevronRight size={11} />
            </div>
          </a>
        ))}
      </div>
    </div>
      </div>
    </section>
  );
}
