import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Clock3, LockKeyhole, MapPin, Music2, ShieldCheck, UserRound } from "lucide-react";

type ScheduleItem = {
  date: string;
  time: string;
  venue: string;
  arrangement: string;
};

type ScheduleResponse = {
  code: number;
  message?: string;
  mc_name?: string;
  items?: ScheduleItem[];
};

// 활동 사회자용 본인 확인 목록입니다. 비밀번호는 서버의 연락처 DB로 확인합니다.
const EMCEE_NAMES = [
  "강동우", "고승범", "구한림", "김민수", "김범태", "김선혁", "김태우", "김한솔", "김민중",
  "길상우", "민준호", "석재선", "손진욱", "심비성", "이도건", "이도영", "이우영",
  "장윤태", "최윤아",
];

function formatDate(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateText;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

export default function McMySchedule() {
  const [mcName, setMcName] = useState("");
  const [isNameMenuOpen, setIsNameMenuOpen] = useState(false);
  const nameMenuAnchorRef = useRef<HTMLDivElement>(null);
  const nameMenuPanelRef = useRef<HTMLDivElement>(null);
  const [nameMenuPosition, setNameMenuPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 0 });
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScheduleResponse | null>(null);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [appliedDateStart, setAppliedDateStart] = useState("");
  const [appliedDateEnd, setAppliedDateEnd] = useState("");

  function updateNameMenuPosition() {
    if (!nameMenuAnchorRef.current) return;
    const rect = nameMenuAnchorRef.current.getBoundingClientRect();
    const visualViewport = window.visualViewport;
    const viewportTop = visualViewport?.offsetTop || 0;
    const viewportHeight = visualViewport?.height || window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const edge = 12;
    const availableBelow = Math.max(0, viewportBottom - rect.bottom - edge);
    const availableAbove = Math.max(0, rect.top - viewportTop - edge);
    const preferredHeight = Math.min(520, Math.max(280, viewportHeight - edge * 2));
    const openUpward = availableBelow < 260 && availableAbove > availableBelow;
    const availableHeight = openUpward ? availableAbove : availableBelow;
    const maxHeight = Math.min(preferredHeight, Math.max(190, availableHeight));
    const top = openUpward ? Math.max(viewportTop + edge, rect.top - maxHeight - 8) : rect.bottom + 8;
    const maxLeft = Math.max(edge, window.innerWidth - rect.width - edge);
    const left = Math.min(Math.max(edge, rect.left), maxLeft);
    setNameMenuPosition({ left, top, width: rect.width, maxHeight });
  }

  function toggleNameMenu() {
    if (!isNameMenuOpen) updateNameMenuPosition();
    setIsNameMenuOpen((open) => !open);
  }

  useEffect(() => {
    if (!isNameMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideAnchor = nameMenuAnchorRef.current?.contains(target);
      const insidePanel = nameMenuPanelRef.current?.contains(target);
      if (!insideAnchor && !insidePanel) setIsNameMenuOpen(false);
    };
    const visualViewport = window.visualViewport;
    window.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("resize", updateNameMenuPosition);
    window.addEventListener("scroll", updateNameMenuPosition, true);
    visualViewport?.addEventListener("resize", updateNameMenuPosition);
    visualViewport?.addEventListener("scroll", updateNameMenuPosition);
    return () => {
      window.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("resize", updateNameMenuPosition);
      window.removeEventListener("scroll", updateNameMenuPosition, true);
      visualViewport?.removeEventListener("resize", updateNameMenuPosition);
      visualViewport?.removeEventListener("scroll", updateNameMenuPosition);
    };
  }, [isNameMenuOpen]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mcName || !/^\d{4}$/.test(pin)) {
      setError("이름을 선택하고 휴대폰 번호 뒷자리 4자리를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/mc-my-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcName, pin }),
      });
      const data = (await response.json()) as ScheduleResponse;
      if (!response.ok || data.code !== 1) throw new Error(data.message || "일정을 불러오지 못했습니다.");
      setResult(data);
      setPin("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = (result?.items || []).filter((item) => {
    const afterStart = !appliedDateStart || item.date >= appliedDateStart;
    const beforeEnd = !appliedDateEnd || item.date <= appliedDateEnd;
    return afterStart && beforeEnd;
  });

  const applyDateFilter = () => {
    if (dateStart && dateEnd && dateStart > dateEnd) {
      setError("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }
    setError("");
    setAppliedDateStart(dateStart);
    setAppliedDateEnd(dateEnd);
  };

  const clearDateFilter = () => {
    setDateStart("");
    setDateEnd("");
    setAppliedDateStart("");
    setAppliedDateEnd("");
    setError("");
  };

  const reset = () => {
    setResult(null);
    setPin("");
    setError("");
    clearDateFilter();
  };

  return (
    <div className="min-h-screen bg-[#071624] text-white">
      <header className="border-b border-white/10 bg-[#0c1d2f]">
        <div className="mx-auto flex min-h-[74px] max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="/" className="text-sm font-bold text-[#7be2d0] transition hover:text-white">← 메인으로</a>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#6ed1c0]">INUS MUSIC</p>
            <h1 className="mt-1 text-base font-extrabold sm:text-lg">사회자 스케줄 확인</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
        {!result ? (
          <section className="mx-auto max-w-xl overflow-hidden rounded-[28px] border border-[#65d4c0]/30 bg-white/[0.04] shadow-2xl shadow-black/20">
            <div className="border-b border-[#65d4c0]/25 bg-[#0d2938] px-6 py-7 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-[#55cbb5]/15 p-3 text-[#78e3d0]"><CalendarDays size={25} /></div>
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#70ddca]">MY WEDDING SCHEDULE</p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight">나의 예정 일정</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">본인 확인 후 오늘 이후 배정된 예식 일정을 확인할 수 있습니다.</p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-5 px-6 py-7 sm:px-8 sm:py-8">
              <div ref={nameMenuAnchorRef}>
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-100"><UserRound size={16} className="text-[#74dfcc]" /> 사회자 이름</span>
                <button type="button" onClick={toggleNameMenu} aria-haspopup="listbox" aria-expanded={isNameMenuOpen} className="flex h-14 w-full items-center justify-between rounded-xl border border-white/15 bg-[#10283a] px-4 text-left text-base font-semibold text-white outline-none transition hover:border-[#70ddca]/65 focus:border-[#70ddca] focus:ring-2 focus:ring-[#70ddca]/25">
                  <span className={mcName ? "text-white" : "text-slate-300"}>{mcName || "이름을 선택해주세요"}</span>
                  <ChevronDown size={20} className={`shrink-0 text-[#88e8d7] transition ${isNameMenuOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              {isNameMenuOpen && (
                <div ref={nameMenuPanelRef} role="listbox" style={{ left: nameMenuPosition.left, top: nameMenuPosition.top, width: nameMenuPosition.width, maxHeight: nameMenuPosition.maxHeight || "calc(100dvh - 24px)", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }} className="fixed z-[100] grid grid-cols-2 gap-1.5 overflow-y-scroll rounded-xl border border-[#75dac9]/70 bg-[#14354a] p-1.5 shadow-2xl shadow-black/70 sm:grid-cols-3">
                  {EMCEE_NAMES.map((name) => (
                    <button key={name} type="button" role="option" aria-selected={mcName === name} onClick={() => { setMcName(name); setIsNameMenuOpen(false); setError(""); }} className={`min-h-[42px] w-full rounded-lg px-3 py-2 text-left text-[15px] font-bold leading-5 transition ${mcName === name ? "bg-[#55cdb8] text-[#07202a]" : "text-white hover:bg-white/15 hover:text-[#a4f1e3]"}`}>
                      {name}
                    </button>
                  ))}
                </div>
              )}

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-100"><LockKeyhole size={16} className="text-[#74dfcc]" /> 휴대폰 뒷자리 또는 관리자 번호</span>
                <input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" pattern="[0-9]{4}" autoComplete="one-time-code" maxLength={4} placeholder="숫자 4자리" className="h-14 w-full rounded-xl border border-white/15 bg-[#10283a] px-4 text-base font-semibold tracking-[0.28em] text-white outline-none transition placeholder:tracking-normal placeholder:text-slate-500 focus:border-[#70ddca] focus:ring-2 focus:ring-[#70ddca]/25" />
              </label>

              {error && <p role="alert" className="rounded-xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-medium leading-6 text-rose-200">{error}</p>}

              <button disabled={loading} type="submit" className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#53cdb7] text-base font-extrabold text-[#07202a] shadow-lg shadow-[#2fae99]/20 transition hover:bg-[#7ae1ce] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60">
                <ShieldCheck size={19} />{loading ? "본인 확인 및 조회 중..." : "내 일정 확인"}
              </button>

              <p className="flex items-start gap-2 text-xs leading-5 text-slate-400"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-[#6dccbd]" />사회자는 등록된 휴대폰 번호 뒷자리로 확인합니다. 관리자는 통합 비밀번호로 어느 사회자 일정이든 조회할 수 있습니다. 고객 성명과 연락처는 표시되지 않습니다.</p>
            </form>
          </section>
        ) : (
          <section>
            <div className="mb-7 flex flex-col gap-5 border-b border-white/15 pb-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#70ddca]">MY WEDDING SCHEDULE</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight"><span className="text-[#7ce4d2]">{result.mc_name}</span> 사회자님의 예정 일정</h2>
                <p className="mt-2 text-sm text-slate-300">오늘 이후 배정된 예식 일정입니다.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-slate-300">시작일
                    <input type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-white/15 bg-[#10283a] px-2 text-sm font-semibold text-white outline-none transition focus:border-[#70ddca]" />
                  </label>
                  <label className="block text-xs font-bold text-slate-300">종료일
                    <input type="date" value={dateEnd} onChange={(event) => setDateEnd(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-white/15 bg-[#10283a] px-2 text-sm font-semibold text-white outline-none transition focus:border-[#70ddca]" />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={applyDateFilter} className="h-10 whitespace-nowrap rounded-lg bg-[#53cdb7] px-3 text-sm font-extrabold text-[#07202a] transition hover:bg-[#7ae1ce]">기간 조회</button>
                  {(appliedDateStart || appliedDateEnd) && <button type="button" onClick={clearDateFilter} className="h-10 whitespace-nowrap rounded-lg border border-white/25 px-3 text-sm font-bold text-slate-200 transition hover:border-[#70ddca] hover:text-[#83e7d6]">전체</button>}
                  <button type="button" onClick={reset} className="h-10 whitespace-nowrap rounded-lg border border-white/25 px-3 text-sm font-bold text-slate-200 transition hover:border-[#70ddca] hover:text-[#83e7d6]">다시 조회</button>
                </div>
              </div>
            </div>

            {error && <p role="alert" className="mb-5 rounded-xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-medium leading-6 text-rose-200">{error}</p>}

            {!filteredItems.length ? (
              <div className="rounded-3xl border border-white/12 bg-white/[0.04] px-6 py-18 text-center">
                <Music2 className="mx-auto text-[#62ceb9]" size={38} />
                <h3 className="mt-4 text-xl font-bold">{appliedDateStart || appliedDateEnd ? "선택한 기간에 예정된 일정이 없습니다." : "예정된 배정 일정이 없습니다."}</h3>
                <p className="mt-2 text-sm text-slate-400">{appliedDateStart || appliedDateEnd ? "기간을 변경하거나 전체 보기를 눌러 다시 확인해주세요." : "새로운 일정이 배정되면 이곳에서 확인할 수 있습니다."}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
                <div className="border-b border-white/12 bg-[#0d2938] px-5 py-4 text-sm font-bold text-[#91eadb]">{appliedDateStart || appliedDateEnd ? "선택 기간 " : "총 "}{filteredItems.length}건의 예정 일정</div>
                <div className="divide-y divide-white/10">
                  {filteredItems.map((item, index) => (
                    <article key={`${item.date}-${item.time}-${index}`} className="grid gap-4 px-5 py-5 sm:grid-cols-[180px_1fr] sm:px-7">
                      <div>
                        <p className="font-extrabold text-[#8be9d8]">{formatDate(item.date)}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white"><Clock3 size={15} className="text-[#72d9c7]" /> {item.time || "시간 확인 중"}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-base font-bold text-white"><MapPin size={16} className="shrink-0 text-[#72d9c7]" /> <span className="break-words">{item.venue || "장소 확인 중"}</span></p>
                        {item.arrangement && <p className="mt-2 break-words text-sm leading-6 text-slate-300">{item.arrangement}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-400"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-[#6dccbd]" />조회 화면에는 고객 성명·연락처가 포함되지 않으며, 본인 배정 행사만 표시됩니다.</p>
          </section>
        )}
      </main>
    </div>
  );
}
