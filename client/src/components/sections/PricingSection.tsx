/**
 * PricingSection - 사회자 가격표 + Included Service
 * Design: Light background, two-column pricing cards + service icons grid
 * 지정 배정 vs 랜덤 배정 + 포함 서비스 안내
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Diamond,
  Check,
  Shuffle,
  UserCheck,
  Mic,
  ClipboardList,
  BookOpen,
  Heart,
  MessageSquareHeart,
  Music,
  Headphones,
  MapPin,
  ShieldCheck,
  FileText,
  Clock,
  Users,
  Award,
  Video,
  MessageCircle,
  CalendarCheck,
  Star,
  BarChart3,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

const serviceGroups = [
  {
    category: "진행 자료",
    categoryIcon: FileText,
    items: [
      { icon: Mic, label: "식순 멘트지", sub: "제공" },
      { icon: ClipboardList, label: "식순 체크지 & 사전 질문지", sub: "제공" },
    ],
  },
  {
    category: "서약 · 선언",
    categoryIcon: Heart,
    items: [
      { icon: BookOpen, label: "혼인서약서 샘플", sub: "8종" },
      { icon: BookOpen, label: "성혼선언문 샘플", sub: "8종" },
      { icon: MessageSquareHeart, label: "덕담 샘플", sub: "6종" },
    ],
  },
  {
    category: "BGM",
    categoryIcon: Music,
    items: [
      { icon: Music, label: "BGM 약 100곡", sub: "상황별 맞춤" },
      { icon: Headphones, label: "맞춤형 BGM 편집", sub: "요청 시 지원" },
    ],
  },
];

export default function PricingSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();
  const anim4 = useScrollAnimation();
  const anim5 = useScrollAnimation();

  return (
    <section id="pricing" className="bg-[#f8f6f3] py-24 sm:py-32 lg:py-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 sm:mb-20 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            WEDDING MC PRICING
          </span>
          <h2
            className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            사회자 <span className="text-[#5BB5A2]">가격 안내</span>
          </h2>
        </div>

        {/* Pricing Cards */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* 지정 배정 */}
            <div className="relative bg-white border-2 border-[#d4b896]/40 rounded-sm overflow-hidden">
              {/* Badge */}
              <div className="bg-[#1a1a1a] py-4 px-6 flex items-center justify-center gap-3">
                <UserCheck size={20} className="text-[#d4b896]" />
                <span
                  className="text-white text-lg sm:text-xl tracking-wider"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  사회자 지정 배정
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Price Range */}
                <div className="text-center mb-8">
                  <p className="text-[#1a1a1a] text-2xl sm:text-3xl font-bold">
                    160,000<span className="text-base font-normal text-[#666]">원</span>
                    <span className="text-[#999] mx-2">~</span>
                    220,000<span className="text-base font-normal text-[#666]">원</span>
                  </p>
                </div>

                {/* Tier List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-[#f0ece7]">
                    <div className="flex items-center gap-2">
                      <Diamond size={14} className="text-[#d4b896]" />
                      <span className="text-[#333] text-base font-semibold">일반 등급</span>
                    </div>
                    <span className="text-[#1a1a1a] font-semibold">160,000원</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#f0ece7]">
                    <div className="flex items-center gap-2">
                      <Diamond size={14} className="text-[#d4b896]" />
                      <span className="text-[#333] text-base font-semibold">베스트 등급</span>
                    </div>
                    <span className="text-[#1a1a1a] font-semibold">180,000원</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#f0ece7]">
                    <div className="flex items-center gap-2">
                      <Diamond size={14} className="text-[#d4b896]" />
                      <span className="text-[#333] text-base font-semibold">프리미엄 등급</span>
                    </div>
                    <span className="text-[#1a1a1a] font-semibold">220,000원</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">원하는 사회자 직접 선택</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">진행 스타일 & 영상 사전 확인</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">예식에 최적화된 맞춤형 설계</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 랜덤 배정 */}
            <div className="relative bg-white border border-[#e8e4df] rounded-sm overflow-hidden">
              {/* Badge */}
              <div className="bg-[#5BB5A2] py-4 px-6 flex items-center justify-center gap-3">
                <Shuffle size={20} className="text-white" />
                <span
                  className="text-white text-lg sm:text-xl tracking-wider"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  사회자 랜덤 배정
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Price */}
                <div className="text-center mb-8">
                  <p className="text-[#1a1a1a] text-3xl sm:text-4xl font-bold">
                    140,000<span className="text-base font-normal text-[#666]">원</span>
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">3가지 등급의 사회자 중 1인 자동 배정</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">예식 전주 금요일 배정</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#5BB5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">안정적인 진행</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#d4b896] flex-shrink-0 mt-0.5" />
                    <span className="text-[#888] text-xs italic">사전 질문지 및 맞춤형 대본제작은 지정 사회자 선택시 제공</span>
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <p className="text-center text-[#999] text-xs mt-8">
            ※ 모든 가격은 부가세 포함 금액입니다. 자세한 내용은 카카오톡 상담을 통해 확인해주세요.
          </p>
        </div>

        {/* Included Service */}
        <div ref={anim3.ref} className={`mt-20 sm:mt-28 fade-up ${anim3.isVisible ? "visible" : ""}`}>
          {/* Divider */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-12 bg-[#d4b896]/40" />
            <span className="mx-4 text-[#d4b896] text-lg">+</span>
            <div className="h-px w-12 bg-[#d4b896]/40" />
          </div>

          {/* Title */}
          <div className="text-center mb-12 sm:mb-16">
            <Diamond size={28} className="text-[#d4b896] mx-auto mb-4" />
            <h3
              className="text-[#1a1a1a] text-xl sm:text-2xl md:text-3xl tracking-wider"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              [ Included Service ]
            </h3>
          </div>

          {/* Service Groups - 3 Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {serviceGroups.map((group, gi) => {
              const CatIcon = group.categoryIcon;
              return (
                <div
                  key={gi}
                  className="bg-white border border-[#e8e4df] rounded-sm p-6 hover:border-[#d4b896]/50 hover:shadow-md transition-all duration-400"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#f0ece7]">
                    <div className="w-9 h-9 rounded-full bg-[#d4b896]/10 flex items-center justify-center flex-shrink-0">
                      <CatIcon size={16} className="text-[#d4b896]" />
                    </div>
                    <span
                      className="text-[#1a1a1a] text-base font-semibold"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {group.category}
                    </span>
                  </div>
                  {/* Items */}
                  <div className="space-y-3">
                    {group.items.map((item, ii) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={ii} className="flex items-center gap-3 group/item">
                          <div className="w-8 h-8 rounded-full bg-[#faf8f5] border border-[#d4b896]/20 flex items-center justify-center flex-shrink-0 group-hover/item:border-[#d4b896]/50 transition-colors duration-300">
                            <ItemIcon size={14} className="text-[#d4b896]" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#333] text-sm font-medium leading-snug">{item.label}</p>
                            <p className="text-[#999] text-xs">{item.sub}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div className="mt-12 sm:mt-14 space-y-3 max-w-3xl mx-auto">
            <p className="text-center text-[#777] text-xs sm:text-sm break-keep">
              ※ 랜덤 배정 / 지정 배정 모두 명시된 사항을 제외한 모든 혜택은 동일하게 제공됩니다.
            </p>
            <div className="flex items-center justify-center gap-2 text-[#999] text-xs">
              <MapPin size={14} className="text-[#999] flex-shrink-0" />
              <span>*서울 외 지역 출장비 별도</span>
            </div>
          </div>
        </div>

        {/* 예식 당일 안심 시스템 */}
        <div ref={anim4.ref} className={`mt-20 sm:mt-28 fade-up ${anim4.isVisible ? "visible" : ""}`}>
          {/* Divider */}
          <div className="flex items-center justify-center mb-10">
            <div className="h-px w-16 bg-[#d4b896]/40" />
            <ShieldCheck size={24} className="mx-4 text-[#5BB5A2]" />
            <div className="h-px w-16 bg-[#d4b896]/40" />
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h3
              className="text-[#1a1a1a] text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              예식 당일, <span className="text-[#5BB5A2]">가장 걱정되는 부분</span>
            </h3>
          </div>
          <p className="text-center text-[#777] text-sm sm:text-base mb-3 break-keep">
            혹시 모를 변수나
          </p>
          <p className="text-center text-[#777] text-sm sm:text-base mb-10 break-keep">
            당일 진행에 대한 불안감
          </p>

          {/* Dots separator */}
          <div className="flex items-center justify-center gap-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4b896]"></span>
          </div>

          {/* Sub heading */}
          <div className="text-center mb-12 sm:mb-14">
            <h4
              className="text-[#1a1a1a] text-lg sm:text-xl md:text-2xl break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              이너스뮤직은 <span className="text-[#5BB5A2] underline underline-offset-4 decoration-[#5BB5A2]/40 decoration-2">시스템</span>으로 대비합니다.
            </h4>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto mb-10">
            {/* Card 1 */}
            <div className="bg-white border border-[#e8e4df] rounded-sm p-6 sm:p-8 text-center hover:shadow-lg hover:border-[#5BB5A2]/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-full border-2 border-[#d4b896]/30 flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-[#d4b896]" strokeWidth={1.5} />
              </div>
              <div className="w-6 h-6 rounded-full bg-[#5BB5A2] flex items-center justify-center mx-auto mb-4">
                <Check size={14} className="text-white" />
              </div>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                전속 계약 진행으로
              </p>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                No-show 걱정 없음
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#e8e4df] rounded-sm p-6 sm:p-8 text-center hover:shadow-lg hover:border-[#5BB5A2]/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-full border-2 border-[#d4b896]/30 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-[#d4b896]" strokeWidth={1.5} />
              </div>
              <div className="w-6 h-6 rounded-full bg-[#5BB5A2] flex items-center justify-center mx-auto mb-4">
                <Check size={14} className="text-white" />
              </div>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                예식 2시간 전 / 1시간 전
              </p>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                이중 체크
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#e8e4df] rounded-sm p-6 sm:p-8 text-center hover:shadow-lg hover:border-[#5BB5A2]/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-full border-2 border-[#d4b896]/30 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-[#d4b896]" strokeWidth={1.5} />
              </div>
              <div className="w-6 h-6 rounded-full bg-[#5BB5A2] flex items-center justify-center mx-auto mb-4">
                <Check size={14} className="text-white" />
              </div>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                예비 인력 시스템
              </p>
              <p className="text-[#1a1a1a] text-base sm:text-lg font-semibold leading-relaxed break-keep">
                상시 대기
              </p>
            </div>
          </div>

          {/* Bottom conclusion */}
          <div className="max-w-lg mx-auto bg-white border border-[#d4b896]/30 rounded-sm p-6 sm:p-8 text-center">
            <Award size={20} className="text-[#d4b896] mx-auto mb-3" />
            <p className="text-[#555] text-sm leading-relaxed break-keep">
              마지막까지 안정적으로
            </p>
            <p className="text-[#1a1a1a] text-base sm:text-lg font-bold leading-relaxed break-keep" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              <span className="text-[#5BB5A2]">완성되는 예식</span>을
            </p>
            <p className="text-[#555] text-sm leading-relaxed break-keep">
              직접 경험하실 수 있습니다.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div ref={anim5.ref} className={`mt-14 sm:mt-16 fade-up ${anim5.isVisible ? "visible" : ""}`}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-3xl mx-auto">
              {/* 실제 영상 확인 */}
              <a
                href="https://blog.naver.com/PostList.nhn?blogId=inusmusics&from=postList&categoryNo=36"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#e8e4df] rounded-sm p-4 sm:p-6 text-center hover:border-[#5BB5A2]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5BB5A2] transition-colors duration-300">
                  <Video size={22} className="text-[#d4b896] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-[#1a1a1a] text-sm sm:text-base font-semibold break-keep">실제 <span className="font-bold">영상</span> 확인</p>
                <ChevronRight size={14} className="text-[#bbb] mx-auto mt-1 group-hover:text-[#5BB5A2] transition-colors" />
              </a>

              {/* 카톡 상담하기 */}
              <a
                href="https://pf.kakao.com/_wxovaM/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#e8e4df] rounded-sm p-4 sm:p-6 text-center hover:border-[#5BB5A2]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5BB5A2] transition-colors duration-300">
                  <MessageCircle size={22} className="text-[#d4b896] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-[#1a1a1a] text-sm sm:text-base font-semibold break-keep">카톡 <span className="font-bold">상담</span>하기</p>
                <ChevronRight size={14} className="text-[#bbb] mx-auto mt-1 group-hover:text-[#5BB5A2] transition-colors" />
              </a>

              {/* 이너스 예약하기 */}
              <a
                href="https://blog.naver.com/inusmusics/223023961320"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#e8e4df] rounded-sm p-4 sm:p-6 text-center hover:border-[#5BB5A2]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5BB5A2] transition-colors duration-300">
                  <CalendarCheck size={22} className="text-[#d4b896] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-[#1a1a1a] text-sm sm:text-base font-semibold break-keep">이너스 <span className="font-bold">예약</span>하기</p>
                <ChevronRight size={14} className="text-[#bbb] mx-auto mt-1 group-hover:text-[#5BB5A2] transition-colors" />
              </a>

              {/* 실제 후기 보기 */}
              <a
                href="https://blog.naver.com/inusmusics/223023835728"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#e8e4df] rounded-sm p-4 sm:p-6 text-center hover:border-[#5BB5A2]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5BB5A2] transition-colors duration-300">
                  <Star size={22} className="text-[#d4b896] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-[#1a1a1a] text-sm sm:text-base font-semibold break-keep">실제 <span className="font-bold">후기</span> 보기</p>
                <ChevronRight size={14} className="text-[#bbb] mx-auto mt-1 group-hover:text-[#5BB5A2] transition-colors" />
              </a>

              {/* 이너스 진행이력 */}
              <a
                href="https://blog.naver.com/inusmusics/221231802647"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#e8e4df] rounded-sm p-4 sm:p-6 text-center hover:border-[#5BB5A2]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5BB5A2] transition-colors duration-300">
                  <BarChart3 size={22} className="text-[#d4b896] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-[#1a1a1a] text-sm sm:text-base font-semibold break-keep">이너스 <span className="font-bold">진행</span>이력</p>
                <ChevronRight size={14} className="text-[#bbb] mx-auto mt-1 group-hover:text-[#5BB5A2] transition-colors" />
              </a>

              {/* 이너스 예약현황 */}
              <a
                href="http://inusmusics.dothome.co.kr/xe/board_nOmW18/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#e8e4df] rounded-sm p-4 sm:p-6 text-center hover:border-[#5BB5A2]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5BB5A2] transition-colors duration-300">
                  <CalendarDays size={22} className="text-[#d4b896] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <p className="text-[#1a1a1a] text-sm sm:text-base font-semibold break-keep">이너스 <span className="font-bold">예약</span>현황</p>
                <ChevronRight size={14} className="text-[#bbb] mx-auto mt-1 group-hover:text-[#5BB5A2] transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
