/**
 * EventSection - 이너스뮤직 특별 이벤트 총정리
 * 허브(inusmusic.com) '이벤트 총정리' 내용을 사회자 사이트 기준으로 재구성
 * Design: Light premium (white / #faf9f7) + Gold(#a8814f / #d4b896) · 민트는 버튼·링크에만
 */
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
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

// 혜택 카테고리 (총 19가지 · 27만원 상당)
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
      { t: "만일의 상황 대비, 예비 사회자 상시 대기", d: "돌발 변수까지 이너스가 책임집니다", w: "포함" },
    ],
  },
];

// 안심 보장 제도 (혜택 합계 · 가지 수에는 포함하지 않음)
const ASSURANCE_ITEMS = [
  {
    t: "대체 사회자 배정 + 남은 잔금 10% 할인",
    d: "사회자 개인 사정(질병 · 가족사 등)으로 진행이 어려울 때에도, 이너스뮤직이 대체 사회자를 책임지고 배정하고 남은 잔금을 10% 할인해 드립니다.",
  },
  {
    t: "결제 금액 2배 환불 보장",
    d: "사회자가 예식에 도착하지 못하거나 본식 시작 이후 도착하는 경우, 결제 금액의 2배를 환불해 드립니다.",
  },
];

// 상단에 먼저 보여주는 대표 혜택 4가지 (금액이 명시된 항목)
const HIGHLIGHT_TITLES = [
  "두 사람만의 스토리를 담은 감성 맞춤 대본 제작",
  "지정 사회자와 사전 통화 & 식순 협의",
  "모바일 청첩장 제작",
  "프리미엄 식전영상 제작 지원",
];
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
  const [showRest, setShowRest] = useState(false);

  return (
    <section id="event" className="relative bg-[#f8f6f3] pb-20 sm:pb-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
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
                className="rounded-xl p-5 bg-white"
                style={{ border: "1px solid rgba(212,184,150,0.45)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
              >
                <span
                  className="block text-[#a8814f] text-[12px] sm:text-[13px] font-bold tracking-wide"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {it.w}
                </span>
                <p
                  className="mt-1.5 text-[#1a1a1a] text-[15px] sm:text-[16px] font-bold break-keep leading-snug"
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

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowRest((v) => !v)}
              aria-expanded={showRest}
              className="rest-glow-btn inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-[13.5px] font-bold text-[#7a5a2e] bg-[#fffdf9] hover:bg-[#fbf3e6] transition-colors"
              style={{ border: "1px solid rgba(190,150,95,0.6)" }}
            >
              {showRest ? "나머지 구성 접기" : `나머지 ${REST_COUNT}가지 구성 보기`}
              <ChevronDown size={15} className={`transition-transform duration-300 ${showRest ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showRest && (
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
                  <div className="space-y-2">
                    {g.items.map((it) => (
                      <div key={it.t} className="flex items-start gap-2">
                        <Check size={14} className="text-[#c09a7e] flex-shrink-0 mt-[3px]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[#2a2a2a] text-[13px] font-semibold break-keep leading-[1.5]">
                            {it.t}
                            {it.w !== "포함" && <span className="ml-1.5 text-[#a8814f] text-[11px] font-bold whitespace-nowrap">{it.w}</span>}
                          </p>
                          <p className="text-[#888] text-[11.5px] mt-0.5 leading-relaxed break-keep">{it.d}</p>
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
              {/* 안심 보장 제도 — 혜택 금액(27만원 · 19가지)에는 포함하지 않는 별도 약속 */}
              <div
                className="rounded-xl p-5 sm:p-6"
                style={{
                  background: "linear-gradient(160deg,#181512,#0f0f0f)",
                  border: "1px solid rgba(212,184,150,0.55)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,184,150,0.16)" }}>
                    <ShieldCheck size={16} className="text-[#d4b896]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="block text-[#d4b896] text-[10.5px] tracking-[0.26em]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                    >
                      INUS ASSURANCE
                    </span>
                    <h3 className="text-white text-[15px] font-bold break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                      이너스뮤직 안심 보장 제도
                    </h3>
                  </div>
                </div>
                <p className="text-white/55 text-[11.5px] sm:text-[12px] break-keep leading-relaxed mb-4">
                  예식 당일까지, 이너스뮤직이 책임으로 약속드립니다
                </p>
                <div className="space-y-3.5">
                  {ASSURANCE_ITEMS.map((it) => (
                    <div key={it.t} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#d4b896] flex-shrink-0 mt-[4px]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-[13.5px] font-semibold break-keep leading-[1.5]">{it.t}</p>
                        <p className="text-white/60 text-[12px] mt-1 leading-relaxed break-keep">{it.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
              <span className="text-[#777] text-[12px] sm:text-[13px] whitespace-nowrap">별도</span>
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
