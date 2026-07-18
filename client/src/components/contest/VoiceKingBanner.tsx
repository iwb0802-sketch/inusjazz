/**
 * 이달의 보이스 크라운 배너 - 저번달 확정 챔피언 + 이번달 실시간 순위
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, TrendingUp, ExternalLink } from "lucide-react";
import { getContestant, LAST_MONTH_CHAMPION, currentMonthLabel } from "./contestData";
import ProfileModal from "./ProfileModal";

interface VoiceKingBannerProps {
  monthHearts: Record<string, number>;
}

export default function VoiceKingBanner({ monthHearts }: VoiceKingBannerProps) {
  const [showProfile, setShowProfile] = useState(false);
  const ranking = Object.entries(monthHearts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const leader = ranking[0];
  const lastChampion = getContestant(LAST_MONTH_CHAMPION.name);

  return (
    <div className="w-full max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
      {/* 지난달 확정 */}
      <div className="rounded-2xl border border-[#d4b896]/25 bg-black/30 px-5 py-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-[#d4b896]/50">
          {lastChampion && (
            <img src={lastChampion.image} alt={lastChampion.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-[#d4b896] uppercase" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {LAST_MONTH_CHAMPION.monthLabel} 확정 보이스 크라운
          </p>
          <p className="flex items-center gap-1.5 mt-1">
            <Crown size={18} className="text-[#d4b896]" />
            <span className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              {LAST_MONTH_CHAMPION.name}
            </span>
          </p>
          <p className="text-[13px] font-medium text-[#d4b896] mt-1">
            누적 <span className="font-bold">{LAST_MONTH_CHAMPION.hearts.toLocaleString()}</span> 하트
          </p>
        </div>
        {lastChampion && (
          <button
            type="button"
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-1 text-[10px] text-[#d4b896]/80 border border-[#d4b896]/40 rounded-full px-2.5 py-1.5 hover:bg-[#d4b896]/10 hover:text-[#d4b896] transition-colors shrink-0"
          >
            <ExternalLink size={11} /> 프로필 보기
          </button>
        )}
      </div>
      {showProfile && lastChampion && (
        <ProfileModal url={lastChampion.profileUrl} onClose={() => setShowProfile(false)} />
      )}

      {/* 이번달 실시간 */}
      <div className="rounded-2xl border border-[#5BB5A2]/25 bg-black/30 px-5 py-4">
        <p className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#5BB5A2]/80 uppercase mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          <TrendingUp size={12} />
          {currentMonthLabel()} 진행중 · 실시간 순위
        </p>
        {ranking.length === 0 ? (
          <p className="text-sm text-white/50">아직 하트가 없어요. 지금 투표에 참여해보세요!</p>
        ) : (
          <div className="space-y-1.5">
            {ranking.map(([name, hearts], i) => (
              <motion.div
                key={name}
                layout
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-white/85">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                      i === 0 ? "bg-[#5BB5A2] text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {name}
                  {i === 0 && <span className="text-[10px] text-[#5BB5A2]">현재 1위</span>}
                </span>
                <motion.span
                  key={hearts}
                  initial={{ scale: 1.3, color: "#5BB5A2" }}
                  animate={{ scale: 1, color: "#ffffffcc" }}
                  className="tabular-nums font-medium"
                >
                  {hearts.toLocaleString()}♥
                </motion.span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
