/**
 * VOTE ON VOICE 콘테스트 - 임시 데모 페이지 (/contest)
 * 사회자 1:1 토너먼트 + 하트(투표) 시스템 + 이달의 VOTE ON VOICE
 * 주의: 아직 메인 내비게이션에 연결되지 않은 임시 프로토타입입니다.
 * 하트 데이터는 브라우저 localStorage에만 저장됩니다 (서버 공유 없음).
 */
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Crown, RotateCcw, MessageCircle, ArrowLeft, Heart, Sparkles, Play, Volume2, VolumeX, UserRound, Download, Mic2, ListChecks, Music4, ShieldCheck, Camera, Share2, TrendingUp, Medal, Gift, CalendarSearch, Star } from "lucide-react";
import {
  CONTESTANTS,
  getContestant,
  addHeart,
  getAllTimeHearts,
  getMonthHearts,
  fetchHeartsFromServer,
  currentMonthLabel,
  registerTournamentStart,
  trackEvent,
} from "@/components/contest/contestData";
import { buildRound, roundLabel, type RoundSetup } from "@/components/contest/bracketEngine";
import MatchCard from "@/components/contest/MatchCard";
import VoiceKingBanner from "@/components/contest/VoiceKingBanner";
import ProfileModal from "@/components/contest/ProfileModal";
import { setSoundMuted, isSoundMuted, playSfx } from "@/components/contest/soundEffects";
import { buildShareCard } from "@/components/contest/shareCard";

const MINT = "#5BB5A2";
const GOLD = "#d4b896";

type Phase = "intro" | "match" | "reveal" | "champion";

/**
 * ref가 가리키는 요소의 화면상 위치가 더 이상 움직이지 않을 때까지(연속 두 프레임 값이
 * 거의 같을 때까지) 기다렸다가 그 지점으로 스크롤한다.
 * 블라인드 모드는 매치 중 순위 배너가 언마운트돼 있다가 결과 발표 순간(match→reveal) 다시
 * 마운트되는데, 이 재마운트가 정확히 몇 프레임 뒤에 완전히 반영되는지 보장할 수 없어
 * 고정 프레임 수(rAF 1~2번)만으로는 타이밍이 어긋나 순위 배너 일부가 같이 보이곤 했다.
 * 일반 모드는 배너가 매치 중에도 이미 떠 있어 이런 레이아웃 변동이 없어 상대적으로 정교했다.
 * 이 함수는 원인(배너 마운트/이미지/애니메이션 등)에 상관없이 레이아웃이 실제로 안정된
 * 뒤에 스크롤하므로 일반/블라인드 두 모드 모두 동일하게 정교해진다.
 *
 * 챔피언 전환 시 이 함수를 다시 호출하면, 리빌 단계에서 먼저 호출된 "smooth" 스크롤이
 * 아직 브라우저에서 애니메이션 중일 수 있다. 그 상태로 새로 위치를 재기 시작하면 매 프레임
 * 값이 계속 바뀌는 중(진짜 레이아웃 불안정이 아니라 이전 스크롤의 관성)인데도 maxFrames에
 * 도달하면 그 "움직이는 중"인 좌표를 최종값으로 오인해 스크롤 목표를 잘못 계산해버린다
 * (챔피언 카드 위로 배너가 다시 보이는 원인). 측정을 시작하기 전에 진행 중인 스크롤을
 * 먼저 즉시(behavior:auto) 같은 위치로 재호출해 멈춰 세운 뒤에 안정성 측정을 시작한다.
 */
