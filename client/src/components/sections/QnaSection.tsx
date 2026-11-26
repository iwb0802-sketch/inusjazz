/**
 * QnaSection - 자주 묻는 질문
 * Q1: 등급의 기준은 무엇인가요?
 * Q2: 당일날 펑크날까봐 걱정돼요...
 * Design: Light background, accordion-style Q&A cards
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Link } from "wouter";
import {
  Star,
  ClipboardCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Handshake,
  ShieldCheck,
  Award,
  ChevronDown,
  FileText,
  Sparkles,
} from "lucide-react";

interface QnaItem {
  question: React.ReactNode;
  content: React.ReactNode;
}

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[#555] text-sm sm:text-base leading-relaxed break-keep">{children}</p>
);
const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-[#1a1a1a]">{children}</strong>
);

const QNA_DATA: QnaItem[] = [
  {
    question: "계약금은 언제까지 환불되나요?",
    content: (
      <div className="space-y-3">
        <P><B>예식 전주까지 계약금 100% 환불</B>됩니다.</P>
        <P>사회자를 확정한 뒤에도 일정이 바뀌면 부담 없이 취소하실 수 있도록 설계했습니다.</P>
      </div>
    ),
  },
  {
    question: "예식 날짜에 가능한 사회자는 어떻게 확인하나요?",
    content: (
      <div className="space-y-3">
        <P>
          <Link href="/schedule" className="text-[#2f8b78] underline underline-offset-2 font-semibold">날짜 조회 페이지</Link>에서
          <B> 예식 날짜만 입력</B>하시면 됩니다. 연락처를 남기지 않아도 해당 날짜에 가능한 사회자가 바로 나옵니다.
        </P>
      </div>
    ),
  },
  {
    question: "할인 혜택은 어떤 것이 있나요?",
    content: (
      <div className="space-y-3">
        <P>아래 혜택은 모두 <B>중복 적용</B>됩니다.</P>
        <ul className="space-y-1.5 text-[#555] text-[14px] leading-relaxed break-keep">
          <li>상담 후기 작성 <B>-2만원</B></li>
          <li>SNS에 이너스뮤직 선택 이유 남기기 <B>-1~3만원</B> (결제 금액 10만원대 1만원 · 20만원대 2만원 · 30만원 이상 3만원)</li>
          <li>지인 코드번호 사용 <B>-1만원</B></li>
          <li>지난달 VOV 선정 사회자 지정 <B>-1만원</B> (시그니처 등급 제외)</li>
        </ul>
        <P>SNS 혜택은 블로그·카페·인스타에 글을 올린 뒤 링크를 카톡으로 전달하거나 블로그 댓글로 남겨 주시면 잔금에서 차감됩니다.</P>
        <P>지인을 소개해 주신 분께는 감사금 <B>1만원</B>을 드리며, 잔금에서 차감됩니다.</P>
      </div>
    ),
  },
  {
    question: "서울 외 지역도 진행하나요?",
    content: (
      <div className="space-y-3">
        <P><B>서울·경기·인천</B> 지역에서만 진행합니다. 경기·인천은 지역에 따라 <B>출장비 1~4만&nbsp;원</B>이 추가됩니다. 지역별 금액은 가격 안내에서 확인하실 수 있습니다. 그 외 지역은 진행이 어렵습니다.</P>
      </div>
    ),
  },
  {
    question: (
      <>
        사회자 지정 시 지정된 사회자가
        <br className="sm:hidden" />{" "}
        바로 대본을 작성하는 게 아닌,
        <br className="hidden sm:block" />{" "}
        <br className="sm:hidden" />{" "}
        왜 본사에서 1차 대본을 작성하나요?
      </>
    ),
    content: (
      <div className="space-y-6">
        <p className="text-[#555] text-sm sm:text-base leading-relaxed break-keep">
          <strong className="text-[#1a1a1a]">
            본사의 노하우와 사회자의 개성을 모두 담아
            <br className="sm:hidden" />{" "}
            최상의 퀄리티를 완성하기 위해서입니다.
          </strong>
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <Users size={18} className="text-[#d4b896]" />
            </div>
            <p className="text-[#555] text-sm leading-relaxed pt-2 break-keep">
              사회자마다 각자 <strong className="text-[#1a1a1a]">고유의 개성과 진행 스타일</strong>이 있습니다
            </p>
          </div>
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <ClipboardCheck size={18} className="text-[#d4b896]" />
            </div>
            <p className="text-[#555] text-sm leading-relaxed pt-2 break-keep">
              지정된 사회자가 처음부터 바로 대본을 작성하면 <strong className="text-[#1a1a1a]">대본의 편차</strong>가 발생할 수 있습니다
            </p>
          </div>
        </div>

        <div className="border-t border-[#e8e4df] pt-5">
          <p className="text-[#999] text-xs tracking-wider uppercase mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            그래서 이너스뮤직은
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8814f]/10 flex items-center justify-center">
                <FileText size={18} className="text-[#a8814f]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2 break-keep">
                <strong className="text-[#1a1a1a]">1차, 본사</strong>에서 대본의 뼈대를 먼저 세우고
              </p>
            </div>
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8814f]/10 flex items-center justify-center">
                <Sparkles size={18} className="text-[#a8814f]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2 break-keep">
                <strong className="text-[#1a1a1a]">2차, 지정된 사회자</strong>가 자신만의 개성과 노하우를 더해 완성합니다
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d4b896]/20 flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#e0c188]" />
            </div>
            <div>
              <p className="text-white text-sm">그 결과,</p>
              <p className="text-white font-semibold break-keep">
                누가 진행하든
                <br className="sm:hidden" />{" "}
                <span className="text-[#e0c188]">이너스뮤직만의 최상의 퀄리티</span>로 완성됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "등급의 기준은 무엇인가요?",
    content: (
      <div className="space-y-6">
        <p className="text-[#555] text-sm sm:text-base leading-relaxed">
          등급은 <strong className="text-[#1a1a1a]">'실력'이 아닌 '경험'</strong>을 기준으로 구분됩니다.
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <Star size={18} className="text-[#d4b896]" />
            </div>
            <p className="text-[#555] text-sm leading-relaxed pt-2">
              모든 사회자는 일정 기준 이상의 실력을 갖춘 전문 사회자로 구성되어 있으며
            </p>
          </div>
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <ClipboardCheck size={18} className="text-[#d4b896]" />
            </div>
            <p className="text-[#555] text-sm leading-relaxed pt-2">
              등급은 예식 진행 경험과 현장 대응 능력에 따라 차별화되어 분류됩니다
            </p>
          </div>
        </div>

        <div className="border-t border-[#e8e4df] pt-5">
          <p className="text-[#999] text-xs tracking-wider uppercase mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            예를 들어
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8814f]/10 flex items-center justify-center">
                <Calendar size={18} className="text-[#a8814f]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2">
                최소 3년 이상의 사회 경험을 보유하고 있으며
              </p>
            </div>
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8814f]/10 flex items-center justify-center">
                <Users size={18} className="text-[#a8814f]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2">
                많게는 10년 이상의 경력을 가진 사회자까지 구성되어 있습니다
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f0ece7] rounded-sm p-5 space-y-3">
          <p className="text-[#555] text-sm leading-relaxed">
            즉, 모든 사회자는 기본 실력을 갖춘 상태에서 <strong className="text-[#1a1a1a]">경험에 따라 등급이 나뉘는 구조</strong>입니다
          </p>
          <p className="text-[#555] text-sm leading-relaxed">
            등급이 높을수록 <strong className="text-[#1a1a1a]">더욱 안정적이고 노련한 진행</strong>이 가능합니다
          </p>
        </div>
      </div>
    ),
  },
  {
    question: "당일날 펑크날까봐 걱정돼요...",
    content: (
      <div className="space-y-6">
        <p className="text-[#555] text-sm sm:text-base leading-relaxed">
          <strong className="text-[#1a1a1a]">걱정하지 않으셔도 됩니다.</strong>
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <Clock size={18} className="text-[#d4b896]" />
            </div>
            <div className="pt-1">
              <p className="text-[#555] text-sm leading-relaxed">
                예식 당일 <strong className="text-[#1a1a1a]">2시간 전</strong>, 사회자 준비 상태 <strong className="text-[#1a1a1a]">1차 체크</strong>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <MapPin size={18} className="text-[#d4b896]" />
            </div>
            <div className="pt-1">
              <p className="text-[#555] text-sm leading-relaxed text-balance">
                예식 <strong className="text-[#1a1a1a]">1시간 전</strong>, 현장 도착 여부 <strong className="text-[#1a1a1a]">2차 확인</strong>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4b896]/15 flex items-center justify-center">
              <Users size={18} className="text-[#d4b896]" />
            </div>
            <div className="pt-1">
              <p className="text-[#555] text-sm leading-relaxed">
                만일의 상황 대비, <strong className="text-[#1a1a1a]">예비 사회자 · 대표 대기</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e8e4df] pt-5">
          <p className="text-[#999] text-xs tracking-wider uppercase mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            또한 모든 사회자는
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8814f]/10 flex items-center justify-center">
                <Handshake size={18} className="text-[#a8814f]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2">
                업체와 <strong className="text-[#1a1a1a]">전속 계약 체결</strong> 후 진행되며
              </p>
            </div>
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8814f]/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#a8814f]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2">
                <strong className="text-[#1a1a1a]">사전 관리 시스템</strong>을 통해 철저히 관리됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 0% Badge */}
        <div className="bg-[#1a1a1a] rounded-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d4b896]/20 flex items-center justify-center">
              <Award size={22} className="text-[#e0c188]" />
            </div>
            <div>
              <p className="text-white text-sm">그 결과,</p>
              <p className="text-white font-semibold">
                지금까지 <span className="text-[#e0c188]">펑크율 0%</span>를 유지하고 있습니다
              </p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-[#e0c188] text-3xl font-bold">0%</span>
            <span className="text-white/40 text-xs mt-1">펑크율</span>
          </div>
        </div>
      </div>
    ),
  },
];

function QnaCard({ item, index }: { item: QnaItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-[#e8e4df] rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <span
            className="flex-shrink-0 w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-sm font-semibold"
          >
            Q
          </span>
          <h3
            className="text-[#1a1a1a] text-base sm:text-lg font-semibold break-keep leading-snug"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {item.question}
          </h3>
        </div>
        <ChevronDown
          size={20}
          className={`text-[#999] flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 sm:px-6 pb-6 pt-0">
          <div className="flex items-start gap-4">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-full bg-[#d4b896] flex items-center justify-center text-white text-sm font-semibold"
            >
              A
            </span>
            <div className="flex-1 pt-1">{item.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QnaSection() {
  const anim1 = useScrollAnimation();

  return (
    <section id="qna" className="bg-[#f8f6f3] pt-16 sm:pt-20 pb-16 sm:pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-10 sm:mb-12 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#a8814f] text-[11px] sm:text-[13px] font-semibold tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Q & A
          </span>
          <h2
            className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            자주 묻는 <span className="text-[#a8814f]">질문</span>
          </h2>
        </div>

        {/* QnA Cards */}
        <div className="space-y-4">
          {QNA_DATA.map((item, i) => (
            <QnaCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
