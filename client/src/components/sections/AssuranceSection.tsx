/**
 * AssuranceSection - 이너스 안심 보장 3종
 * 히어로 바로 아래 배치 — 예약 전 신뢰 증거를 최상단에서 먼저 제시
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, Mic2, MapPin } from "lucide-react";

const GUARANTEES = [
  { icon: ShieldCheck, t: "계약금 100% 환불", d: "예식 전주까지 취소 시\n위약금 없이 전액 반환" },
  { icon: Mic2, t: "사회자 17인 전원 공개", d: "목소리 · 진행 영상까지\n예약 전에 직접 확인" },
  { icon: MapPin, t: "주말 예약현황 공개", d: "서울 · 경기 · 인천 진행\n(지역에 따라 출장비 별도)" },
];

export default function AssuranceSection() {
  const anim = useScrollAnimation();

  return (
    <section id="assurance" className="bg-[#0d0d0d] pt-10 sm:pt-14 pb-2 sm:pb-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={anim.ref} className={`fade-up ${anim.isVisible ? "visible" : ""}`}>
          <div
            className="relative overflow-hidden rounded-xl p-6 sm:p-8"
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

              <h2
                className="text-white text-[19px] min-[375px]:text-[21px] sm:text-[26px] leading-snug break-keep mb-5"
                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
              >
                <span className="whitespace-nowrap">예식 전주까지 취소하시면</span>{" "}
                <span className="text-[#d4b896] whitespace-nowrap">계약금 100% 환불</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GUARANTEES.map((b) => (
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
        </div>
      </div>
    </section>
  );
}
