/**
 * QnaSection - 자주 묻는 질문
 * Q1: 등급의 기준은 무엇인가요?
 * Q2: 당일날 펑크날까봐 걱정돼요...
 * Design: Light background, accordion-style Q&A cards
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
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
} from "lucide-react";

interface QnaItem {
  question: string;
  content: React.ReactNode;
}

const QNA_DATA: QnaItem[] = [
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
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center">
                <Calendar size={18} className="text-[#5BB5A2]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2">
                최소 3년 이상의 사회 경험을 보유하고 있으며
              </p>
            </div>
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center">
                <Users size={18} className="text-[#5BB5A2]" />
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
              <p className="text-[#555] text-sm leading-relaxed">
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
                만일의 상황 대비, <strong className="text-[#1a1a1a]">예비 사회자 대기</strong>
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
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center">
                <Handshake size={18} className="text-[#5BB5A2]" />
              </div>
              <p className="text-[#555] text-sm leading-relaxed pt-2">
                업체와 <strong className="text-[#1a1a1a]">전속 계약 체결</strong> 후 진행되며
              </p>
            </div>
            <div className="flex items-start gap-4 bg-[#f8f6f3] rounded-sm p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#5BB5A2]" />
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
            <div className="w-12 h-12 rounded-full bg-[#5BB5A2]/20 flex items-center justify-center">
              <Award size={22} className="text-[#5BB5A2]" />
            </div>
            <div>
              <p className="text-white text-sm">그 결과,</p>
              <p className="text-white font-semibold">
                지금까지 <span className="text-[#5BB5A2]">펑크율 0%</span>를 유지하고 있습니다
              </p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-[#5BB5A2] text-3xl font-bold">0%</span>
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
            className="text-[#1a1a1a] text-base sm:text-lg font-semibold"
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
    <section id="qna" className="bg-[#f8f6f3] py-24 sm:py-32 lg:py-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 sm:mb-20 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Q & A
          </span>
          <h2
            className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            자주 묻는 <span className="text-[#5BB5A2]">질문</span>
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
