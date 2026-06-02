import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Gift, Pencil } from "lucide-react";

export default function EventSection() {
  const anim1 = useScrollAnimation();

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div ref={anim1.ref} className={`fade-up ${anim1.isVisible ? "visible" : ""}`}>
          {/* Header */}
          <div className="text-center mb-14">
            <span
              className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SPECIAL EVENT
            </span>
            <h2
              className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              이너스뮤직 <span className="text-[#5BB5A2]">특별 이벤트</span>
            </h2>
            <p className="mt-4 text-[#666] text-sm sm:text-base">
              예식을 준비하시는 고객님들께 실질적으로 도움이 되는 혜택을 함께 제공합니다
            </p>
          </div>

          {/* Event Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Event 1 */}
            <div className="bg-[#faf9f7] border border-[#eee] rounded-sm p-6 sm:p-8 hover:border-[#5BB5A2]/30 transition-all duration-400">
              <div className="w-12 h-12 rounded-full bg-[#5BB5A2]/10 flex items-center justify-center mb-5">
                <Gift size={20} className="text-[#5BB5A2]" />
              </div>
              <h3 className="text-[#1a1a1a] text-base sm:text-lg font-semibold mb-3">
                숨고 리뷰 이벤트 참여 혜택
              </h3>
              <ul className="space-y-2 text-[#555] text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#5BB5A2] mt-1">&#8226;</span>
                  최대 2만원 할인 혜택
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5BB5A2] mt-1">&#8226;</span>
                  결혼 준비에 꼭 필요한 웨딩 체크리스트 자료 제공
                </li>
                <li className="text-[#999] text-xs mt-2">
                  (실제 예식 준비에 활용 가능한 자료입니다)
                </li>
              </ul>
            </div>

            {/* Event 2 */}
            <div className="bg-[#faf9f7] border border-[#eee] rounded-sm p-6 sm:p-8 hover:border-[#d4b896]/30 transition-all duration-400">
              <div className="w-12 h-12 rounded-full bg-[#d4b896]/10 flex items-center justify-center mb-5">
                <Pencil size={20} className="text-[#d4b896]" />
              </div>
              <h3 className="text-[#1a1a1a] text-base sm:text-lg font-semibold mb-3">
                블로그 후기 참여 혜택
              </h3>
              <ul className="space-y-2 text-[#555] text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4b896] mt-1">&#8226;</span>
                  추가 혜택 제공
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4b896] mt-1">&#8226;</span>
                  자세한 내용은 상담 시 안내드립니다
                </li>
              </ul>
              <a
                href="https://blog.naver.com/inusmusics/220652958346"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 text-[#d4b896] text-sm hover:text-[#c09a7e] transition-colors underline underline-offset-4"
              >
                자세히 알아보기 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
