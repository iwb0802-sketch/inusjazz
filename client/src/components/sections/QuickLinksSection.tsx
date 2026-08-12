/**
 * QuickLinksSection - 이너스뮤직 바로가기 6종
 * PricingSection에서 분리 (이벤트 섹션 뒤에 배치)
 * Design: Light beige (#f8f6f3) + Mint/Gold accent
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Video,
  MessageCircle,
  CalendarCheck,
  Star,
  BarChart3,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

export default function QuickLinksSection() {
  const anim = useScrollAnimation();

  return (
    <section id="quick-links" className="bg-[#f8f6f3] pt-4 pb-20 sm:pt-6 sm:pb-28 lg:pb-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      {/* Quick Links Grid */}
      <div ref={anim.ref} className={`fade-up ${anim.isVisible ? "visible" : ""}`}>
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
    </section>
  );
}
