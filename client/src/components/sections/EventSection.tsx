/**
 * EventSection - 이너스뮤직 특별 이벤트 총정리
 * 허브(inusmusic.com) '이벤트 총정리' 내용을 사회자 사이트 기준으로 재구성
 * Design: Light premium (white / #faf9f7) + Mint(#5BB5A2) & Gold(#d4b896)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Gift,
  Check,
  Mic2,
  Users,
  Sparkles,
  Crown,
  Music4,
  Smartphone,
  ArrowRight,
} from "lucide-react";

const EVENT_LINK = "https://blog.naver.com/inusmusics/220652958346";

// 공통 혜택 (모든 신랑신부님)
const COMMON = [
  {
    icon: Users,
    title: "지인 할인",
    desc: "코드번호 부여받으실 경우 1만원 할인",
  },
  {
    icon: Music4,
    title: "MR 제공 및 편집",
    desc: "MR 제공 · MR/AR 편집 지원",
  },
  {
    icon: Smartphone,
    title: "모바일청첩장 무료 제공",
    desc: "예약 고객에 한해 무료 제작 및\n공유 권한 부여 (무한 수정)",
  },
];

// 사회자 예약 시 혜택
const MC_BENEFITS = [
  "두 사람의 이야기를 담은 맞춤형 대본 제작",
  "예식 분위기에 맞는 BGM 100여 곡 제공",
  "완성도 높은 혼인서약서 샘플 8종 제공",
  "격식과 감성을 담은 성혼선언문 샘플 8종 제공",
  "감동을 더하는 덕담 샘플 6종 제공",
];

// 사회자 사이트 전용 중복 할인
const EXTRA = [
  {
    icon: Crown,
    label: "VOTE ON VOICE",
    title: "1만원 할인",
    desc: "지난달 VOV 선정 사회자 지정 예약 시",
    href: "/contest",
    color: "#d4b896",
  },
  {
    icon: Sparkles,
    label: "HIDDEN GEMS",
    title: "1만원 추가 할인",
    desc: "아직 덜 알려진 실력자 5인 예약 시",
    href: "/#hidden-gems",
    color: "#5BB5A2",
  },
];

export default function EventSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section id="event" className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""} text-center mb-10 sm:mb-14`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SPECIAL BENEFITS
          </span>
          <h2
            className="mt-3 text-[#1a1a1a] text-[22px] min-[375px]:text-2xl sm:text-3xl md:text-4xl break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            이너스뮤직 <span className="text-[#5BB5A2]">특별 이벤트</span>
          </h2>
          <p className="mt-4 text-[#666] text-[13px] sm:text-base leading-relaxed break-keep max-w-[20rem] sm:max-w-none mx-auto">
            <span className="whitespace-nowrap">이너스뮤직과 함께하는 모든 신랑신부님께</span>
            <br className="sm:hidden" />{" "}
            <span className="whitespace-nowrap">드리는 혜택을 한 번에 정리했습니다.</span>
          </p>
        </div>

        {/* 대표 혜택 — 숨고 리뷰 2만원 */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div
            className="relative overflow-hidden rounded-xl p-6 sm:p-9 mb-4 sm:mb-5"
            style={{
              background: "linear-gradient(135deg, #1f2422 0%, #14211d 55%, #1a1a1a 100%)",
              border: "1px solid rgba(212,184,150,0.28)",
            }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(91,181,162,0.18) 0%, transparent 70%)" }}
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div className="flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                  style={{ background: "rgba(212,184,150,0.14)", border: "1px solid rgba(212,184,150,0.4)" }}
                >
                  <Gift size={12} className="text-[#d4b896]" />
                  <span className="text-[#d4b896] text-[10px] sm:text-[11px] font-bold tracking-[0.12em]">
                    365일 상시 이벤트
                  </span>
                </div>

                <h3
                  className="text-white text-[19px] min-[375px]:text-[21px] sm:text-[26px] leading-snug break-keep"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  <span className="whitespace-nowrap">
                    상담 후기 작성 시 <span className="text-[#d4b896]">2만원 할인</span>
                  </span>
                </h3>

                <ul className="mt-4 space-y-2">
                  {[
                    "숨고 상담 후기 작성 시 2만원 할인",
                    "결혼식 준비 체크리스트 자료 제공",
                    "웨딩가이드 제공 (예식 주간·당일 안내 꿀팁)",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-white/70 text-[12.5px] sm:text-sm leading-relaxed break-keep">
                      <Check size={14} className="text-[#5BB5A2] flex-shrink-0 mt-[3px]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={EVENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 flex-shrink-0 rounded-lg px-5 py-3 text-[13px] sm:text-sm font-bold transition-all duration-300 hover:-translate-y-[2px]"
                style={{
                  background: "linear-gradient(135deg,#e0c188,#cba55f)",
                  color: "#1a1a1a",
                  boxShadow: "0 6px 18px rgba(203,165,95,0.28)",
                }}
              >
                <span className="whitespace-nowrap">이벤트 자세히 보기</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* 2단 — 사회자 예약 혜택 / 공통 혜택 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* 사회자 예약 시 혜택 */}
            <div
              className="rounded-xl p-6 sm:p-7"
              style={{ background: "#faf9f7", border: "1px solid #ececec" }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(91,181,162,0.12)" }}>
                  <Mic2 size={17} className="text-[#5BB5A2]" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[#5BB5A2] text-[10px] font-bold tracking-[0.16em]">WEDDING MC</span>
                  <h3 className="text-[#1a1a1a] text-[15px] sm:text-base font-bold break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    사회자 예약 시 혜택
                  </h3>
                </div>
              </div>

              <p className="text-[#888] text-[11.5px] sm:text-xs mt-3 mb-4 break-keep leading-relaxed">
                추가 비용 없이, 예약만 하셔도 모두 제공됩니다.
              </p>

              <ul className="space-y-2.5">
                {MC_BENEFITS.map((t, i) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span
                      className="flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold mt-[1px]"
                      style={{ background: "rgba(91,181,162,0.12)", color: "#3f9d8a" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[#555] text-[12.5px] sm:text-sm leading-relaxed break-keep">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 공통 혜택 */}
            <div
              className="rounded-xl p-6 sm:p-7"
              style={{ background: "#faf9f7", border: "1px solid #ececec" }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,184,150,0.14)" }}>
                  <Gift size={17} className="text-[#c09a7e]" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[#c09a7e] text-[10px] font-bold tracking-[0.16em]">FOR EVERYONE</span>
                  <h3 className="text-[#1a1a1a] text-[15px] sm:text-base font-bold break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    공통 혜택
                  </h3>
                </div>
              </div>

              <p className="text-[#888] text-[11.5px] sm:text-xs mt-3 mb-4 break-keep leading-relaxed">
                어떤 상품을 예약하셔도 동일하게 적용됩니다.
              </p>

              <div className="space-y-3">
                {COMMON.map((c) => (
                  <div
                    key={c.title}
                    className="flex items-start gap-3 rounded-lg p-3.5 bg-white transition-colors duration-300 hover:border-[#d4b896]/45"
                    style={{ border: "1px solid #eee" }}
                  >
                    <c.icon size={16} className="text-[#c09a7e] flex-shrink-0 mt-[2px]" />
                    <div className="min-w-0">
                      <p className="text-[#1a1a1a] text-[13px] sm:text-sm font-semibold break-keep">{c.title}</p>
                      <p className="text-[#777] text-[11.5px] sm:text-xs mt-0.5 leading-relaxed break-keep whitespace-pre-line">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사회자 사이트 전용 중복 할인 */}
          <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""} mt-4 sm:mt-5`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {EXTRA.map((e) => (
                <a
                  key={e.title}
                  href={e.href}
                  className="group flex items-center gap-4 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-[2px]"
                  style={{ background: "#fff", border: `1px solid ${e.color}55`, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${e.color}1f` }}
                  >
                    <e.icon size={19} style={{ color: e.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9.5px] font-bold tracking-[0.14em] mb-0.5" style={{ color: e.color }}>
                      {e.label}
                    </span>
                    <p className="text-[#1a1a1a] text-[15px] sm:text-base font-bold break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                      {e.title}
                    </p>
                    <p className="text-[#777] text-[11.5px] sm:text-xs mt-0.5 leading-relaxed break-keep">{e.desc}</p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: e.color }}
                  />
                </a>
              ))}
            </div>

            <p className="text-center text-[#999] text-[11px] sm:text-xs mt-6 break-keep leading-relaxed">
              <span className="whitespace-nowrap">할인 혜택은 중복 적용이 가능합니다.</span>
              <br className="sm:hidden" />{" "}
              <span className="whitespace-nowrap">자세한 내용은 상담 시 안내드립니다.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
