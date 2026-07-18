/**
 * 이달의 VOTE ON VOICE 배너 - 저번달 확정 챔피언 + 이번달 실시간 순위
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, TrendingUp, ExternalLink, Play } from "lucide-react";
import { getContestant } from "./contestData";
import ProfileModal from "./ProfileModal";
import VideoModal from "./VideoModal";

interface LastMonthChampion {
  name: string;
  hearts: number;
  monthLabel: string;
}

interface VoiceKingBannerProps {
  monthHearts: Record<string, number>;
  monthLabel: string;
  lastMonthChampion: LastMonthChampion | null;
}

export default function VoiceKingBanner({ monthHearts, monthLabel, lastMonthChampion }: VoiceKingBannerProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [videoTarget, setVideoTarget] = useState<string | null>(null);
  const ranking = Object.entries(monthHearts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 동점자는 공동 순위로 처리 (예: 1,1,3,4...)
  const rankNumbers: number[] = [];
  ranking.forEach(([, hearts], i) => {
    if (i === 0) {
      rankNumbers.push(1);
    } else {
      const prevHearts = ranking[i - 1][1];
      rankNumbers.push(hearts === prevHearts ? rankNumbers[i - 1] : i + 1);
    }
  });

  const leader = ranking[0];
  const lastChampion = lastMonthChampion ? getContestant(lastMonthChampion.name) : undefined;

  return (
    <div className="w-full max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
      {/* 지난달 확정 */}
      <div className="rounded-2xl border border-[#d4b896]/25 bg-black/30 px-5 py-4 flex items-center gap-4">
        {lastMonthChampion ? (
          <>
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-[#d4b896]/50">
              {lastChampion && (
                <img src={lastChampion.image} alt={lastChampion.name} className="w-full h-full object-cover object-top" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-[#d4b896] uppercase" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {lastMonthChampion.monthLabel} 확정 VOTE ON VOICE
              </p>
              <p className="flex items-center gap-1.5 mt-1">
                <Crown size={18} className="text-[#d4b896]" />
                <span className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {lastMonthChampion.name}
                </span>
              </p>
              <p className="text-[13px] font-medium text-[#d4b896] mt-1">
                누적 <span className="font-bold">{lastMonthChampion.hearts.toLocaleString()}</span> 하트
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
          </>
        ) : (
          <p className="text-sm text-white/50">지난달 VOTE ON VOICE 집계 중입니다.</p>
        )}
      </div>
      {showProfile && lastChampion && (
        <ProfileModal url={lastChampion.profileUrl} onClose={() => setShowProfile(false)} />
      )}
      {videoTarget && getContestant(videoTarget)?.videoId && (
        <VideoModal
          videoId={getContestant(videoTarget)!.videoId}
          name={videoTarget}
          onClose={() => setVideoTarget(null)}
        />
      )}

      {/* 이번달 실시간 */}
      <div className="rounded-2xl border border-[#5BB5A2]/25 bg-black/30 px-5 py-4">
        <p className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#5BB5A2]/80 uppercase mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          <TrendingUp size={12} />
          {monthLabel} 진행중 · 실시간 순위
        </p>
        {ranking.length === 0 ? (
          <p className="text-sm text-white/50">아직 하트가 없어요. 지금 투표에 참여해보세요!</p>
        ) : (
          <div className="space-y-1.5">
            {ranking.map(([name, hearts], i) => {
              const rank = rankNumbers[i];
              const isTied = ranking.filter((_, j) => rankNumbers[j] === rank).length > 1;
              const contestant = getContestant(name);
              return (
              <motion.div
                key={name}
                layout
                className="flex items-center justify-between text-sm gap-2"
              >
                <span className="flex items-center gap-2 text-white/85 min-w-0">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                      rank === 1 ? "bg-[#5BB5A2] text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {rank}
                  </span>
                  <span className="truncate">{name}</span>
                  {rank === 1 && (
                    <span className="text-[10px] text-[#5BB5A2] shrink-0">{isTied ? "공동 1위" : "현재 1위"}</span>
                  )}
                  {rank !== 1 && isTied && (
                    <span className="text-[10px] text-white/40 shrink-0">공동 {rank}위</span>
                  )}
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <motion.span
                    key={hearts}
                    initial={{ scale: 1.3, color: "#5BB5A2" }}
                    animate={{ scale: 1, color: "#ffffffcc" }}
                    className="tabular-nums font-medium"
                  >
                    {hearts.toLocaleString()}♥
                  </motion.span>
                  {contestant?.videoId && (
                    <button
                      type="button"
                      onClick={() => setVideoTarget(name)}
                      aria-label={`${name} 사회자 영상 재생`}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-[#5BB5A2]/15 text-[#5BB5A2] hover:bg-[#5BB5A2]/30 transition-colors"
                    >
                      <Play size={11} fill="currentColor" />
                    </button>
                  )}
                </span>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
