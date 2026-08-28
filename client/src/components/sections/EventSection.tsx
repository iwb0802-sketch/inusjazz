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
  Headset,
  ShieldCheck,
  MapPin,
  Ticket,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const EVENT_LINK = "https://blog.naver.com/inusmusics/220652958346";
const KAKAO_LINK = "https://pf.kakao.com/_wxovaM/chat";
const AUDIO_TOOL =
  "https://www.inusmusic.com/audio?utm_source=home&utm_medium=freetool&utm_campaign=audio_open";

// 혜택 카테고리 (총 15가지 · 25만원 상당)
const BENEFIT_GROUPS = [
  {
    icon: Smartphone,
    label: "INVITATION & AUDIO",
    title: "청첩장 · 음원",
    color: "#c09a7e",
    items: [
      { t: "모바일 청첩장 무료 제작", d: "예약 고객 한정 · 공유 권한 부여 (무한 수정)", w: "6만원 상당" },
      {
        t: "셀프 음원 편집기 무료 이용",
        d: "입장곡 · 행진곡을 직접 자르고 이어붙이는 전용 도구",
        w: "4만원 상당",
        href: AUDIO_TOOL,
      },
      { t: "MR 제공 및 MR / AR 편집 지원", d: "요청 시 전문가가 직접 편집", w: "포함" },
    ],
  },
  {
    icon: Mic2,
    label: "SCRIPT & DOCS",
    title: "대본 · 진행 자료",
    color: "#5BB5A2",
    items: [
      { t: "두 사람의 이야기를 담은 맞춤형 대본 제작", d: "상담 내용을 대표가 직접 반영", w: "5만원 상당" },
      { t: "지정 사회자와 사전 통화 & 식순 협의", d: "예식 전 사회자와 직접 소통", w: "3만원 상당" },
      { t: "식순 멘트지 · 식순 체크지 · 사전 질문지", d: "예식 흐름을 한눈에 정리", w: "2만원 상당" },
      { t: "혼인서약서 8종 · 성혼선언문 8종 · 덕담 6종", d: "총 22종 샘플 제공", w: "포함" },
    ],
  },
  {
    icon: Music4,
    label: "MUSIC",
    title: "음악",
    color: "#c09a7e",
    items: [
      { t: "예식 분위기에 맞는 식순별 BGM 100여 곡", d: "식순별로 정리된 큐레이션 제공", w: "3만원 상당" },
      { t: "요청 시 맞춤형 BGM 편집 지원", d: "곡 길이 · 진입 타이밍까지 조정", w: "2만원 상당" },
    ],
  },
  {
    icon: Headset,
    label: "CARE & PROOF",
    title: "케어 · 증빙",
    color: "#5BB5A2",
    items: [
      { t: "대표 · 전문 코디네이터 전담 관리", d: "예약부터 예식 당일까지 담당자가 끝까지 함께합니다", w: "포함" },
      { t: "세금계산서 · 현금영수증 발행", d: "요청 시 정식 증빙 발행", w: "포함" },
      { t: "결혼식 준비 체크리스트 · 웨딩가이드", d: "예식 주간 · 당일 안내 꿀팁", w: "포함" },
    ],
  },
  {
    icon: ShieldCheck,
    label: "GUARANTEE",
    title: "책임 진행",
    color: "#c09a7e",
    items: [
      { t: "전속 계약 100% 책임 진행", d: "No-show 걱정 없는 전속 사회자만 배정", w: "포함" },
      { t: "예식 2시간 전 · 1시간 전 현장 도착 이중 체크", d: "담당자가 직접 확인", w: "포함" },
      { t: "만일의 상황 대비, 예비 사회자 상시 대기", d: "돌발 변수까지 이너스가 책임집니다", w: "포함" },
    ],
  },
];

