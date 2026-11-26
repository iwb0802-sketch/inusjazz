/**
 * EventSection - 이너스뮤직 특별 이벤트 총정리
 * 허브(inusmusic.com) '이벤트 총정리' 내용을 사회자 사이트 기준으로 재구성
 * Design: Light premium (white / #faf9f7) + Gold(#a8814f / #d4b896) · 민트는 버튼·링크에만
 */
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReadingFocus } from "@/hooks/useReadingFocus";
import { useCountUp } from "@/hooks/useCountUp";
import QuoteCalculator from "./QuoteCalculator";
import {
  Check,
  Mic2,
  Music4,
  Smartphone,
  Headset,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

const AUDIO_TOOL =
  "https://www.inusmusic.com/audio?utm_source=home&utm_medium=freetool&utm_campaign=audio_open";
const PREWEDDING_VIDEO_TOOL =
  "https://prewedding-video-renderer-production.up.railway.app/editor";

// 혜택 카테고리 (금액이 명시된 항목의 합 27만원 상당 · 총 가지 수는 ALL_ITEMS.length로 자동 계산)
const BENEFIT_GROUPS = [
  {
    icon: Smartphone,
    label: "INVITATION & MEDIA",
    title: "청첩장 · 음원 · 영상",
    color: "#c09a7e",
    items: [
      {
        t: "모바일 청첩장 제작",
        d: "예약 고객 한정 · 공유 권한 부여 (무한 수정)",
        w: "4만원 상당",
        href: "https://inuscard.com/",
      },
      {
        t: "셀프 음원 편집기 이용",
        d: "입장곡 · 행진곡을 직접 자르고 이어붙이는 전용 도구",
        w: "4만원 상당",
        href: AUDIO_TOOL,
      },
      {
        t: "프리미엄 식전영상 제작 지원",
        d: "사진 · 영상을 직접 편집해 완성도 높은 식전영상 완성",
        w: "4만원 상당",
        href: PREWEDDING_VIDEO_TOOL,
      },
      { t: "MR 제공 및 MR / AR 편집 지원", d: "요청 시 전문가가 직접 편집", w: "포함" },
    ],
  },
  {
    icon: Mic2,
    label: "SCRIPT & DOCS",
    title: "대본 · 진행 자료",
    color: "#a8814f",
    items: [
      { t: "두 사람만의 스토리를 담은 감성 맞춤 대본 제작", d: "상담 내용을 대표가 직접 반영", w: "5만원 상당" },
      { t: "지정 사회자와 사전 통화 & 식순 협의", d: "예식 전 사회자와 직접 소통", w: "3만원 상당" },
      { t: "식순 멘트지 · 식순 체크지 · 사전 질문지", d: "예식 흐름을 한눈에 정리", w: "2만원 상당" },
      { t: "혼인서약서 8종 · 성혼선언문 8종 · 덕담 6종", d: "총 22종 샘플, 구글드라이브 공유 폴더로 전달", w: "포함" },
      { t: "각종 양식 템플릿 구글드라이브 공유", d: "각종 결혼식 양식과 BGM을 자유롭게 다운로드", w: "포함" },
      { t: "본식 · 피로연 이벤트 아이디어 정리 파일 제공", d: "다양한 이벤트 구성 예시를 한 번에 확인", w: "포함" },
    ],
  },
  {
    icon: Music4,
    label: "MUSIC",
    title: "음악",
    color: "#c09a7e",
    items: [
      { t: "편집된 트렌드 BGM 제공", d: "지속적인 업데이트로 최신 곡까지 반영", w: "포함" },
      { t: "예식 분위기에 맞는 식순별 BGM 100여 곡", d: "식순별로 정리된 큐레이션 제공", w: "3만원 상당" },
      { t: "요청 시 맞춤형 BGM 편집 지원", d: "곡 길이 · 진입 타이밍까지 조정", w: "2만원 상당" },
    ],
  },
  {
    icon: Headset,
    label: "CARE & PROOF",
    title: "케어 · 증빙",
    color: "#a8814f",
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
    ],
  },
];

