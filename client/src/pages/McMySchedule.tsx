import { useState } from "react";
import { CalendarDays, Clock3, LockKeyhole, MapPin, Music2, ShieldCheck, UserRound } from "lucide-react";

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
  "임원빈", "장윤태", "최윤아",
];

function formatDate(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateText;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

export default function McMySchedule() {
  const [mcName, setMcName] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScheduleResponse | null>(null);

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

  const reset = () => {
    setResult(null);
    setPin("");
    setError("");
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
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-100"><UserRound size={16} className="text-[#74dfcc]" /> 사회자 이름</span>
                <select value={mcName} onChange={(event) => setMcName(event.target.value)} className="h-14 w-full rounded-xl border border-white/15 bg-[#10283a] px-4 text-base font-semibold text-white outline-none transition focus:border-[#70ddca] focus:ring-2 focus:ring-[#70ddca]/25" aria-label="사회자 이름 선택">
                  <option value="" className="text-slate-700">이름을 선택해주세요</option>
                  {EMCEE_NAMES.map((name) => <option key={name} value={name} className="text-slate-900">{name}</option>)}
                </select>
              </label>

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
            <div className="mb-7 flex flex-col gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#70ddca]">MY WEDDING SCHEDULE</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight"><span className="text-[#7ce4d2]">{result.mc_name}</span> 사회자님의 예정 일정</h2>
                <p className="mt-2 text-sm text-slate-300">오늘 이후 배정된 예식 일정입니다.</p>
              </div>
              <button type="button" onClick={reset} className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-[#70ddca] hover:text-[#83e7d6]">다시 조회</button>
            </div>

            {!result.items?.length ? (
              <div className="rounded-3xl border border-white/12 bg-white/[0.04] px-6 py-18 text-center">
                <Music2 className="mx-auto text-[#62ceb9]" size={38} />
                <h3 className="mt-4 text-xl font-bold">예정된 배정 일정이 없습니다.</h3>
                <p className="mt-2 text-sm text-slate-400">새로운 일정이 배정되면 이곳에서 확인할 수 있습니다.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
                <div className="border-b border-white/12 bg-[#0d2938] px-5 py-4 text-sm font-bold text-[#91eadb]">총 {result.items.length}건의 예정 일정</div>
                <div className="divide-y divide-white/10">
                  {result.items.map((item, index) => (
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