// 중복 적용 가능한 할인 (총 4가지 · 최대 5만원)
const DISCOUNTS = [
  {
    icon: Sparkles,
    label: "REVIEW",
    title: "2만원 할인",
    desc: "숨고 상담 후기 작성 시",
    href: EVENT_LINK,
    external: true,
    color: "#c09a7e",
  },
  {
    icon: Users,
    label: "FRIEND",
    title: "1만원 할인",
    desc: "지인 코드번호 부여받으실 경우",
    href: KAKAO_LINK,
    external: true,
    color: "#5BB5A2",
  },
  {
    icon: Crown,
    label: "VOTE ON VOICE",
    title: "1만원 할인",
    desc: "지난달 VOV 선정 사회자 지정 예약 시",
    href: "/contest",
    external: false,
    color: "#d4b896",
  },
  {
    icon: Ticket,
    label: "HIDDEN GEMS",
    title: "1만원 할인",
    desc: "아직 덜 알려진 실력자 6인 예약 시",
    href: "/#hidden-gems",
    external: false,
    color: "#5BB5A2",
  },
];

export default function EventSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();
  const anim4 = useScrollAnimation();

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

          <div
            className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-5 px-4 py-2.5 rounded-full"
            style={{ background: "rgba(91,181,162,0.09)", border: "1px solid rgba(91,181,162,0.32)" }}
          >
            <Gift size={14} className="text-[#3f9d8a] flex-shrink-0" />
            <span className="text-[#2f8b78] text-[12.5px] sm:text-[14px] font-bold break-keep whitespace-nowrap">
              총 15가지 · 25만원 상당 무료 제공
            </span>
          </div>

          <p className="mt-4 text-[#666] text-[13px] sm:text-base leading-relaxed break-keep max-w-[20rem] sm:max-w-none mx-auto">
            <span className="whitespace-nowrap">사회자 예약만 하셔도 아래 혜택이 전부 따라오고,</span>
            <br className="sm:hidden" />{" "}
            <span className="whitespace-nowrap">여기에 최대 5만원까지 추가 할인됩니다.</span>
          </p>
        </div>

        {/* 안심 보장 3종 */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div
            className="relative overflow-hidden rounded-xl p-6 sm:p-8 mb-4 sm:mb-5"
            style={{
              background: "linear-gradient(135deg, #1f2422 0%, #14211d 55%, #1a1a1a 100%)",
              border: "1px solid rgba(212,184,150,0.28)",
            }}
          >
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(91,181,162,0.18) 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4"
                style={{ background: "rgba(212,184,150,0.14)", border: "1px solid rgba(212,184,150,0.4)" }}
              >
                <ShieldCheck size={12} className="text-[#d4b896]" />
                <span className="text-[#d4b896] text-[10px] sm:text-[11px] font-bold tracking-[0.12em]">
                  이너스 안심 보장
                </span>
              </div>

              <h3
                className="text-white text-[19px] min-[375px]:text-[21px] sm:text-[26px] leading-snug break-keep mb-5"
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
              >
                <span className="whitespace-nowrap">예식 전주까지 취소하시면</span>{" "}
                <span className="text-[#d4b896] whitespace-nowrap">계약금 100% 환불</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, t: "계약금 100% 환불", d: "예식 전주까지 취소 시\n위약금 없이 전액 반환" },
                  { icon: Mic2, t: "사회자 17인 전원 공개", d: "목소리 · 진행 영상까지\n예약 전에 직접 확인" },
                  { icon: MapPin, t: "주말 예약현황 공개", d: "서울 · 경기 · 인천 진행\n(지역에 따라 출장비 별도)" },
                ].map((b) => (
                  <div
                    key={b.t}
                    className="rounded-lg p-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
                  >
                    <b.icon size={16} className="text-[#5BB5A2] mb-2" />
                    <p className="text-white text-[13px] sm:text-sm font-bold break-keep">{b.t}</p>
                    <p className="text-white/55 text-[11.5px] sm:text-xs mt-1 leading-relaxed break-keep whitespace-pre-line">
                      {b.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 혜택 카테고리 4종 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {BENEFIT_GROUPS.map((g) => (
              <div
                key={g.title}
                className="rounded-xl p-6 sm:p-7"
                style={{ background: "#faf9f7", border: "1px solid #ececec" }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${g.color}1f` }}
                  >
                    <g.icon size={17} style={{ color: g.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold tracking-[0.16em]" style={{ color: g.color }}>
                      {g.label}
                    </span>
                    <h3
                      className="text-[#1a1a1a] text-[15px] sm:text-base font-bold break-keep"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {g.title}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 text-[#aaa] text-[11px] font-semibold">{g.items.length}가지</span>
                </div>

                <div className="space-y-2.5">
                  {g.items.map((it) => (
                    <div
                      key={it.t}
                      className="rounded-lg p-3.5 bg-white"
                      style={{ border: "1px solid #eee" }}
                    >
                      <div className="flex items-start gap-2.5">
                        <Check size={15} className="text-[#5BB5A2] flex-shrink-0 mt-[3px]" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[#1a1a1a] text-[13px] sm:text-sm font-semibold break-keep">{it.t}</p>
                            <span
                              className="flex-shrink-0 text-[10.5px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                              style={
                                it.w === "포함"
                                  ? { background: "#f2f1ee", color: "#999" }
                                  : { background: "rgba(192,154,126,0.14)", color: "#a87b57" }
                              }
                            >
                              {it.w}
                            </span>
                          </div>
                          <p className="text-[#777] text-[11.5px] sm:text-xs mt-1 leading-relaxed break-keep">{it.d}</p>

                          {"href" in it && it.href && (
                            <a
                              href={it.href as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1 mt-2 text-[11.5px] sm:text-xs font-bold text-[#3f9d8a] hover:text-[#2f8b78] transition-colors"
                            >
                              지금 바로 사용해보기
                              <ExternalLink size={11} className="transition-transform duration-300 group-hover:translate-x-[2px]" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사회 + 축가 패키지 */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""} mt-4 sm:mt-5`}>
          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ background: "#fff", border: "2px solid rgba(212,184,150,0.55)", boxShadow: "0 4px 20px rgba(192,154,126,0.1)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div className="flex-1 min-w-0">
                <span className="block text-[#c09a7e] text-[10px] font-bold tracking-[0.16em] mb-1.5">
                  BUNDLE PACKAGE
                </span>
                <h3
                  className="text-[#1a1a1a] text-[19px] min-[375px]:text-[21px] sm:text-[25px] leading-snug break-keep"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  <span className="whitespace-nowrap">사회 + 축가 함께 예약 시</span>{" "}
                  <span className="text-[#5BB5A2] whitespace-nowrap">260,000원</span>
                </h3>

                <ul className="mt-4 space-y-2">
                  {[
                    "등급 상관없이 원하는 사회자 또는 싱어 1명 지정 가능",
                    "연주 + 축가 + 사회 묶음도 등급 무관 아티스트 1명 지정",
                    "패키지 예약 시 정가 대비 기본 3~5만원 할인 적용",
                    "같은 팀이 사전에 호흡을 맞춰 예식 흐름이 매끄럽습니다",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[#555] text-[12.5px] sm:text-sm leading-relaxed break-keep">
                      <Check size={14} className="text-[#5BB5A2] flex-shrink-0 mt-[3px]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={KAKAO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 flex-shrink-0 rounded-lg px-5 py-3.5 text-[13px] sm:text-sm font-bold transition-all duration-300 hover:-translate-y-[2px]"
                style={{
                  background: "linear-gradient(135deg,#e0c188,#cba55f)",
                  color: "#1a1a1a",
                  boxShadow: "0 6px 18px rgba(203,165,95,0.28)",
                }}
              >
                <span className="whitespace-nowrap">패키지 문의하기</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* 중복 적용 가능한 할인 */}
        <div ref={anim4.ref} className={`fade-up ${anim4.isVisible ? "visible" : ""} mt-8 sm:mt-10`}>
          <div className="text-center mb-5">
            <h3
              className="text-[#1a1a1a] text-[17px] sm:text-xl break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              중복 적용되는 할인 <span className="text-[#c09a7e]">4가지 · 최대 5만원</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {DISCOUNTS.map((e) => (
              <a
                key={e.label}
                href={e.href}
                {...(e.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                  <p
                    className="text-[#1a1a1a] text-[15px] sm:text-base font-bold break-keep"
                    style={{ fontFamily: "'Noto Serif KR', serif" }}
                  >
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
    </section>
  );
}