function scrollToStableTop(ref: React.RefObject<HTMLDivElement | null>, offset: number, behavior: ScrollBehavior, maxFrames = 20) {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });
  let lastTop: number | null = null;
  let stableCount = 0;
  let frame = 0;
  const step = () => {
    frame += 1;
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (lastTop !== null && Math.abs(top - lastTop) < 0.5) {
      stableCount += 1;
    } else {
      stableCount = 0;
    }
    lastTop = top;
    // 연속 2프레임 동안 위치가 안 변했으면 안정된 것으로 보고 스크롤, 아니면 최대 프레임까지 재시도
    if (stableCount >= 2 || frame >= maxFrames) {
      const target = top + window.scrollY - offset;
      window.scrollTo({ top: target, left: 0, behavior });
      return;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function Contest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIndex, setRoundIndex] = useState(1);
  const [roundSetup, setRoundSetup] = useState<RoundSetup | null>(null);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winnersAcc, setWinnersAcc] = useState<string[]>([]);
  const [champion, setChampion] = useState<string | null>(null);
  // 이번 회차(1회 플레이) 동안 각 사회자가 승리(부전승 포함)로 다음 라운드에 진출한 횟수.
  // 결과 화면의 2~5위 미니 랭킹은 이 값을 기준으로 매긴다 (많이 이길수록 상위 라운드까지 진출).
  const [winCounts, setWinCounts] = useState<Record<string, number>>({});
  const [sessionHearts, setSessionHearts] = useState(0);
  const [allTime, setAllTime] = useState<Record<string, number>>({});
  const [monthHearts, setMonthHearts] = useState<Record<string, number>>({});
  const [monthLabel, setMonthLabel] = useState(currentMonthLabel());
  const [lastMonthChampion, setLastMonthChampion] = useState<{
    name: string;
    hearts: number;
    monthLabel: string;
  } | null>(null);
  const [rankChange, setRankChange] = useState<Record<string, number | null>>({});
  const [heartsUpdatedAt, setHeartsUpdatedAt] = useState<string | undefined>(undefined);
  const [heartedThisGame, setHeartedThisGame] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(isSoundMuted());
  const [isBlind, setIsBlind] = useState(false);
  const [showVoteInfo, setShowVoteInfo] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showChampionProfile, setShowChampionProfile] = useState(false);
  const [runnerUpProfileUrl, setRunnerUpProfileUrl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "loading" | "done" | "opened" | "copied" | "error">("idle");
  // 하루 중복 플레이 방지: 이 기기의 오늘 첫 플레이만 전체 공유 집계에 반영됨
  const countsTowardTotalRef = useRef(true);
  // 결과 발표(서스펜스→챔피언) 순간, 페이지 최상단이 아니라 실제 발표 영역으로 포커스를
  // 맞추기 위한 ref. 랭킹 배너 등 상단 콘텐츠가 먼저 보이는 문제를 막는다.
  const revealAreaRef = useRef<HTMLDivElement>(null);
  const [isPracticeRound, setIsPracticeRound] = useState(false);
  // 항목①: 챔피언 발표 전 "결과 발표 중..." 서스펜스 단계 - 후보 사진이 빠르게 스치는 효과
  const [revealPool, setRevealPool] = useState<string[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  // 항목②: 발표 순간 화면 전체가 하얗게 번쩍이는 플래시 효과
  const [flash, setFlash] = useState(false);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  }, []);


  const refreshHearts = useCallback(() => {
    // 로컬 값으로 즉시 표시 (optimistic), 서버 응답 오면 아래에서 실제값으로 덮어씀
    setAllTime(getAllTimeHearts());
    setMonthHearts(getMonthHearts());
  }, []);

  useEffect(() => {
    refreshHearts();
  }, [refreshHearts]);

  // 서버(Railway DB 연동 후) 전체 방문자 공유 집계로 동기화. 서버 미연결 시 로컬 값 유지.
  useEffect(() => {
    fetchHeartsFromServer().then((data) => {
      if (!data) return;
      setAllTime(data.allTime);
      setMonthHearts(data.month);
      setMonthLabel(data.currentMonthLabel);
      setLastMonthChampion(data.lastMonthChampion);
      if (data.rankChange) setRankChange(data.rankChange);
      if (data.updatedAt) setHeartsUpdatedAt(data.updatedAt);
    });
  }, []);

  const giveHeart = useCallback(
    (name: string, amount = 1) => {
      addHeart(name, amount, countsTowardTotalRef.current);
      refreshHearts();
      setSessionHearts((v) => v + amount);
    },
    [refreshHearts],
  );

  // 수동 하트 탭은 게임(토너먼트 1회)당 사회자 한 명에게 최대 1회만 허용
  const manualHeart = useCallback(
    (name: string) => {
      if (heartedThisGame.has(name)) return;
      setHeartedThisGame((prev) => new Set(prev).add(name));
      giveHeart(name, 1);
      playSfx("heart");
    },
    [heartedThisGame, giveHeart],
  );

  const startRound = useCallback(
    (players: string[], idx: number) => {
      const setup = buildRound(players, idx);
      setRoundSetup(setup);
      setMatchIdx(0);
      setWinnersAcc(setup.bye ? [setup.bye] : []);
      if (setup.bye) {
        giveHeart(setup.bye, 1);
        setWinCounts((prev) => ({ ...prev, [setup.bye as string]: (prev[setup.bye as string] || 0) + 1 }));
      }
      setPhase("match");
      // 토너먼트를 새로 시작할 때(1라운드)만 최상단으로 스크롤한다.
      // 중간 라운드 전환(TOP5, TOP3, 결승 등)에서는 스크롤을 그대로 유지해
      // 카드가 있던 자리에서 자연스럽게 다음 라운드로 넘어가도록 한다.
      // (라운드 전환마다 화면이 위로 튀는 현상 방지)
      if (idx === 1 && typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    },
    [giveHeart],
  );

  const beginTournament = useCallback(
    async (blind: boolean = false) => {
      const names = CONTESTANTS.map((c) => c.name);
      setIsBlind(blind);
      setChampion(null);
      setSessionHearts(0);
      setHeartedThisGame(new Set());
      setRoundIndex(1);
      setWinCounts({});
      trackEvent("game_start");
      // 이 기기의 오늘 첫 플레이인지 확인 - 맞으면 정상 집계, 아니면 연습 모드
      const withinLimit = await registerTournamentStart();
      countsTowardTotalRef.current = withinLimit;
      setIsPracticeRound(!withinLimit);
      // startRound 내부에서 게임 화면 진입 시 스크롤을 최상단으로 이동시켜
      // 모바일에서 인트로 화면의 스크롤 위치가 남아 게임 화면 위에 빈 공간이 생기지 않도록 함
      startRound(names, 1);
    },
    [startRound],
  );

  const selectWinner = useCallback(
    (winner: string) => {
      if (!roundSetup) return;
      giveHeart(winner, 1);
      setWinCounts((prev) => ({ ...prev, [winner]: (prev[winner] || 0) + 1 }));
      playSfx("select");
      const nextWinners = [...winnersAcc, winner];
      const isLastMatch = matchIdx + 1 >= roundSetup.matches.length;
      if (!isLastMatch) {
        setWinnersAcc(nextWinners);
        setMatchIdx((v) => v + 1);
        return;
      }
      // 라운드 종료
      if (nextWinners.length === 1) {
        const finalWinner = nextWinners[0];
        // 항목①: 곧바로 챔피언 화면으로 가지 않고, 후보 사진이 빠르게 스치는
        // "결과 발표 중..." 서스펜스 단계를 약 1.5초간 먼저 보여준다.
        const others = CONTESTANTS.map((c) => c.name).filter((n) => n !== finalWinner);
        const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 5);
        setRevealPool([...shuffled, finalWinner]);
        setRevealIndex(0);
        setPhase("reveal");
        playSfx("drumroll");
        scrollToStableTop(revealAreaRef, 12, "smooth");
        setTimeout(() => {
          setChampion(finalWinner);
          setPhase("champion");
          setFlash(true);
          playSfx("fanfare");
          trackEvent("game_complete", finalWinner);
          // 리빌 단계 중 사용자가 스크롤을 건드렸거나 레이아웃이 흐트러졌을 수 있으니,
          // 챔피언 카드로 전환되는 순간 다시 한번 같은 지점으로 보정한다(점프 없이 즉시 이동).
          scrollToStableTop(revealAreaRef, 12, "auto");
          setTimeout(() => setFlash(false), 260);
        }, 1500);
      } else {
        const nextIdx = roundIndex + 1;
        setRoundIndex(nextIdx);
        startRound(nextWinners, nextIdx);
      }
    },
    [roundSetup, winnersAcc, matchIdx, roundIndex, startRound, giveHeart],
  );

  const currentMatch = roundSetup?.matches[matchIdx];
  const contestantA = currentMatch ? getContestant(currentMatch.a) : undefined;
  const contestantB = currentMatch ? getContestant(currentMatch.b) : undefined;

  const totalMatchesThisRound = roundSetup?.matches.length ?? 0;
  const label = roundSetup ? roundLabel(roundSetup.playersIn.length) : "";

  // 항목①: 서스펜스 단계 동안 후보 사진을 빠르게 전환 (두구두구 드럼롤과 함께)
  useEffect(() => {
    if (phase !== "reveal" || revealPool.length === 0) return;
    const interval = setInterval(() => {
      setRevealIndex((v) => (v + 1) % revealPool.length);
    }, 110);
    return () => clearInterval(interval);
  }, [phase, revealPool]);

  // 항목1+4: 챔피언 확정 순간 컨페티 리워드 애니메이션을 훨씬 풍성하게(4~5웨이브, 다양한 모양, 화면 곳곳)
  useEffect(() => {
    if (phase !== "champion") return;
    const colors = ["#d4b896", "#f4e2b8", "#5BB5A2", "#ffffff"];
    const shapes: confetti.Shape[] = ["star", "circle", "square"];
    const fire = (opts: confetti.Options) =>
      confetti({ colors, shapes, disableForReducedMotion: true, ...opts });
    // 1웨이브: 중앙에서 크게 터짐
    fire({ particleCount: 130, spread: 80, startVelocity: 55, scalar: 1.1, origin: { x: 0.5, y: 0.3 } });
    const timers = [
      // 2웨이브: 좌우 동시 발사
      setTimeout(() => {
        fire({ particleCount: 60, spread: 65, startVelocity: 40, origin: { x: 0.1, y: 0.45 } });
        fire({ particleCount: 60, spread: 65, startVelocity: 40, origin: { x: 0.9, y: 0.45 } });
      }, 220),
      // 3웨이브: 아래쪽 넓게
      setTimeout(() => {
        fire({ particleCount: 80, spread: 100, startVelocity: 35, origin: { x: 0.5, y: 0.6 } });
      }, 450),
      // 4웨이브: 별모양 위주로 위에서 흩날림
      setTimeout(() => {
        fire({ particleCount: 45, spread: 70, startVelocity: 30, shapes: ["star"], scalar: 1.2, origin: { x: 0.25, y: 0.2 } });
        fire({ particleCount: 45, spread: 70, startVelocity: 30, shapes: ["star"], scalar: 1.2, origin: { x: 0.75, y: 0.2 } });
      }, 700),
      // 5웨이브: 마무리로 은은하게 한 번 더
      setTimeout(() => {
        fire({ particleCount: 55, spread: 90, startVelocity: 28, origin: { x: 0.5, y: 0.5 } });
      }, 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const championData = champion ? getContestant(champion) : undefined;
  // SIGNATURE 등급(회사 대표 사회자)은 이미 최상위 등급이라 VOV 1위 지정예약 1만원 할인 대상에서 제외
  const lastMonthChampionData = lastMonthChampion ? getContestant(lastMonthChampion.name) : undefined;
  const isLastMonthChampionSignature = lastMonthChampionData?.tier === "SIGNATURE";
  const isChampionSignature = championData?.tier === "SIGNATURE";
  // 항목2: 이번 회차 챔피언이 실제 '지난달 VOV' 타이틀 사회자와 같을 때만 1만원 할인 문구를 추가로 노출
  // (매 플레이 챔피언에게 무조건 VOV 할인을 붙이면 실제 혜택 조건과 안 맞아 과장 표기가 됨)
  const championIsRealVov = !!champion && !!lastMonthChampion && champion === lastMonthChampion.name && !isChampionSignature;

  // 결과 화면의 2~5위 미니 랭킹: 이번 회차에서 승리(부전승 포함)로 다음 라운드에
  // 진출한 횟수가 많은 순으로 정렬 (챔피언 제외). 진출 횟수가 같으면 공동 순위로 표시.
  // 결과 화면의 2~5위 미니 랭킹: 이번 회차 진출 횟수(부전승 포함) 기준 내림차순.
  // 진출 횟수가 같으면 전체 누적 하트(인기도)가 더 높은 사회자를 상위로 배치해
  // 매번 "공동 4위"만 반복되지 않고 2~5위가 항상 다른 순위로 표시되게 한다.
  // 항목6: 결과 화면에 내가 선택한 챔피언의 이번 달 월간 실시간 순위를 표시
  const championMonthRank = useMemo(() => {
    if (!champion) return null;
    const sorted = Object.entries(monthHearts).sort((a, b) => b[1] - a[1]);
    const idx = sorted.findIndex(([name]) => name === champion);
    if (idx === -1) return null;
    return idx + 1;
  }, [champion, monthHearts]);

  const runnerUps = useMemo(() => {
    if (!champion) return [];
    const others = CONTESTANTS.map((c) => c.name)
      .filter((name) => name !== champion)
      .sort((a, b) => {
        const winDiff = (winCounts[b] || 0) - (winCounts[a] || 0);
        if (winDiff !== 0) return winDiff;
        return (allTime[b] || 0) - (allTime[a] || 0);
      });
    return others.slice(0, 4).map((name, idx) => ({ name, rank: idx + 2 }));
  }, [champion, winCounts, allTime]);

  // 카카오톡/인스타그램 인앱 브라우저는 파일 공유(navigator.share files)를
  // 막아두거나 이상 동작하는 경우가 많아 "공유하기" 대신 순수 "이미지 저장(다운로드)"으로
  // 단순화한다. 텍스트 클립보드 복사는 이미지 생성 자체가 실패했을 때만 최후 수단으로 사용.
  const copyTextFallback = useCallback(async (shareText: string): Promise<boolean> => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        return true;
      }
    } catch {
      // 클립보드 접근 실패 - 아래에서 error 처리
    }
    return false;
  }, []);

  const handleSaveImage = useCallback(async () => {
    if (!championData) return;
    setShareStatus("loading");
    const heartsCount = monthHearts[championData.name] || 0;
    const shareText = `[VOTE ON VOICE] 이번 회차 챔피언은 ${championData.name} 사회자! ${monthLabel} 누적 하트 ${heartsCount}개 🎤\n나도 내 결혼식에 어울리는 사회자 목소리 찾아보기 → https://www.inusmc.co.kr/contest`;

    let blob: Blob | null = null;
    try {
      blob = await buildShareCard({
        championName: championData.name,
        championImage: championData.image,
        highlight: championData.highlight,
        monthHearts: heartsCount,
        monthLabel,
      });
    } catch {
      blob = null;
    }

    // 이미지 카드 생성 자체가 실패하면(캔버스 미지원 등) 텍스트라도 복사되도록 폴백
    if (!blob) {
      const ok = await copyTextFallback(shareText);
      setShareStatus(ok ? "copied" : "error");
      return;
    }

    const fileName = `vov-${championData.name}.png`;
    const url = URL.createObjectURL(blob);

    // 숨고/카카오톡/인스타그램 등 인앱 브라우저는 다운로드나 새 창 열기 자체를
    // 막아버리는 경우가 있어 코드로는 100% 성공을 보장할 수 없다.
    // 그래서 일단 표준 다운로드를 시도는 하되, 실패 여부와 상관없이 버튼 아래에
    // "저장이 안 되면 화면을 캡처해주세요" 안내를 항상 같이 보여준다 (아래 JSX 참고).
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setShareStatus("done");
    } catch {
      setShareStatus("done");
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  }, [championData, monthHearts, monthLabel, copyTextFallback]);

  // 항목8: 콘테스트 페이지 링크 공유 (Web Share API -> 클립보드 복사 폴백)
  const [linkShareStatus, setLinkShareStatus] = useState<"idle" | "opened" | "copied" | "error">("idle");
  const handleShareLink = useCallback(async () => {
    const url = "https://www.inusmc.co.kr/contest";
    trackEvent("share_link_click", championData?.name);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "VOTE ON VOICE | 이너스뮤직 사회자 목소리 콘테스트", url });
        setLinkShareStatus("opened");
        return;
      }
    } catch {
      // 사용자가 취소했거나 지원 안 함 - 아래 클립보드 폴백으로 이동
    }
    const ok = await copyTextFallback(url);
    setLinkShareStatus(ok ? "copied" : "error");
  }, [championData, copyTextFallback]);

  // 콘테스트 페이지 전용 SEO/OG 메타 태그 (SPA이므로 클라이언트에서 갱신)
  useEffect(() => {
    const prevTitle = document.title;
    const title = "VOV | 웨딩 사회자 목소리 콘테스트 | 이너스뮤직";
    const description =
      "이너스뮤직 사회자들의 목소리를 직접 듣고, 내 결혼식에 어울리는 사회자를 선택해보세요. VOTE ON VOICE 월간 콘테스트.";
    const ogTitle = "VOV | 내 결혼식에 어울리는 사회자 목소리 찾기";
    const ogDescription = "이너스뮤직 사회자들의 목소리를 비교하고 마음에 드는 사회자에게 투표해보세요.";
    const url = "https://www.inusmc.co.kr/contest";

    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!el) return; // 태그가 index.html에 없으면 새로 만들지 않고 스킵 (원본 구조 유지)
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:title"]', "content", ogTitle);
    setMeta('meta[property="og:description"]', "content", ogDescription);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", ogTitle);
    setMeta('meta[name="twitter:description"]', "content", ogDescription);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    return () => {
      // 페이지 이탈 시 기본 메타로 복원 (다음 페이지 진입 시 각자 라우트가 재설정)
      document.title = prevTitle;
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-[#0d0d0d] text-white pb-24"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <a
        href="/"
        className="fixed top-4 left-4 z-40 flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white transition-colors bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm border border-white/15"
      >
        <ArrowLeft size={13} /> 메인으로
      </a>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "소리 켜기" : "소리 끄기"}
        className="fixed top-4 right-4 z-40 flex items-center justify-center w-9 h-9 text-white/60 hover:text-white/90 transition-colors bg-black/40 rounded-full backdrop-blur-sm"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* 항목②: 챔피언 발표 순간 화면 전체가 하얗게 번쩍이는 플래시 효과 */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="fixed inset-0 z-[60] bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, times: [0, 0.25, 1] }}
          />
        )}
      </AnimatePresence>

      {/* 게임 화면 전용 소형 상담 CTA - 결과 화면의 메인 상담 버튼과 별개, 하단 우측에 작게 배치 (하단 좌측 AI 챗봇 위젯과 겹치지 않도록) */}
      {phase === "match" && (
        <a
          href="https://pf.kakao.com/_wxovaM/chat"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오 상담하기"
          title="카카오 상담하기"
          className="fixed bottom-5 right-4 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-black/55 border border-white/15 text-[#5BB5A2] backdrop-blur-sm hover:bg-black/70 hover:border-[#5BB5A2]/40 transition-colors"
        >
          <MessageCircle size={18} />
        </a>
      )}

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen w-full flex items-center justify-center px-5 relative overflow-hidden"
          >
            {/* 배경 장식 */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 15%, rgba(212,184,150,0.14) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(91,181,162,0.10) 0%, transparent 50%)",
              }}
            />
            <div className="relative max-w-md w-full text-center py-16">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-6 flex items-center justify-center gap-2"
              >
                <span className="h-px w-8 bg-[#d4b896]/40" />
                <p className="text-[10px] tracking-[0.3em] text-[#d4b896] uppercase">Wedding MC Contest</p>
                <span className="h-px w-8 bg-[#d4b896]/40" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, rgba(212,184,150,0.18), rgba(212,184,150,0.02))",
                  border: "1px solid rgba(212,184,150,0.35)",
                }}
              >
                <Crown className="text-[#d4b896]" size={26} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="text-5xl sm:text-6xl mb-1 leading-tight tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                <span style={{ color: MINT }}>V</span>OTE <span style={{ color: MINT }}>O</span>N
                <br />
                <span style={{ color: MINT }}>V</span>OICE
              </motion.h1>
              <p
                className="text-[11px] tracking-[0.4em] text-white/40 uppercase mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Contest
              </p>
              <p className="text-[12px] text-white/60 tracking-wide mb-5 break-keep">
                VOV는 이너스뮤직 사회자들의 목소리를 직접 듣고 선택하는 콘테스트예요.
              </p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.5 }}
                className="text-sm text-white/55 leading-relaxed max-w-sm mx-auto mb-9 break-keep"
              >
                신랑신부님이 직접 듣고 선택하는
                <br />
                이너스뮤직 사회자 목소리 콘테스트.
                <br />
                내 결혼식에 어울리는 목소리를
                <br />
                직접 비교하고,
                <br />
                가장 마음에 드는 사회자에게
                <br />
                하트를 보내보세요.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-center gap-3 sm:gap-5 mb-9 text-white/45"
              >
                <span className="text-[11px] tracking-wide whitespace-nowrap">
                  Since <span className="text-[#d4b896] font-medium">2015</span>
                </span>
                <span className="w-px h-3 bg-white/15" />
                <span className="text-[11px] tracking-wide whitespace-nowrap">
                  누적 <span className="text-[#d4b896] font-medium">4만쌍+</span> 진행
                </span>
                <span className="w-px h-3 bg-white/15" />
                <span className="text-[11px] tracking-wide whitespace-nowrap">
                  후기 <span className="text-[#d4b896] font-medium">2,700건+</span>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.5 }}
                className="grid grid-cols-3 gap-2 mb-10 text-left"
              >
                {[
                  { icon: Play, label: "1:1 매치", desc: "실제 음성으로 대결" },
                  { icon: Heart, label: "하트 투표", desc: "마음에 드는 목소리 선택" },
                  { icon: Sparkles, label: "이달의 VOV", desc: "월간 VOTE ON VOICE 선정" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 flex flex-col items-center text-center gap-1.5"
                  >
                    <item.icon size={16} className="text-[#d4b896]" />
                    <span className="text-[11px] font-medium text-white/85">{item.label}</span>
                    <span className="text-[11px] text-white/55 leading-snug">{item.desc}</span>
                  </div>
                ))}
              </motion.div>

              {/* 이번달 실시간 TOP3~5 미리보기 (항목1) - 블라인드 테스트 참여 전, VOV 순위를 먼저 보여줌 */}
              {Object.keys(monthHearts).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46, duration: 0.5 }}
                  className="mb-9 rounded-2xl border border-[#5BB5A2]/25 bg-black/30 px-4 py-4 text-left"
                >
                  <p className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#5BB5A2]/80 uppercase mb-2.5">
                    <TrendingUp size={12} />
                    {monthLabel} 실시간 TOP {Math.min(5, Object.keys(monthHearts).length)}
                  </p>
                  <div className="space-y-1.5">
                    {Object.entries(monthHearts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([name, hearts], i) => (
                        <div key={name} className="flex items-center justify-between text-[13px] gap-2">
                          <span className="flex items-center gap-2 text-white/85 min-w-0">
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                                i === 0 ? "bg-[#5BB5A2] text-black" : "bg-white/10 text-white/60"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className="truncate">{name}</span>
                          </span>
                          <span className="tabular-nums font-medium text-white/70 shrink-0">{hearts.toLocaleString()}♥</span>
                        </div>
                      ))}
                  </div>
                  <p className="text-[10px] text-white/30 mt-2.5">투표에 참여하면 순위에 바로 반영돼요.</p>
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.5 }}
                className="text-white/70 text-[13px] font-medium tracking-wide mb-4 break-keep"
              >
                목소리만 듣고 내 사회자 선택하기
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.5 }}
                className="flex flex-col items-center justify-center gap-3"
              >
                <button
                  onClick={() => beginTournament(true)}
                  className="w-full sm:w-auto sm:px-12 py-4 rounded-full text-black text-sm font-bold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${MINT}, #7cc9b8)`,
                    boxShadow: `0 8px 30px rgba(91,181,162,0.35)`,
                  }}
                >
                  블라인드 모드로 시작하기
                </button>
                <p className="text-[10px] text-white/35 tracking-wide break-keep">
                  이름과 사진 없이 목소리만 듣고 선택해요
                </p>
                <button
                  onClick={() => beginTournament(false)}
                  className="w-full sm:w-auto sm:px-10 py-3 rounded-full text-white/70 text-[13px] font-medium tracking-wide border border-white/20 bg-white/[0.03] transition-transform hover:scale-[1.02] hover:border-white/40 active:scale-[0.98] mt-1"
                >
                  사진과 정보를 보고 선택하기
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.58, duration: 0.5 }}
                className="mt-6"
              >
                <button
                  type="button"
                  onClick={() => setShowVoteInfo((v) => !v)}
                  className="text-[11px] text-white/40 hover:text-white/65 tracking-wide underline underline-offset-4 decoration-white/20 transition-colors"
                >
                  {showVoteInfo ? "투표 안내 접기 ▲" : "투표 안내 보기 ▼"}
                </button>
                {showVoteInfo && (
                  <div className="mt-3 mx-auto max-w-sm rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left">
                    <ul className="space-y-1.5 text-[12px] text-white/65 leading-relaxed">
                      <li>· 대결에서 사회자를 선택하면 기본 하트 1개가 적립됩니다.</li>
                      <li>· 카드의 하트 버튼을 누르면 사회자별 추가 하트 1개를 보낼 수 있습니다.</li>
                      <li>· 하루 1회 플레이만 전체 집계에 반영됩니다.</li>
                      <li>· 이후 재플레이는 연습 모드로 즐길 수 있으며 전체 집계에는 반영되지 않습니다.</li>
                      <li>· 하트 수는 실시간 순위와 월간 집계에 반영됩니다.</li>
                      <li>· 월간 누적 하트 1위 사회자가 '이달의 VOV'로 선정됩니다.</li>
                    </ul>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 mx-auto w-full max-w-[340px] sm:max-w-sm"
              >
                <div
                  className="rounded-2xl px-4 py-3.5 text-center"
                  style={{
                    border: `1px solid ${GOLD}33`,
                    background: `linear-gradient(180deg, ${GOLD}12, rgba(255,255,255,0.02))`,
                    boxShadow: `0 6px 24px rgba(212,184,150,0.08)`,
                  }}
                >
                  <span
                    className="inline-block text-[10px] tracking-[0.18em] px-2.5 py-1 rounded-full mb-2.5"
                    style={{ color: GOLD, border: `1px solid ${GOLD}44`, background: `${GOLD}14` }}
                  >
                    이달의 혜택
                  </span>
                  {isLastMonthChampionSignature ? (
                    <>
                      <p className="text-[13px] leading-[1.75] text-white/75 break-keep">
                        <span className="inline-block">지난달 </span>
                        <span className="inline-block font-semibold" style={{ color: MINT }}>VOTE&nbsp;ON&nbsp;VOICE</span>
                        <span className="inline-block">&nbsp;사회자는</span>{" "}
                        <span className="inline-block font-semibold" style={{ color: GOLD }}>SIGNATURE</span>
                        <span className="inline-block">&nbsp;등급이라</span>
                      </p>
                      <p className="mt-1 text-[14px] font-bold tracking-wide break-keep text-white/80">
                        VOV 지정예약 할인 대상에서 제외됩니다
                      </p>
                      <p className="mt-1.5 text-[11px] text-white/40 break-keep">SIGNATURE 등급 사회자는 이미 최상위 등급으로 별도 지정예약 할인이 적용되지 않아요</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] leading-[1.75] text-white/75 break-keep">
                        <span className="inline-block">지난달 </span>
                        <span className="inline-block font-semibold" style={{ color: MINT }}>VOTE&nbsp;ON&nbsp;VOICE</span>
                        <span className="inline-block">&nbsp;사회자를</span>{" "}
                        <span className="inline-block">이번 달 지정 예약하시면</span>
                      </p>
                      <p className="mt-1 text-[15px] font-bold tracking-wide break-keep" style={{ color: GOLD }}>
                        1만 원 할인
                        <span className="text-white/70 font-medium text-[13px]"> 혜택 제공</span>
                      </p>
                      <p className="mt-1.5 text-[11px] text-white/40 break-keep">다른 이벤트와 중복 적용 가능 (SIGNATURE 등급 사회자는 제외)</p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== "intro" && (
      <div className="max-w-3xl mx-auto px-4 pt-20 relative">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.25em] text-[#d4b896] uppercase mb-3">INUSMUSIC VOTE ON VOICE</p>
          <h1
            className="text-3xl sm:text-5xl mb-3 leading-tight tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            <span style={{ color: MINT }}>V</span>OTE <span style={{ color: MINT }}>O</span>N <span style={{ color: MINT }}>V</span>OICE
          </h1>
          <p className="text-sm text-white/65 leading-[1.8] max-w-md mx-auto break-keep">
            <span className="inline-block">신랑신부님이 직접 듣고 선택하는</span>{" "}
            <span className="inline-block">이너스뮤직 사회자 목소리 콘테스트</span>
          </p>

          <div className="mt-4 mx-auto w-full max-w-[340px] sm:max-w-sm">
            <div
              className="rounded-2xl px-4 py-3.5 text-center"
              style={{
                border: `1px solid ${GOLD}33`,
                background: `linear-gradient(180deg, ${GOLD}12, rgba(255,255,255,0.02))`,
                boxShadow: `0 6px 24px rgba(212,184,150,0.08)`,
              }}
            >
              <span
                className="inline-block text-[10px] tracking-[0.18em] px-2.5 py-1 rounded-full mb-2.5"
                style={{ color: GOLD, border: `1px solid ${GOLD}44`, background: `${GOLD}14` }}
              >
                이달의 혜택
              </span>
              {isLastMonthChampionSignature ? (
                <>
                  <p className="text-[13px] leading-[1.75] text-white/75 break-keep">
                    <span className="inline-block">지난달 </span>
                    <span className="inline-block font-semibold" style={{ color: MINT }}>VOTE&nbsp;ON&nbsp;VOICE</span>
                    <span className="inline-block">&nbsp;사회자는</span>{" "}
                    <span className="inline-block font-semibold" style={{ color: GOLD }}>SIGNATURE</span>
                    <span className="inline-block">&nbsp;등급이라</span>
                  </p>
                  <p className="mt-1 text-[14px] font-bold tracking-wide break-keep text-white/80">
                    VOV 지정예약 할인 대상에서 제외됩니다
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/40 break-keep">SIGNATURE 등급 사회자는 이미 최상위 등급으로 별도 지정예약 할인이 적용되지 않아요</p>
                </>
              ) : (
                <>
                  <p className="text-[13px] leading-[1.75] text-white/75 break-keep">
                    <span className="inline-block">지난달 </span>
                    <span className="inline-block font-semibold" style={{ color: MINT }}>VOTE&nbsp;ON&nbsp;VOICE</span>
                    <span className="inline-block">&nbsp;사회자를</span>{" "}
                    <span className="inline-block">이번 달 지정 예약하시면</span>
                  </p>
                  <p className="mt-1 text-[15px] font-bold tracking-wide break-keep" style={{ color: GOLD }}>
                    1만 원 할인
                    <span className="text-white/70 font-medium text-[13px]"> 혜택 제공</span>
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/40 break-keep">다른 이벤트와 중복 적용 가능 (SIGNATURE 등급 사회자는 제외)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/*
          블라인드 모드 매치 중에는 순위를 감춰야 하지만, 예전처럼 아예 언마운트(조건부 렌더링)하면
          결과 발표 순간(match→reveal) 배너가 다시 마운트되며 그만큼 레이아웃이 밀려나
          발표 카드로의 스크롤 위치 계산이 어긋나는 문제가 있었다(일반 모드는 배너가 매치 중에도
          계속 보여서 이 문제가 없었다). 항상 마운트해 높이를 그대로 차지하게 하고 보이기만
          invisible로 감추면, 발표 순간 레이아웃이 전혀 움직이지 않아 두 모드 모두 동일하게
          정교한 스크롤 포커싱이 된다.
        */}
        <div className={`mb-10 ${isBlind && phase === "match" ? "invisible" : ""}`} aria-hidden={isBlind && phase === "match"}>
          <VoiceKingBanner
            monthHearts={monthHearts}
            monthLabel={monthLabel}
            lastMonthChampion={lastMonthChampion}
            rankChange={rankChange}
            updatedAt={heartsUpdatedAt}
          />
        </div>

        {/*
          mode="wait"를 쓰면 매 선택마다 이전 카드가 완전히 사라진 뒤(문서 높이가 잠깐 0에 가까워짐)
          다음 카드가 마운트되면서, 브라우저가 스크롤 위치를 위로 당겨버리는 현상이 있었다.
          mode를 제거해 이전/다음 카드가 짧게 겹쳐서 전환되도록 하면 높이가 갑자기 줄지 않아
          "선택 버튼 클릭 시 스크롤이 위로 올라가는" 문제가 사라진다.
        */}
        <div ref={revealAreaRef} />
        <AnimatePresence initial={false}>
          {phase === "match" && contestantA && contestantB && roundSetup && (
            <motion.div key={`match-${roundIndex}-${matchIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, position: "absolute" }} style={{ width: "100%" }}>
              <div className="flex items-center justify-between mb-4 text-xs text-white/45">
                <span className="tracking-wide">{label}</span>
                <span>
                  대결 {matchIdx + 1} / {totalMatchesThisRound}
                </span>
              </div>
              {isPracticeRound && (
                <p className="text-center text-[12px] text-white/65 mb-3 -mt-1 break-keep">
                  오늘 투표는 이미 반영됐어요 · 지금부터는 연습 플레이예요 (전체 집계 미반영)
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 sm:gap-5 relative">
                <MatchCard
                  contestant={contestantA}
                  hearts={monthHearts[contestantA.name] || 0}
                  side="left"
                  onSelectWinner={() => selectWinner(contestantA.name)}
                  onHeart={() => manualHeart(contestantA.name)}
                  heartLocked={heartedThisGame.has(contestantA.name)}
                  blind={isBlind}
                />
                <MatchCard
                  contestant={contestantB}
                  hearts={monthHearts[contestantB.name] || 0}
                  side="right"
                  onSelectWinner={() => selectWinner(contestantB.name)}
                  onHeart={() => manualHeart(contestantB.name)}
                  heartLocked={heartedThisGame.has(contestantB.name)}
                  blind={isBlind}
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#d4b896] bg-[#0d0d0d] border border-[#d4b896]/40 rounded-full w-9 h-9 flex items-center justify-center">
                  VS
                </span>
              </div>
              <div className="text-center mt-5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto">
                <p className="text-[13px] text-white/70 leading-relaxed break-keep">
                  선택 시 해당 사회자에게 자동으로 하트가 하나씩 주어집니다.
                </p>
                <p className="text-[13px] text-[#ff9db0] leading-relaxed break-keep mt-1">
                  선택 못받은 사회자에게도 하트를 선물해 보세요 <span className="text-[#ff5c7a] font-semibold">♥</span>
                </p>
              </div>
            </motion.div>
          )}

          {phase === "reveal" && revealPool.length > 0 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-[11px] tracking-[0.25em] text-[#d4b896] uppercase mb-8 animate-pulse">
                결과 발표 중...
              </p>
              <div className="relative w-36 h-36 rounded-full overflow-hidden mx-auto ring-4 ring-[#d4b896]/40 shadow-[0_0_40px_rgba(212,184,150,0.35)]">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={revealIndex}
                    src={getContestant(revealPool[revealIndex])?.image}
                    alt=""
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.09 }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-8">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#d4b896]"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === "champion" && championData && (
            <motion.div
              key="champion"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative text-center rounded-2xl border border-[#d4b896]/30 bg-gradient-to-b from-[#d4b896]/10 to-transparent p-10 overflow-hidden"
            >
              {/* 항목③: 골드 스포트라이트 배경 - 은은하게 펄스 */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 15%, rgba(212,184,150,0.35), transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* 항목③: 왕관이 위에서 톡 떨어지듯 바운스 */}
              <motion.div
                initial={{ y: -120, opacity: 0, rotate: -15 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.9, delay: 0.05 }}
                className="relative z-10"
              >
                <Crown className="mx-auto mb-3 text-[#d4b896]" size={32} />
              </motion.div>
              <p className="relative z-10 text-[10px] tracking-[0.2em] text-[#d4b896] uppercase mb-4">이번 회차 챔피언</p>
              {/* 항목③: 우승자 사진 팝업(확대) 등장 */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.7, delay: 0.35 }}
                className="relative z-10 w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-[#d4b896]/50 shadow-[0_0_50px_rgba(212,184,150,0.45)]"
              >
                <img src={championData.image} alt={championData.name} className="w-full h-full object-cover object-top" />
              </motion.div>
              <h2 className="relative z-10 text-3xl font-semibold mb-2" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {championData.name}
              </h2>
              <p className="text-[13px] text-white/60 mb-1.5 break-keep">
                이번 회차에서 가장 많은 선택을 받은 사회자입니다.
              </p>
              <p className="text-sm text-white/55 max-w-sm mx-auto mb-4 break-keep">{championData.highlight}</p>

              {/* 진행 스타일 태그 - 실제 사회자 소개 문구에서 도출한 내용만 표시 */}
              {championData.styleTags?.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-sm mx-auto">
                  {championData.styleTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-[#d4b896] bg-[#d4b896]/10 border border-[#d4b896]/25 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 항목3+4: 사은품 + 긴급성 - 결과 확인 직후, 실제 존재하는 혜택만 사용해 즉시 전환 유도 */}
              <div className="relative max-w-sm mx-auto mb-6 text-left">
                <div className="rounded-2xl border border-[#f4e2b8]/30 bg-gradient-to-b from-[#f4e2b8]/10 to-transparent px-5 py-4">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Gift size={14} className="text-[#f4e2b8] shrink-0" />
                    <p className="text-[11px] font-bold tracking-wide text-[#f4e2b8]">예약 시 바로 드리는 혜택</p>
                  </div>
                  <ul className="space-y-1.5 mb-2.5">
                    <li className="flex items-start gap-2 text-[12.5px] text-white/80 leading-relaxed break-keep">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                      <span>예식 분위기에 맞는 BGM 100여 곡 큐레이션 <span className="text-[#f4e2b8] font-medium">(3만원 상당)</span></span>
                    </li>
                    <li className="flex items-start gap-2 text-[12.5px] text-white/80 leading-relaxed break-keep">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                      결혼식 준비 체크리스트 &amp; 웨딩가이드 자료 무료 제공
                    </li>
                    <li className="flex items-start gap-2 text-[12.5px] text-white/80 leading-relaxed break-keep">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                      모바일 청첩장 무료 제작
                    </li>
                    {championIsRealVov && (
                      <li className="flex items-start gap-2 text-[12.5px] text-white/80 leading-relaxed break-keep">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                        <span>이번 달 VOV 사회자 지정예약 <span className="text-[#f4e2b8] font-medium">1만원 추가 할인</span></span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* 사회자 프로필 자세히 보기 - 챔피언 소개 다음, 상담 버튼 전 단계 */}
              <button
                type="button"
                onClick={() => {
                  trackEvent("profile_view", championData.name);
                  setShowChampionProfile(true);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 text-white/75 text-[13px] font-medium hover:border-white/40 hover:text-white transition-colors mb-1.5"
              >
                <UserRound size={14} /> {championData.name} 사회자 프로필 자세히 보기
              </button>
              <p className="text-[10.5px] text-white/30 mb-5 break-keep">경력·진행 스타일 등 정보만 확인해요 (상담 신청 아님)</p>

              {/* 상담 CTA - 결과 확인 직후 바로 노출, 정보 확인용 버튼과 구분되도록 채워진 스타일+상담 문구로 액션 성격을 명확히 함 */}
              <a
                href="https://pf.kakao.com/_wxovaM/chat"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("consult_click", championData.name)}
                className="inline-flex items-center gap-1.5 px-8 py-3.5 rounded-full bg-[#5BB5A2] text-black text-sm font-bold hover:bg-[#6fc5b2] transition-colors shadow-[0_8px_24px_rgba(91,181,162,0.35)] mb-3"
              >
                <MessageCircle size={16} /> {championData.name} 사회자 예약 상담하기
              </a>
              <br />

              <div className="flex flex-col items-center gap-3 mb-6">
                {/* 항목4: 날짜만으로 예약 가능 여부를 먼저 확인하는 노터치 경로 (상담 신청 전 이탈 방지) */}
                <a
                  href="https://inusmc.co.kr/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("schedule_check_click", championData.name)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/55 hover:text-white/85 underline underline-offset-4 decoration-white/20 transition-colors"
                >
                  <CalendarSearch size={13} /> 우리 예식일에 예약 가능한지 먼저 확인하기 →
                </a>

                {/* 항목3: 실제 후기 규모를 채널별로 세분화해 신뢰 신호 제공 */}
                <p className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-white/45 max-w-xs mx-auto text-center break-keep">
                  <Star size={11} className="text-[#d4b896] shrink-0" />
                  <span>실제 고객 후기 2,700건+</span>
                  <span className="text-white/30">(숨고 804·후기게시판 582·블로그 979·스마트스토어 377)</span>
                </p>
              </div>

              <p className="text-xs text-white/55 mb-1.5 break-keep">
                {championData.name} 사회자는 이번 달 현재까지 총{" "}
                <span className="text-[#5BB5A2] font-medium">
                  {(monthHearts[championData.name] || 0).toLocaleString()}개
                </span>
                의 하트를 받았습니다.
              </p>
              {championMonthRank && (
                <p className="inline-flex items-center gap-1 text-[11px] text-[#d4b896] bg-[#d4b896]/10 border border-[#d4b896]/25 rounded-full px-3 py-1 mb-3">
                  <Medal size={11} /> {monthLabel} 월간 실시간 {championMonthRank}위
                </p>
              )}

              {/* 이번 회차 2~5위 미니 랭킹 - 챔피언 외 진출 라운드가 높은 순 */}
              {runnerUps.length > 0 && (
                <div className="mb-7">
                  <p className="text-[10px] tracking-[0.15em] text-white/35 uppercase mb-2.5">이번 회차 순위</p>
                  <div className="flex items-start justify-center gap-3 sm:gap-4 flex-wrap max-w-sm mx-auto">
                    {runnerUps.map((entry) => {
                      const data = getContestant(entry.name);
                      if (!data) return null;
                      return (
                        <div key={entry.name} className="flex flex-col items-center gap-1 w-14">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => { trackEvent("profile_view", data.name); setRunnerUpProfileUrl(data.profileUrl); }}
                              className="block w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/15"
                              aria-label={`${data.name} 프로필 보기`}
                            >
                              <img src={data.image} alt={data.name} className="w-full h-full object-cover object-top" />
                            </button>
                            <span className="absolute -bottom-1 -right-1 text-[9px] font-bold text-black bg-white/85 rounded-full w-5 h-5 flex items-center justify-center">
                              {entry.rank}
                            </span>
                            <button
                              type="button"
                              onClick={() => { trackEvent("profile_view", data.name); setRunnerUpProfileUrl(data.profileUrl); }}
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#5BB5A2] text-black flex items-center justify-center shadow-sm ring-1 ring-black/20"
                              aria-label={`${data.name} 프로필 자세히 보기`}
                            >
                              <UserRound size={11} />
                            </button>
                          </div>
                          <span className="text-[10.5px] text-white/60 truncate w-full text-center">{data.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VOV 결과 카드 - 세로형 이미지로 생성해 기기에 바로 저장 + 링크 공유(항목8) */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={handleSaveImage}
                  disabled={shareStatus === "loading"}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/15 text-white/60 text-[12px] font-medium hover:border-[#5BB5A2]/50 hover:text-white/85 transition-colors disabled:opacity-50"
                >
                  <Download size={13} />
                  {shareStatus === "loading" ? "이미지 만드는 중..." : "이미지 저장하기"}
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/15 text-white/60 text-[12px] font-medium hover:border-[#5BB5A2]/50 hover:text-white/85 transition-colors"
                >
                  <Share2 size={13} />
                  {linkShareStatus === "copied" ? "링크 복사됨!" : linkShareStatus === "opened" ? "공유 완료" : "링크 공유하기"}
                </button>
              </div>
              {shareStatus === "copied" && (
                <p className="text-[11px] text-[#5BB5A2] mb-1">
                  이미지 생성이 지원되지 않는 환경이라 결과 문구를 복사했어요.
                </p>
              )}
              {linkShareStatus === "error" && (
                <p className="text-[11px] text-white/40 mb-1">링크 공유가 지원되지 않는 환경이에요.</p>
              )}
              <p className="inline-flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium text-white/70 bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-2 mb-5 max-w-sm mx-auto text-center break-keep">
                <Camera size={13} className="text-[#5BB5A2] shrink-0" />
                저장이 잘 안 되면, 지금 화면을 캡처(스크린샷)해서 보관해주세요!
              </p>

              <div className="flex justify-center mb-8">
                <button
                  type="button"
                  onClick={() => setShowBenefits((v) => !v)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-[#d4b896]/40 text-[13px] font-medium text-[#f4e2b8] hover:bg-[#d4b896]/10 hover:border-[#d4b896]/60 tracking-wide whitespace-nowrap transition-colors"
                >
                  {showBenefits ? "▲ 프리미엄 혜택 접기" : "▼ 프리미엄 혜택 자세히 보기"}
                </button>
              </div>

              {/* 예약 혜택 프리미엄 카드 */}
              {showBenefits && (
              <div className="relative max-w-lg mx-auto mb-9 text-left">
                <div
                  className="absolute -inset-[1.5px] rounded-2xl opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #f4e2b8, #d4b896, #8a6d3b, #f4e2b8)",
                  }}
                />
                <div className="relative rounded-2xl bg-[#14110b] px-5 py-6 sm:px-7 sm:py-7 overflow-hidden">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle at 15% 0%, rgba(244,226,184,0.16) 0%, transparent 55%), radial-gradient(circle at 100% 100%, rgba(212,184,150,0.12) 0%, transparent 50%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 mb-5">
                      <span className="h-px w-6 bg-[#f4e2b8]/50" />
                      <Sparkles size={13} className="text-[#f4e2b8]" />
                      <p className="text-[10px] tracking-[0.25em] text-[#f4e2b8] uppercase font-semibold">
                        {championData.name} 사회자 예약 시 프리미엄 혜택
                      </p>
                      <Sparkles size={13} className="text-[#f4e2b8]" />
                      <span className="h-px w-6 bg-[#f4e2b8]/50" />
                    </div>

                    <div className="mb-5">
                      <p className="text-[11px] tracking-[0.15em] text-[#f4e2b8]/90 uppercase font-semibold mb-2.5">
                        공통 혜택
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          { text: "숨고 상담후기 작성 시 2만원 할인" },
                          { text: "결혼식 준비에 필요한 체크리스트 & 웨딩가이드(예식주간과 당일 안내 꿀팁) 자료 제공" },
                          { text: "이너스뮤직 365일 이벤트 자세히 보기 →", href: "https://blog.naver.com/inusmusics/220652958346" },
                          { text: "지인할인 적용 (코드번호 부여받을 시 1만원 할인)" },
                          { text: "MR 제공" },
                          { text: "MR 편집 & AR 편집" },
                          { text: "모바일청첩장 무료 제공 (예약고객에 한함)" },
                        ].map((item) => (
                          <li key={item.text} className="flex items-start gap-2 text-[13px] text-white/80 leading-relaxed break-keep">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#f4e2b8] hover:text-[#ffe9b8] underline underline-offset-2 decoration-[#f4e2b8]/40 transition-colors"
                              >
                                {item.text}
                              </a>
                            ) : (
                              item.text
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#f4e2b8]/25 to-transparent mb-5" />

                    <div>
                      <p className="text-[11px] tracking-[0.15em] text-[#f4e2b8]/90 uppercase font-semibold mb-2.5">
                        Wedding MC · 결혼식 사회자 예약 시 혜택
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          "두 사람의 이야기를 담은 맞춤형 대본 제작",
                          "예식 분위기에 맞는 BGM 100여 곡 제공",
                          "완성도 높은 혼인서약서 샘플 8종 제공",
                          "격식과 감성을 담은 성혼선언문 샘플 8종 제공",
                          "감동을 더하는 덕담 샘플 6종 제공",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[13px] text-white/80 leading-relaxed break-keep">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* 이너스뮤직 웨딩 이벤트 전문성 - 결과 화면 하단, 게임 흐름과 분리 */}
              <div className="max-w-lg mx-auto mb-9 text-left">
                <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase text-center mb-4">
                  INUSMUSIC Wedding Event
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Mic2, title: "전문 사회자", desc: "검증된 실력의 전문 사회자가 예식을 진행합니다." },
                    { icon: ListChecks, title: "맞춤 식순·연출", desc: "예식 분위기에 맞춘 식순과 이벤트 연출을 설계합니다." },
                    { icon: Music4, title: "축가·이벤트 구성", desc: "축가, 이벤트 등 웨딩 행사 전반을 함께 구성합니다." },
                    { icon: ShieldCheck, title: "현장 대응력", desc: "현장 진행은 물론 돌발상황에도 안정적으로 대응합니다." },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-4 flex flex-col gap-1.5"
                    >
                      <item.icon size={16} className="text-[#5BB5A2]" />
                      <span className="text-[12px] font-semibold text-white/85">{item.title}</span>
                      <span className="text-[11px] text-white/50 leading-relaxed break-keep">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-white/50 mb-2.5 tracking-wide">다시 도전할 모드를 선택해 주세요</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                <button
                  onClick={() => beginTournament(false)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:border-white/40 transition-colors"
                >
                  <RotateCcw size={14} /> 일반 모드로 다시 도전
                </button>
                <button
                  onClick={() => beginTournament(true)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:border-white/40 transition-colors"
                >
                  <RotateCcw size={14} /> 블라인드 모드로 다시 도전
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}

      {showChampionProfile && championData && (
        <ProfileModal url={championData.profileUrl} onClose={() => setShowChampionProfile(false)} />
      )}

      {runnerUpProfileUrl && (
        <ProfileModal url={runnerUpProfileUrl} onClose={() => setRunnerUpProfileUrl(null)} />
      )}
    </div>
  );
}
