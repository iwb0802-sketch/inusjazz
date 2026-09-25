import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, ScrollText, Zap, Palette, BookHeart, Gift, Wallet } from "lucide-react";
import CountUpNumber from "@/components/CountUpNumber";

const GOLD = "#d4b896";

export default function IntroSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section id="intro" className="bg-[#0d0d0d] py-16 sm:py-20 lg:py-24 relative">
      {/* 상단 Hero → Intro 전환 그라데이션 */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, #050505 0%, transparent 100%)" }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
        {/* 헤드라인 */}
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-[11px] sm:text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Since 2015 &middot; Trusted Experience
          </span>
          <h2
            className="mt-4 text-white text-xl sm:text-3xl md:text-4xl leading-snug break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            검증된 웨딩 전문 브랜드,
            <br className="sm:hidden" />
            <span className="text-[#5BB5A2]"> 이너스뮤직</span>입니다.
          </h2>
          <p
            className="mt-5 text-white text-[14px] sm:text-lg leading-relaxed max-w-xl mx-auto break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600 }}
          >
            사회자 한 명을 정하는 게 아니라,
            <br />
            <span className="text-[#5BB5A2]">예식에 맞는 한 명을 찾는 것.</span>
          </p>
          <p className="mt-3 text-white/55 text-[13px] sm:text-base leading-relaxed max-w-xl mx-auto break-keep">
            <strong className="text-white font-semibold">300회 이상</strong> 실전 경험을 갖춘
            <strong className="text-white font-semibold"> 18인</strong>의 목소리와 진행 영상을 직접 비교하고,{" "}
            <br className="hidden sm:block" />
            하우스웨딩부터 호텔, 웨딩홀, 스몰웨딩까지 꼭 맞는 사회자를 선택하세요.
          </p>
        </div>

        {/* 이너스뮤직만의 이유 — 4가지 강점 카드 */}
        <div ref={anim3.ref} className={`mt-10 sm:mt-14 fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-[11px] sm:text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Why INUSMUSIC
          </span>
          <h3
            className="mt-3 text-white text-lg sm:text-2xl leading-snug break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            예식마다 다른 분위기,
            <br />
            <span className="text-[#5BB5A2]">사회자도 달라야 합니다</span>
          </h3>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                Icon: Palette,
                title: "예식별 맞춤 매칭",
                desc: "하우스웨딩 · 호텔 · 웨딩홀 · 스몰웨딩, 예식 형태에 맞는 사회자를 지정합니다",
              },
              {
                Icon: BookHeart,
                title: "두 사람만의 대본",
                desc: "신랑신부의 이야기를 담은 맞춤형 대본을 제작해 드립니다",
              },
              {
                Icon: Gift,
                title: "다양한 예약 혜택",
                desc: "지정 예약 시 여러 할인과 리워드를 중복으로 받을 수 있습니다",
              },
              {
                Icon: Wallet,
                title: "등급별 선택",
                desc: "원하는 스타일과 등급에 맞춰 사회자를 직접 선택할 수 있습니다",
              },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className="text-left px-5 py-6 rounded-sm"
                style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.06) 0%, rgba(212,184,150,0.02) 100%)", border: "1px solid rgba(212,184,150,0.14)" }}
              >
                <Icon size={22} style={{ color: "#5BB5A2" }} className="shrink-0" />
                <p className="mt-3 text-white text-[14px] sm:text-[15px] font-semibold break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {title}
                </p>
                <p className="mt-1.5 text-white/65 text-[12.5px] sm:text-[13.5px] leading-relaxed break-keep">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 숫자 3종 — 한 줄 압축 */}
        <div
          className="mt-9 sm:mt-12 grid grid-cols-3 rounded-sm overflow-hidden"
          style={{ background: "linear-gradient(145deg, rgba(212,184,150,0.06) 0%, rgba(212,184,150,0.02) 100%)", border: "1px solid rgba(212,184,150,0.14)" }}
        >
          {[
            { value: <>2015</>, en: "Since", label: "10년 이상 경험" },
            {
              value: (
                <>
                  <CountUpNumber targetNumber={2700} duration={2000} className="text-[#d4b896]" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                  <span className="text-base sm:text-xl text-white/40 ml-0.5">+</span>
                </>
              ),
              en: "Reviews",
              label: "실제 누적 후기",
            },
            {
              value: (
                <>
                  <CountUpNumber targetNumber={40000} duration={2000} className="text-[#d4b896]" style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                  <span className="text-base sm:text-xl text-white/40 ml-0.5">+</span>
                </>
              ),
              en: "Couples",
              label: "함께한 예식",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="px-2 py-6 sm:py-8"
              style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(212,184,150,0.14)" }}
            >
              <p
                className="text-[#d4b896] text-[26px] sm:text-4xl font-bold tracking-tight leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.value}
              </p>
              <p className="text-white/30 text-[9px] sm:text-[11px] tracking-[0.2em] uppercase mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {s.en}
              </p>
              <p className="text-white text-[11px] sm:text-sm font-medium mt-1 break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* 신뢰 보증 3종 — 칩 형태로 압축 */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { Icon: ShieldCheck, label: "No-show 걱정 없는 인력 관리" },
              { Icon: ScrollText, label: "전속 계약 100% 책임 진행" },
              { Icon: Zap, label: "돌발 상황 즉각 대응" },
            ].map(({ Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-sm break-keep"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Icon size={16} style={{ color: GOLD }} className="shrink-0" />
                <span className="text-white/85 text-[12.5px] sm:text-sm" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
