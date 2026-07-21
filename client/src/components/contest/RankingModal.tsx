/**
 * 전체 순위 보기 모달 (항목 3)
 * 탭1: 이번달 실시간 전체 순위(9명) + 전일 대비 순위변동 화살표(항목4)
 * 탭2: 보이스 그랑프리(연간 누적) 랭킹
 * 탭3: 지난 달들의 확정 챔피언 아카이브(항목9)
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, Trophy, Crown, History } from "lucide-react";
import { CONTESTANTS, getContestant } from "./contestData";

interface RankingModalProps {
  monthHearts: Record<string, number>;
  monthLabel: string;
  rankChange?: Record<string, number | null>;
  onClose: () => void;
}

type Tab = "month" | "grandprix" | "archive";

function RankChangeBadge({ change }: { change: number | null | undefined }) {
  if (change === null || change === undefined || change === 0) {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-white/35">
        <Minus size={10} /> -
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-[#5BB5A2] font-semibold">
        <TrendingUp size={10} /> {change}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-[10px] text-[#ff7a8a] font-semibold">
      <TrendingDown size={10} /> {Math.abs(change)}
    </span>
  );
}

export default function RankingModal({ monthHearts, monthLabel, rankChange, onClose }: RankingModalProps) {
  const [tab, setTab] = useState<Tab>("month");
  const [grandprix, setGrandprix] = useState<{ year: number; ranking: { name: string; hearts: number }[] } | null>(null);
  const [archive, setArchive] = useState<{ monthStamp: string; monthLabel: string; name: string; hearts: number }[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "grandprix" && !grandprix) {
      setLoading(true);
      fetch("/api/grandprix")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setGrandprix(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    if (tab === "archive" && !archive) {
      setLoading(true);
      fetch("/api/champions")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setArchive(data.archive))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [tab, grandprix, archive]);

  const monthRanking = CONTESTANTS.map((c) => ({ name: c.name, hearts: monthHearts[c.name] || 0 })).sort(
    (a, b) => b.hearts - a.hearts
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#141414] border border-white/10 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-white/90">VOV 전체 순위</p>
          <button type="button" onClick={onClose} aria-label="닫기" className="text-white/50 hover:text-white/90">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4 bg-white/[0.04] rounded-full p-1">
          {[
            { key: "month" as Tab, label: `${monthLabel} 순위` },
            { key: "grandprix" as Tab, label: "연간 그랑프리" },
            { key: "archive" as Tab, label: "지난달 챔피언" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 text-[11px] font-medium py-2 rounded-full transition-colors ${
                tab === t.key ? "bg-[#5BB5A2] text-black" : "text-white/55 hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "month" && (
          <div className="space-y-1.5">
            {monthRanking.map((row, i) => {
              const data = getContestant(row.name);
              return (
                <div key={row.name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03]">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold shrink-0 ${
                      i === 0 ? "bg-[#5BB5A2] text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {data && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <img src={data.image} alt={row.name} className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                  <span className="flex-1 text-[13px] text-white/85 truncate">{row.name}</span>
                  <RankChangeBadge change={rankChange?.[row.name]} />
                  <span className="text-[13px] font-medium text-white/70 tabular-nums shrink-0 w-14 text-right">
                    {row.hearts.toLocaleString()}♥
                  </span>
                </div>
              );
            })}
            <p className="text-[10px] text-white/30 text-center pt-2">전일 대비(자정 기준) 순위 변동입니다.</p>
          </div>
        )}

        {tab === "grandprix" && (
          <div className="space-y-1.5">
            {loading && !grandprix && <p className="text-center text-white/40 text-xs py-8">불러오는 중...</p>}
            {grandprix && (
              <>
                <p className="text-[10px] text-white/40 flex items-center gap-1 mb-2">
                  <Trophy size={11} className="text-[#d4b896]" /> {grandprix.year}년 연간 누적 하트
                </p>
                {grandprix.ranking.map((row, i) => {
                  const data = getContestant(row.name);
                  return (
                    <div key={row.name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03]">
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold shrink-0 ${
                          i === 0 ? "bg-[#d4b896] text-black" : "bg-white/10 text-white/60"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {data && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <img src={data.image} alt={row.name} className="w-full h-full object-cover object-top" />
                        </div>
                      )}
                      <span className="flex-1 text-[13px] text-white/85 truncate">{row.name}</span>
                      <span className="text-[13px] font-medium text-white/70 tabular-nums shrink-0">
                        {row.hearts.toLocaleString()}♥
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {tab === "archive" && (
          <div className="space-y-1.5">
            {loading && !archive && <p className="text-center text-white/40 text-xs py-8">불러오는 중...</p>}
            {archive && archive.length === 0 && (
              <p className="text-center text-white/40 text-xs py-8">아직 확정된 지난 달 챔피언이 없어요.</p>
            )}
            {archive?.map((row) => (
              <div key={row.monthStamp} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03]">
                <Crown size={14} className="text-[#d4b896] shrink-0" />
                <span className="text-[11px] text-white/45 w-16 shrink-0">{row.monthLabel}</span>
                <span className="flex-1 text-[13px] text-white/85 truncate">{row.name}</span>
                <span className="text-[12px] text-white/55 tabular-nums shrink-0">{row.hearts.toLocaleString()}♥</span>
              </div>
            ))}
            <p className="text-[10px] text-white/30 text-center pt-2 flex items-center justify-center gap-1">
              <History size={10} /> 매월 확정된 VOTE ON VOICE 기록입니다.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