// (안심 보장 · 대기 문구는 data/assurance.ts 단일 소스 — 가격 섹션 '이 가격에 담긴 약속'에서 안내)
// 상단에 먼저 보여주는 대표 혜택 4가지 (금액이 명시된 항목)
const HIGHLIGHT_TITLES = [
  "두 사람만의 스토리를 담은 감성 맞춤 대본 제작",
  "지정 사회자와 사전 통화 & 식순 협의",
  "모바일 청첩장 제작",
  "프리미엄 식전영상 제작 지원",
];
// 대본·사전 통화 카드의 시각 패널 (실제 대본 발췌 · 이름 비공개 / 사회자 프로필)
const SCRIPT_TITLE = "두 사람만의 스토리를 담은 감성 맞춤 대본 제작";
const CALL_TITLE = "지정 사회자와 사전 통화 & 식순 협의";
const SCRIPT_EXCERPT = [
  "인생이라는 긴 여정 위에서 수많은 계절을 지나,",
  "마침내 평생을 함께 걸어갈 단 한 사람을 만났습니다.",
  "단아하고 차분한 모습 속에 단단한 마음을 품은\u00a0사람\u00a0—",
  "그리고 신랑의 눈에는, 세상에서 가장 예쁜 웃음과 사랑스러운 애교로 언제나 자신보다 상대를 먼저 생각해 주는 깊은 배려심을 가진 사람입니다.",
];
const CALL_PHOTOS = [
  "/images/mc-jaesun-headroom.jpg",
  "/images/mc-minsu-headroom.jpg",
  "/images/mc-myeongjun-headroom.jpg",
  "/images/mc-yuna-headroom.jpg",
];
// 실제 서비스 화면 썸네일 (라이브 도구 캡처)
const HIGHLIGHT_THUMBS: Record<string, { src: string; alt: string }> = {
  "모바일 청첩장 제작": { src: "/images/ev-card.webp", alt: "이너스 모바일 청첩장 실제 제작 화면" },
  "프리미엄 식전영상 제작 지원": { src: "/images/ev-vid.webp", alt: "이너스 식전영상 편집기 실제 화면" },
};
const ALL_ITEMS = BENEFIT_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g })));
const HIGHLIGHTS = HIGHLIGHT_TITLES.map((t) => ALL_ITEMS.find((it) => it.t === t)!).filter(Boolean);
const REST_GROUPS = BENEFIT_GROUPS.map((g) => ({
  ...g,
  items: g.items.filter((it) => !HIGHLIGHT_TITLES.includes(it.t)),
})).filter((g) => g.items.length > 0);
const REST_COUNT = REST_GROUPS.reduce((n, g) => n + g.items.length, 0);

// 추가 혜택 표
const EXTRA_ROWS: { label: string; value: string; note?: string }[] = [
  { label: "상담 후기 작성 (네이버 · 숨고)", value: "2만원" },
  {
    label: "SNS에 이너스뮤직 선택 이유 남기기",
    value: "1~3만원",
    note: "결제 금액 10만원대 1만원 · 20만원대 2만원 · 30만원 이상 3만원 / 블로그 · 카페 · 인스타",
  },
  { label: "지인 코드번호 사용", value: "1만원" },
  { label: "지난달 VOV 선정 사회자 지정", value: "1만원" },
];

