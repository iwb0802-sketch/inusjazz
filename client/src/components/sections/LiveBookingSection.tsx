/**
 * LiveBookingSection - 실시간 예약금 입금 현황
 * 사회적 증거(Social Proof) 섹션: 실제 예약금 입금 내역을 가로 마퀴로 노출
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle2, ExternalLink } from "lucide-react";

const GOLD = "#d4b896";
const MINT = "#5BB5A2";

interface Deposit {
  name: string;
  date: string;
  amount: string;
}

const DEPOSITS: Deposit[] = [
  { name: "채*현", date: "9월 19일 예식", amount: "169,690원" },
  { name: "최*빈", date: "9월 19일 예식", amount: "150,186원" },
  { name: "권*준", date: "11월 21일 예식", amount: "169,391원" },
  { name: "김*명", date: "10월 31일 예식", amount: "30,000원" },
  { name: "최*수", date: "8월 23일 예식", amount: "20,000원" },
  { name: "석*이", date: "27년 3월 27일 예식", amount: "50,000원" },
  { name: "김*영", date: "10월 25일 예식", amount: "30,000원" },
  { name: "이*연", date: "10월 4일 예식", amount: "50,000원" },
  { name: "이*열", date: "9월 19일 예식", amount: "169,690원" },
  { name: "정*연", date: "8월 9일 예식", amount: "120,000원" },
  { name: "최*빈", date: "27년 5월 22일 예식", amount: "40,000원" },
  { name: "박*인", date: "10월 24일 예식", amount: "20,000원" },
  { name: "이*광", date: "27년 3월 13일 예식", amount: "30,000원" },
  { name: "최*진", date: "27년 3월 27일 예식", amount: "30,000원" },
  { name: "김*채", date: "12월 12일 예식", amount: "207,399원" },
  { name: "박*아", date: "12월 6일 예식", amount: "37,710원" },
  { name: "권*민", date: "10월 17일 예식", amount: "37,710원" },
  { name: "박*두", date: "8월 9일 예식", amount: "70,000원" },
  { name: "임*연", date: "27년 3월 13일 예식", amount: "30,000원" },
  { name: "김*종", date: "8월 15일 예식", amount: "20,000원" },
  { name: "이*림", date: "9월 5일 예식", amount: "60,000원" },
  { name: "이*인", date: "9월 12일 예식", amount: "100,000원" },
  { name: "신*지", date: "12월 27일 예식", amount: "210,000원" },
  { name: "임*소", date: "12월 6일 예식", amount: "200,000원" },
];

const BOOKING_STATUS_URL = "http://inusmusics.dothome.co.kr/xe/board_nOmW18/";

function DepositCard({ d }: { d: Deposit }) {
  return (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg mx-2"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(212,184,150,0.18)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: MINT, boxShadow: `0 0 8px ${MINT}` }}
      />
      <span className="text-white/90 text-sm font-medium">{d.name}</span>
      <span className="text-white/40 text-xs">{d.date}</span>
      <span className="text-sm font-semibold" style={{ color: GOLD }}>
        {d.amount}
      </span>
      <span className="flex items-center gap-1 text-xs" style={{ color: MINT }}>
        <CheckCircle2 size={13} />
        입금완료
      </span>
    </div>
  );
}

export default function LiveBookingSection() {
  const anim1 = useScrollAnimation();
  const row1 = [...DEPOSITS, ...DEPOSITS];
  const row2 = [...DEPOSITS.slice().reverse(), ...DEPOSITS.slice().reverse()];

  return (
    <section className="bg-[#0d0d0d] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={anim1.ref} className={`text-center mb-12 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
          >
            LIVE BOOKING
          </span>
          <h2
            className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            지금도 <span style={{ color: GOLD }}>예약이 이어지고</span> 있습니다
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base">
            실제 예약금 입금 확인 내역입니다
          </p>
        </div>
      </div>

      {/* 마퀴 영역 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10" style={{ background: "linear-gradient(to right, #0d0d0d, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10" style={{ background: "linear-gradient(to left, #0d0d0d, transparent)" }} />

        <div className="flex mb-3" style={{ animation: "liveBookingScrollLeft 240s linear infinite" }}>
          {row1.map((d, i) => (
            <DepositCard key={`r1-${i}`} d={d} />
          ))}
        </div>
        <div className="flex" style={{ animation: "liveBookingScrollRight 240s linear infinite" }}>
          {row2.map((d, i) => (
            <DepositCard key={`r2-${i}`} d={d} />
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col items-center gap-3">
        <a
          href={BOOKING_STATUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
          style={{ background: "rgba(212,184,150,0.1)", border: "1px solid rgba(212,184,150,0.4)", color: GOLD }}
        >
          예약현황 전체보기
          <ExternalLink size={14} />
        </a>
      </div>

      <style>{`
        @keyframes liveBookingScrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes liveBookingScrollRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
