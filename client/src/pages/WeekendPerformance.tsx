import { useEffect, useState } from "react";

const API_URL = "/api/performance-schedule";

const C = {
  bg: "#0B1426", card: "#172236", cardBorder: "#29364B",
  text: "#F3F7FA", textSub: "#A9B5C6", textMuted: "#748196",
  mint: "#5BB5A2", mintLight: "rgba(91,181,162,0.14)", mintBorder: "rgba(91,181,162,0.42)",
};

type EventItem = {
  time: string;
  region: string;
  bride_name: string;
  arrangement: string;
};

type DayItem = {
  date: string;
  weekday: string;
  events: EventItem[];
};

type WeekData = {
  code: number;
  message?: string;
  week_start: string;
  week_end: string;
  days: DayItem[];
};

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(date: string, amount: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + amount);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function prettyDate(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function WeekendPerformance() {
  const [date, setDate] = useState(todayString());
  const [data, setData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!date) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}?date=${encodeURIComponent(date)}&exclude_mc=1`);
      const json = await res.json();
      if (json.code !== 1) throw new Error(json.message || "조회에 실패했습니다.");
      setData(json);
    } catch (e: any) {
      setData(null);
      setError(e?.message || "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const moveWeek = (amount: number) => {
    const next = addDays(date, amount);
    setDate(next);
    setTimeout(() => {
      const button = document.getElementById("weekend-performance-search-button");
      if (button) button.click();
    }, 0);
  };

  useEffect(() => {
    // 새 페이지는 접속 시 현재 주의 사회 제외 연주 편성을 바로 표시한다.
    search();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif", paddingBottom: 84, overflowX: "hidden" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", minHeight: 60, padding: "10px 16px", background: "rgba(11,20,38,0.94)", borderBottom: `1px solid ${C.cardBorder}`, backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ flexShrink: 0, padding: "7px 10px", borderRadius: 8, color: C.mint, background: C.mintLight, border: `1px solid ${C.mintBorder}`, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>← 메인</a>
        <div style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 800 }}>주말 연주 편성</div>
        <div style={{ width: 56 }} />
      </header>

      <main style={{ width: "100%", maxWidth: 720, margin: "0 auto", padding: "18px 14px 40px" }}>
        <div style={{ marginBottom: 22 }}>
          <a href="/weekend-performance" style={{ display: "block", textDecoration: "none", textAlign: "center", padding: "11px 8px", color: "#fff", background: `linear-gradient(135deg,#3D9E8C,${C.mint})`, borderRadius: 10, fontSize: 13, fontWeight: 800 }}>주말 연주 편성</a>
        </div>

        <section style={{ textAlign: "center", padding: "10px 10px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: C.mint, marginBottom: 9 }}>INUS MUSIC</div>
          <h1 style={{ margin: 0, fontSize: 22, lineHeight: 1.4 }}>주말 연주 편성</h1>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: C.textSub, lineHeight: 1.65 }}>사회 진행이 포함된 예식은 제외하고<br/>주말 연주 편성만 확인할 수 있습니다.</p>
        </section>

        <section style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 16, marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: C.textSub, fontWeight: 700, marginBottom: 9 }}>📅 기준 날짜 선택</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} style={{ minWidth: 0, flex: 1, height: 46, padding: "0 11px", borderRadius: 10, color: C.text, background: "rgba(255,255,255,0.07)", border: `1px solid ${C.cardBorder}`, outline: "none", fontSize: 15, fontFamily: "inherit" }} />
            <button id="weekend-performance-search-button" onClick={search} style={{ flexShrink: 0, height: 46, padding: "0 20px", color: "#fff", background: `linear-gradient(135deg,#3D9E8C,${C.mint})`, border: 0, borderRadius: 10, cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 800 }}>조회</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 10 }}>
            <button onClick={() => moveWeek(-7)} style={weekButtonStyle}>◀ 이전 주</button>
            <button onClick={() => { setDate(todayString()); setTimeout(() => { const b = document.getElementById("weekend-performance-search-button"); if (b) b.click(); }, 0); }} style={weekButtonStyle}>이번 주</button>
            <button onClick={() => moveWeek(7)} style={weekButtonStyle}>다음 주 ▶</button>
          </div>
        </section>

        {loading && <Loading />}
        {error && <ErrorView message={error} retry={search} />}
        {!loading && !data && !error && (
          <div style={{ padding: "36px 18px", textAlign: "center", color: C.textMuted, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, fontSize: 13, lineHeight: 1.75 }}>
            기준 주를 선택한 뒤 조회하면<br/>토요일·일요일 주요 연주 사례를 표시합니다.
          </div>
        )}

        {data && (
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "13px 14px", marginBottom: 12, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}><b style={{ color: C.mint }}>토요일 · 일요일</b> 연주 편성</span>
              <span style={{ flexShrink: 0, padding: "3px 8px", borderRadius: 20, color: C.mint, background: C.mintLight, fontSize: 11, fontWeight: 800 }}>사회 제외</span>
            </div>
            <div style={{ margin: "0 2px 12px", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.mintBorder}`, background: C.mintLight, color: C.textSub, fontSize: 11, lineHeight: 1.65 }}>
              ※ 사회 진행이 포함된 행사를 제외한 토요일·일요일 연주편성입니다. 장소는 지역 단위로, 신부 이름은 개인정보 보호를 위해 일부 마스킹하여 표시됩니다.
            </div>
            {data.days.map(day => <DayCard key={day.date} day={day} />)}
          </section>
        )}
      </main>
    </div>
  );
}

const weekButtonStyle: React.CSSProperties = {
  height: 34, borderRadius: 8, border: `1px solid ${C.cardBorder}`, background: "rgba(255,255,255,0.04)", color: C.textSub, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700
};

function Loading() {
  return <div style={{ padding: 44, textAlign: "center", color: C.textSub }}><div style={{ width: 34, height: 34, margin: "0 auto 12px", borderRadius: "50%", border: `3px solid ${C.mintLight}`, borderTopColor: C.mint, animation: "performance-spin .8s linear infinite" }} /><div style={{ fontSize: 13 }}>주간 일정 조회 중...</div><style>{"@keyframes performance-spin{to{transform:rotate(360deg)}}"}</style></div>;
}

function ErrorView({ message, retry }: { message: string; retry: () => void }) {
  return <div style={{ padding: "28px 18px", textAlign: "center", borderRadius: 14, border: "1px solid rgba(248,113,113,.35)", background: "rgba(239,68,68,.08)" }}><div style={{ color: "#FCA5A5", fontSize: 13, marginBottom: 13 }}>⚠️ {message}</div><button onClick={retry} style={{ padding: "9px 18px", border: 0, borderRadius: 8, background: C.mint, color: "#fff", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>다시 시도</button></div>;
}

function DayCard({ day }: { day: DayItem }) {
  const isWeekend = day.weekday === "토" || day.weekday === "일";
  const dayColor = day.weekday === "일" ? "#FCA5A5" : day.weekday === "토" ? "#93C5FD" : C.mint;
  return <article style={{ overflow: "hidden", marginBottom: 12, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: isWeekend ? "rgba(255,255,255,.035)" : "rgba(91,181,162,.055)", borderBottom: `1px solid ${C.cardBorder}` }}>
      <div><span style={{ fontSize: 15, fontWeight: 800 }}>{day.weekday === "토" ? "토요일" : "일요일"}</span><span style={{ marginLeft: 6, fontSize: 12, color: dayColor, fontWeight: 800 }}>주요 편성</span></div>
      <span style={{ padding: "3px 8px", borderRadius: 20, color: C.textSub, background: "rgba(255,255,255,.07)", fontSize: 11, fontWeight: 700 }}>{day.events.length}건</span>
    </div>
    {day.events.length === 0 ? <div style={{ padding: "20px 14px", textAlign: "center", color: C.textMuted, fontSize: 12 }}>등록된 연주 일정이 없습니다.</div> : <div>{day.events.map((event, index) => <EventRow key={`${event.time}-${index}`} event={event} />)}</div>}
  </article>;
}

function EventRow({ event }: { event: EventItem }) {
  return <div style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr)", gap: 10, padding: "13px 14px", borderBottom: `1px solid rgba(255,255,255,.06)` }}>
    <div style={{ alignSelf: "start", textAlign: "center", padding: "7px 4px", color: C.mint, background: C.mintLight, border: `1px solid ${C.mintBorder}`, borderRadius: 8, fontSize: 12, fontWeight: 800, lineHeight: 1.35 }}>{event.time}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 7 }}>
        <span style={{ color: C.text, fontSize: 13, fontWeight: 800 }}>📍 {event.region}</span>
        <span style={{ color: C.textSub, fontSize: 12 }}>신부 {event.bride_name}</span>
      </div>
      <div style={{ color: C.textSub, fontSize: 12, lineHeight: 1.55, wordBreak: "keep-all" }}><b style={{ color: C.mint, marginRight: 5 }}>연주편성</b>{event.arrangement || "연주편성 확인 중"}</div>
    </div>
  </div>;
}