export default function EventSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();
  const anim4 = useScrollAnimation();
  const focusRef = useReadingFocus<HTMLDivElement>();
  const totalCount = useCountUp(ALL_ITEMS.length, anim4.isVisible);
  const totalWon = useCountUp(27, anim4.isVisible);
  const [showDesc, setShowDesc] = useState(false);

  return (
    <section id="event" className="relative bg-[#f8f6f3] pb-20 sm:pb-28">
      <div ref={focusRef} className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* 가격표에 이어지는 혜택 — 구분선 */}
        <div className="mx-auto mb-10 sm:mb-12 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[#d4b896]/60" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#d4b896]" />
          <span className="h-px w-16 bg-[#d4b896]/60" />
        </div>

        {/* 1. 예약 혜택 요약 카드 */}
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""} mx-auto max-w-2xl`}>
          <div
            className="px-5 py-7 sm:px-9 sm:py-9 rounded-xl text-center"
            style={{
              background: "linear-gradient(160deg,#181512,#0f0f0f)",
              border: "1px solid rgba(212,184,150,0.55)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <span
              className="text-[#d4b896] text-[11px] sm:text-[12px] tracking-[0.28em]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              WITH YOUR RESERVATION
            </span>
            <p
              className="mt-3 text-white text-[19px] sm:text-[25px] leading-snug break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              사회자 예약과 함께{" "}
              <span className="text-[#e0c188] whitespace-nowrap">27만원 상당</span>의 구성이
              <br className="hidden sm:block" />{" "}
              <span className="whitespace-nowrap">함께 준비됩니다</span>
            </p>
            <p className="mt-3 text-white/45 text-[11px] sm:text-xs break-keep">
              항목별 상당 금액의 합 · 총 {ALL_ITEMS.length}가지
            </p>
          </div>
        </div>

        {/* 2. 대표 혜택 4가지 */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""} mt-4 sm:mt-5`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {HIGHLIGHTS.map((it) => (
              <div
                key={it.t}
                data-rf="card"
                className="rf-card flex flex-col rounded-xl p-5 bg-white"
              >
                {it.t === SCRIPT_TITLE && (
                  <div className="relative -mx-1 mb-4 flex-1 overflow-hidden rounded-lg bg-[#16130e] px-4 py-4 sm:px-5 sm:py-5">
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-white/10 px-2 py-[3px] text-[10px] font-semibold tracking-wide text-white/80">
                      실제 대본 발췌
                    </span>
                    <p className="text-[10.5px] font-semibold tracking-[0.18em] text-[#e0c188]/80">
                      신부 입장
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-white/35">♪ 음원 재생 · 0~45초 사이 낭독</p>
                    <div
                      className="mt-3 space-y-1 text-[13px] sm:text-[13.5px] font-semibold leading-[1.75] text-[#e8cd9b] break-keep"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {SCRIPT_EXCERPT.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    <p className="mt-3 text-[12px] sm:text-[12.5px] leading-[1.7] text-white/60 break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                      신부 ○○○ 양의 입장을 따뜻한 박수로 맞이해 주시기 바랍니다!
                    </p>
                    <p className="mt-3 border-t border-white/10 pt-2.5 text-[10.5px] text-white/35">
                      실제 제작 대본 · 신랑신부 이름 비공개 처리
                    </p>
                  </div>
                )}
                {it.t === CALL_TITLE && (
                  <div className="relative -mx-1 mb-4 flex-1 overflow-hidden rounded-lg bg-[#f4efe8] p-3 sm:p-4">
                    <span className="absolute left-5 top-5 z-10 rounded-full bg-black/60 px-2 py-[3px] text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
                      사회자 프로필
                    </span>
                    <div className="grid h-full min-h-[190px] grid-cols-4 gap-2">
                      {CALL_PHOTOS.map((src) => (
                        <div key={src} className="relative overflow-hidden rounded-md bg-white">
                          <img src={src} alt="이너스 소속 사회자 프로필" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {HIGHLIGHT_THUMBS[it.t] && (
                  <div className="relative -mx-1 mb-4 overflow-hidden rounded-lg bg-[#f4efe8]" style={{ aspectRatio: "2.4 / 1" }}>
                    <img
                      src={HIGHLIGHT_THUMBS[it.t].src}
                      alt={HIGHLIGHT_THUMBS[it.t].alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-[3px] text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
                      실제 화면
                    </span>
                  </div>
                )}
                <span
                  className="rf-w block text-[#a8814f] text-[12px] sm:text-[13px] font-bold tracking-wide"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {it.w}
                </span>
                <p
                  className="rf-t mt-1.5 text-[#1a1a1a] text-[15px] sm:text-[16px] font-bold break-keep leading-snug"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {it.t}
                </p>
                <p className="mt-1.5 text-[#777] text-[12px] sm:text-[13px] break-keep leading-relaxed">{it.d}</p>
                {"href" in it && it.href && (
                  <a
                    href={it.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 mt-2 text-[12px] font-bold text-[#2f8b78] hover:text-[#23705f] transition-colors"
                  >
                    미리 사용해보기
                    <ExternalLink size={11} className="transition-transform duration-300 group-hover:translate-x-[2px]" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* 나머지 구성 — 접지 않고 항상 노출. 제목만 압축해서 보여주고 설명은 토글 */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3">
            <span className="h-px w-8 sm:w-14 bg-[#d4b896]/60" />
            <p className="text-[#1a1a1a] text-[15px] sm:text-[17px] font-bold break-keep text-center" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              그 밖에 함께 준비되는 <span className="text-[#a8814f]">{REST_COUNT}가지</span>
            </p>
            <span className="h-px w-8 sm:w-14 bg-[#d4b896]/60" />
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {REST_GROUPS.map((g) => (
              <div key={g.title} className="rounded-xl p-5 bg-white" style={{ border: "1px solid #ececec" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${g.color}1f` }}>
                    <g.icon size={16} style={{ color: g.color }} />
                  </div>
                  <h3 className="text-[#1a1a1a] text-[15px] font-bold break-keep flex-1" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    {g.title}
                  </h3>
                  <span className="text-[#aaa] text-[11px] font-semibold">{g.items.length}가지</span>
                </div>
                <div className={showDesc ? "space-y-2.5" : "space-y-1.5"}>
                  {g.items.map((it) => (
                    <div key={it.t} data-rf="row" className="rf-row flex items-start gap-2">
                      <Check size={14} className="rf-chk text-[#c09a7e] flex-shrink-0 mt-[3px]" />
                      <div className="min-w-0 flex-1">
                        <p className="rf-t text-[#2a2a2a] text-[13px] font-semibold break-keep leading-[1.5]">
                          {it.t}
                          {it.w !== "포함" && <span className="ml-1.5 text-[#a8814f] text-[11px] font-bold whitespace-nowrap">{it.w}</span>}
                        </p>
                        {showDesc && <p className="text-[#888] text-[11.5px] mt-0.5 leading-relaxed break-keep">{it.d}</p>}
                        {"href" in it && it.href && (
                          <a
                            href={it.href as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-[11.5px] font-bold text-[#2f8b78] hover:text-[#23705f]"
                          >
                            미리 사용해보기 <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowDesc((v) => !v)}
              aria-expanded={showDesc}
              className="inline-flex items-center gap-1 px-4 py-2 text-[12.5px] font-semibold text-[#7a5a2e] hover:text-[#5a3f1c] transition-colors"
            >
              {showDesc ? "항목 설명 접기" : "항목별 설명 보기"}
              <ChevronDown size={14} className={`transition-transform duration-300 ${showDesc ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* 합계 — 훑어본 구성의 총량을 한 번 더 정리 (스크롤로 들어올 때 숫자가 한 번만 올라감) */}
        <div ref={anim4.ref} className={`fade-up ${anim4.isVisible ? "visible" : ""} mt-14 sm:mt-20`}>
          <div className="mx-auto flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#d4b896]/60" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#d4b896]" />
            <span className="h-px w-12 bg-[#d4b896]/60" />
          </div>
          <p
            className="mt-6 text-center text-[#7a5a2e] text-[11px] sm:text-[12px] tracking-[0.28em]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            IN TOTAL
          </p>
          <div className="mt-5 mx-auto max-w-md grid grid-cols-2">
            {[
              { n: totalCount, final: ALL_ITEMS.length, unit: "가지", cap: "함께 준비되는 구성" },
              { n: totalWon, final: 27, unit: "만원", cap: "상당" },
            ].map((c, i) => (
              <div key={c.unit} className={`text-center px-3 ${i === 1 ? "border-l border-[#d4b896]/50" : ""}`}>
                <p className="flex items-baseline justify-center gap-1 leading-none">
                  <span
                    className="relative inline-block text-[#a8814f] text-[48px] sm:text-[60px]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontVariantNumeric: "lining-nums tabular-nums" }}
                  >
                    <span className="invisible">{c.final}</span>
                    <span className="absolute inset-0 text-center">{c.n}</span>
                  </span>
                  <span className="text-[#1a1a1a] text-[15px] sm:text-[17px] font-bold" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    {c.unit}
                  </span>
                </p>
                <p className="mt-3 text-[#888] text-[11.5px] sm:text-[12.5px] break-keep">{c.cap}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-center text-[#777] text-[12.5px] sm:text-[13.5px] leading-relaxed break-keep">
            청첩장 · 대본 · 음악 · 케어 · 책임 진행까지,
            <br className="sm:hidden" /> 사회자 예약과 함께 모두 준비됩니다
          </p>
        </div>

        {/* 3. 추가 혜택 표 */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""} mt-12 sm:mt-16`}>
          <div className="text-center mb-5">
            <h3 className="text-[#1a1a1a] text-[18px] sm:text-[22px] break-keep" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
              추가 <span className="text-[#a8814f]">혜택</span>
            </h3>
            <p className="mt-2 text-[#777] text-[12px] sm:text-[13px] break-keep">조건에 해당하면 중복 적용됩니다</p>
          </div>

          <div className="mx-auto max-w-2xl rounded-xl overflow-hidden bg-white" style={{ border: "1px solid rgba(212,184,150,0.5)" }}>
            {EXTRA_ROWS.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4"
                style={{ borderBottom: "1px solid #f0ece7" }}
              >
                <span className="min-w-0 text-[#2a2a2a] text-[13.5px] sm:text-[15px] break-keep">
                  {r.label}
                  {r.note && <span className="block text-[#999] text-[11px] sm:text-[12px] mt-0.5 leading-snug">{r.note}</span>}
                </span>
                <span className="text-[#a8814f] text-[15px] sm:text-[17px] font-bold whitespace-nowrap flex-shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  -{r.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4" style={{ borderBottom: "1px solid #f0ece7" }}>
              <span className="text-[#2a2a2a] text-[13.5px] sm:text-[15px] break-keep">후기 작성 시 네이버 포인트 지급</span>
              <span className="text-[#a8814f] text-[14px] sm:text-[16px] font-bold whitespace-nowrap flex-shrink-0 text-right leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span className="block text-[10.5px] sm:text-[11px] font-semibold text-[#a8814f]/80" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>적립금</span>2,000~15,000원
              </span>
            </div>
            <div className="px-4 sm:px-6 py-4" style={{ background: "#181512" }}>
              <p className="text-white/85 text-[12.5px] sm:text-[13.5px] break-keep leading-relaxed">
                모든 혜택은 중복 적용됩니다
              </p>
              <p className="mt-1 text-white/45 text-[11px] sm:text-[12px] break-keep leading-relaxed">
                SNS 혜택은 잔금에서 차감 · 글 링크는 카톡 또는 블로그 댓글로 전달 · 시그니처 등급은 VOV 제외
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-[#999] text-[11px] sm:text-xs break-keep leading-relaxed">
            지인을 소개해 주신 분께는 감사금 1만원을 드리며 잔금에서 차감됩니다
          </p>
        </div>

        <QuoteCalculator />
      </div>
    </section>
  );
}
