/**
 * VideoGuideSection - 실제 본식 사회 영상 안내 (컴팩트)
 * 등급 클릭 → 해당 등급 사회자 명단 모달 → 하단 "영상 보기"로 블로그 이동
 * Design: Premium dark + gold accent
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, Star, Mic, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

const TIERS = [
  {
    name: "시그니처",
    sub: "SIGNATURE",
    icon: Crown,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=146",
    signature: true,
    members: [
      { name: "김민수", image: "/images/mc-profile-1_33531819.jpg" },
      { name: "석재선", image: "/images/mc-profile-3_33ff7a32.jpg" },
      { name: "이우영", image: "/images/mc-lee-wooyoung-new_fa27e84d.webp" },
      { name: "최윤아", image: "/images/mc-yuna.jpg" },
    ],
  },
  {
    name: "프리미엄",
    sub: "PREMIUM",
    icon: Crown,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=59",
    members: [
      { name: "이도영", image: "/images/mc-profile-2_f194877b.jpg" },
      { name: "장윤태", image: "/images/mc-yuntae2.jpg" },
      { name: "고명준", image: "/images/mc-myeongjun.jpg" },
      { name: "민준호", image: "/images/mc-minjunho.jpg" },
    ],
  },
  {
    name: "베스트",
    sub: "BEST",
    icon: Star,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=69",
    members: [
      { name: "고승범", image: "/images/mc-profile-4_a9e52880.jpg" },
      { name: "김선혁", image: "/images/host_sunhyuk_1ed704ab.jpg" },
      { name: "길상우", image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg" },
      { name: "이상운", image: "/images/mc-sangwoon.jpg" },
      { name: "손진욱", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/szGhyZuWuLcNjQKb.webp" },
      { name: "김태우", image: "/images/mc-kimtaewoo.jpg" },
    ],
  },
  {
    name: "스탠다드",
    sub: "STANDARD",
    icon: Mic,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=62",
    members: [
      { name: "심비성", image: "/images/mc-simbiseong.jpg" },
      { name: "이도건", image: "/images/mc-idogeon.jpg" },
      { name: "김범태", image: "/images/mc-kimbeomtae.jpg" },
      { name: "김한솔", image: "/images/mc-kimhansol.jpg" },
    ],
  },
];

type Tier = typeof TIERS[0];

// 등급별 명단 모달
function TierRosterModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const Icon = tier.icon;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.86)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden shadow-2xl rounded-xl"
        style={{
          animation: "fadeInUpTier 0.3s cubic-bezier(0.23,1,0.32,1)",
          maxHeight: "88vh",
          background: "linear-gradient(160deg, #161616 0%, #0b0b0b 100%)",
          border: tier.signature ? "1px solid rgba(201,169,97,0.4)" : "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-white hover:scale-110 transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.7)", border: "1.5px solid rgba(255,255,255,0.3)" }}
        >
          <X size={15} strokeWidth={2.5} />
        </button>

        <div className="overflow-y-auto" style={{ maxHeight: "88vh" }}>
          {/* 헤더 */}
          <div className="px-6 pt-7 pb-5 text-center" style={{ borderBottom: "1px solid rgba(214,177,107,0.15)" }}>
            <div
              className="w-11 h-11 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{
                background: tier.signature ? "rgba(201,169,97,0.12)" : "rgba(214,177,107,0.1)",
                border: tier.signature ? "1px solid rgba(201,169,97,0.5)" : "1px solid rgba(214,177,107,0.35)",
              }}
            >
              <Icon size={18} className={tier.signature ? "text-[#c9a961]" : "text-[#d4b896]"} />
            </div>
            <p
              className="text-[10px] tracking-[0.28em] uppercase mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: tier.signature ? "rgba(201,169,97,0.75)" : "rgba(214,177,107,0.6)" }}
            >
              {tier.sub}
            </p>
            <h3 className="text-white text-xl font-bold" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              {tier.name} 등급 사회자
            </h3>
            <p className="text-white/40 text-xs mt-1.5">아래 {tier.members.length}명이 {tier.name} 등급으로 진행합니다</p>
          </div>

          {/* 명단 그리드 */}
          <div className="px-5 py-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {tier.members.map((m) => (
              <div key={m.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: tier.signature ? "1.5px solid rgba(201,169,97,0.45)" : "1.5px solid rgba(214,177,107,0.3)" }}
                >
                  <img src={m.image} alt={`${m.name} 사회자`} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <span className="text-white/85 text-[12px] sm:text-[13px] font-medium whitespace-nowrap">{m.name}</span>
              </div>
            ))}
          </div>

          {/* 영상 보기 (블로그 이동) */}
          <div className="px-5 pb-5">
            <a
              href={tier.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:opacity-90"
              style={{
                background: tier.signature ? "#c9a961" : "#d4b896",
                color: "#0b0b0b",
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              <Play size={14} className="fill-[#0b0b0b]" />
              <span>등급별 자세한 영상보기</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeInUpTier { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export default function VideoGuideSection() {
  const anim = useScrollAnimation();
  const [activeTier, setActiveTier] = useState<Tier | null>(null);

  return (
    <section id="video-guide" className="relative bg-[#0a0a0a] py-14 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b896]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b896]/30 to-transparent" />
      </div>

      <div
        ref={anim.ref}
        className={`relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${anim.isVisible ? "visible" : ""}`}
      >
        {/* Header */}
        <div className="text-center mb-7 sm:mb-9">
          <span
            className="text-[#d4b896] text-[11px] sm:text-xs tracking-[0.28em] uppercase font-semibold"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            REAL WEDDING FILM
          </span>

          <h2
            className="mt-2.5 text-white text-[19px] min-[375px]:text-[21px] sm:text-[26px] leading-snug break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            <span className="whitespace-nowrap">
              연출 없는 <span className="text-[#5BB5A2]">실제 본식 영상</span>
            </span>{" "}
            <span className="whitespace-nowrap">등급별로 보기</span>
          </h2>
          <p className="mt-2 text-white/40 text-[11.5px] sm:text-xs">등급을 누르면 해당 사회자 명단부터 확인할 수 있어요</p>
        </div>

        {/* Tier Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <button
                key={tier.name}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`group flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center rounded-lg px-4 py-3.5 sm:py-5 transition-all duration-300 active:scale-[0.99] text-left ${
                  tier.signature
                    ? "bg-black border border-[#c9a961]/50 hover:border-[#c9a961]"
                    : "bg-[#141414] border border-[#d4b896]/20 hover:border-[#d4b896]/50"
                }`}
                style={tier.signature ? { boxShadow: "0 0 20px rgba(201,169,97,0.08)" } : undefined}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    tier.signature
                      ? "bg-[#0a0a0a] border border-[#c9a961]/60 group-hover:border-[#c9a961]"
                      : "bg-[#0d0d0d] border border-[#d4b896]/30 group-hover:border-[#d4b896]/60"
                  }`}
                >
                  <Icon size={16} className={tier.signature ? "text-[#c9a961]" : "text-[#d4b896]"} />
                </div>

                <div className="min-w-0 flex-1 sm:flex-none text-left sm:text-center">
                  <p
                    className={`text-[9px] tracking-[0.24em] uppercase ${tier.signature ? "text-[#c9a961]/70" : "text-[#d4b896]/55"}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tier.sub}
                  </p>
                  <h3
                    className="text-white text-[15px] sm:text-lg font-bold"
                    style={{ fontFamily: "'Noto Serif KR', serif" }}
                  >
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-[#5BB5A2] text-xs font-medium flex-shrink-0 sm:mt-1">
                  <Play size={11} className="fill-[#5BB5A2]" />
                  <span className="whitespace-nowrap">명단·영상 보기</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-white/40 text-[12.5px] sm:text-sm leading-relaxed break-keep">
          <span className="whitespace-nowrap">실제 본식에서 확인되는</span>{" "}
          <span className="text-[#d4b896]/90 whitespace-nowrap">분위기와 진행 완성도</span>를{" "}
          <span className="whitespace-nowrap">직접 비교해보세요.</span>
        </p>
      </div>

      {activeTier && (
        <TierRosterModal tier={activeTier} onClose={() => setActiveTier(null)} />
      )}
    </section>
  );
}
