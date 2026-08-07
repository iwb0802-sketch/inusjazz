/**
 * 사회자 스케줄 현황 페이지
 * /schedule 경로로 접근
 */
import { useState, useEffect } from "react";

const API_URL = "/api/schedule";

const ALL_EMCEES = [
  "고승범","구한림","김민수","길상우","김범태","김선혁","김성환","문학진",
  "민준호","박진영","이우영","장윤태","석재선","이도영","이도건","심비성",
  "김태우","김한솔","강동우","김민중","최윤아","임원빈"
];

const MC_PROFILES: Record<string, { tier: string; img: string; url: string }> = {
  "김민수":  { tier: "BEST",     img: "/images/mc-profile-1_33531819.jpg",         url: "https://blog.naver.com/inusmusics/223996383838" },
  "고승범":  { tier: "BEST",     img: "/images/mc-profile-4_a9e52880.jpg",         url: "https://blog.naver.com/inusmusics/223235771542" },
  "이도영":  { tier: "BEST",     img: "/images/mc-profile-2_f194877b.jpg",         url: "https://blog.naver.com/inusmusics/223845891681" },
  "석재선":  { tier: "PREMIUM",  img: "/images/mc-profile-3_33ff7a32.jpg",         url: "https://blog.naver.com/inusmusics/223822182933" },
  "이우영":  { tier: "PREMIUM",  img: "/images/mc-lee-wooyoung-new_fa27e84d.webp", url: "/profile-wooyoung.html" },
  "김선혁":  { tier: "BEST",     img: "/images/host_sunhyuk_1ed704ab.jpg",         url: "https://blog.naver.com/inusmusics/221025505211" },
  "장윤태":  { tier: "PREMIUM",  img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg", url: "https://blog.naver.com/inusmusics/223246261228" },
  "길상우":  { tier: "BEST",     img: "/images/mc-gilsangwoo.jpg",                 url: "https://blog.naver.com/inusmusics/220802942529" },
  "최윤아":  { tier: "PREMIUM",  img: "",                                           url: "https://blog.naver.com/inusmusics/224327229799" },
  "민준호":  { tier: "PREMIUM",  img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "심비성":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "이도건":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "김범태":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "김태우":  { tier: "BEST",     img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "구한림":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "김성환":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "문학진":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "박진영":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "김한솔":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "강동우":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "김민중":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
  "임원빈":  { tier: "STANDARD", img: "",                                           url: "https://www.inusmc.co.kr/#mc" },
};

function parseTimeToMin(t: string): number {
  const m = t.match(/(\d+)\s*시\s*(\d+)?/);
  if (m) {
    let h = parseInt(m[1]);
    const min = m[2] ? parseInt(m[2]) : 0;
    if (h >= 1 && h <= 7) h += 12;
    return h * 60 + min;
  }
  return 9999;
}

function getSlotLabel(key: string) {
  if (key === "am") return "오전 11~2시";
  if (key === "pm1") return "오후 2~4시";
  return "오후 4~7시";
}

function getAssignedMap(slots: Record<string, any[]>) {
  const map: Record<string, number[]> = {};
  ["am","pm1","pm2","other"].forEach(k => {
    (slots[k] || []).forEach((item: any) => {
      if (item.assigned && item.mc_name !== "미지정") {
        if (!map[item.mc_name]) map[item.mc_name] = [];
        map[item.mc_name].push(parseTimeToMin(item.time));
      }
    });
  });
  return map;
}

function getAvailableMcs(slotKey: string, assignedMap: Record<string, number[]>) {
  const slotMids: Record<string, number> = { am: 750, pm1: 900, pm2: 1050 };
  const mid = slotMids[slotKey] || 750;
  return ALL_EMCEES.filter(name => {
    const times = assignedMap[name] || [];
    return !times.some(t => Math.abs(t - mid) <= 150);
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["일","월","화","수","목","금","토"];
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default function Schedule() {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const [date, setDate] = useState(defaultDate);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("am");

  const search = async () => {
    if (!date) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`${API_URL}?date=${date}`);
      const json = await res.json();
      if (json.code !== 1) { setError(json.message || "조회 실패"); }
      else { setData(json); setActiveTab("am"); }
    } catch {
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const tierColor = (tier: string) => {
    if (tier === "PREMIUM") return { bg: "rgba(212,184,150,0.15)", color: "#d4b896", border: "1px solid rgba(212,184,150,0.3)" };
    if (tier === "BEST") return { bg: "rgba(91,181,162,0.15)", color: "#5BB5A2", border: "1px solid rgba(91,181,162,0.3)" };
    return { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" };
  };

  return (
    <div style={{ fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif", background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", minHeight: "100vh", color: "#fff", padding: "20px 16px 60px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ textAlign: "center", padding: "32px 0 28px" }}>
          <div style={{ fontSize: 12, letterSpacing: 3, color: "#a78bfa", fontWeight: 600, marginBottom: 10 }}>INUS MUSIC</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 8 }}>사회자 스케줄 현황</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>예식 날짜를 선택하면 해당 날짜에<br/>배정된 사회자 현황을 확인할 수 있습니다.</p>
        </div>

        {/* 날짜 검색 */}
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, marginBottom: 24, border: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10, fontWeight: 600 }}>📅 예식 날짜 선택</div>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              style={{ flex: 1, height: 48, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 16, padding: "0 14px", fontFamily: "inherit", outline: "none" }} />
            <button onClick={search}
              style={{ height: 48, padding: "0 24px", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              조회
            </button>
          </div>
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(167,139,250,0.3)", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <div>조회 중...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* 에러 */}
        {error && <div style={{ textAlign: "center", padding: "20px", color: "#f87171" }}>⚠️ {error}</div>}

        {/* 초기 안내 */}
        {!loading && !data && !error && (
          <div style={{ textAlign: "center", padding: "32px 20px", color: "#64748b" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎤</div>
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>날짜를 선택하고 조회 버튼을 누르면<br/>해당 날짜에 배정된 사회자 현황을<br/>시간대별로 확인할 수 있습니다.</div>
          </div>
        )}

        {/* 결과 */}
        {data && (
          <div>
            <div style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: "#e2e8f0", marginBottom: 16, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
              <span style={{ color: "#a78bfa" }}>{formatDate(data.date)}</span> 사회자 현황
            </div>

            {/* 탭 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["am","pm1","pm2"].map(key => (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{ flex: 1, height: 48, background: activeTab===key ? "linear-gradient(135deg,#7c3aed,#a78bfa)" : "rgba(255,255,255,0.07)", border: activeTab===key ? "none" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 10, color: activeTab===key ? "#fff" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4 }}>
                  {getSlotLabel(key)}<br/>
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: "1px 6px" }}>{(data.slots[key]||[]).length}건</span>
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            {["am","pm1","pm2"].map(key => activeTab !== key ? null : (
              <div key={key}>
                {/* 예약 현황 */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: 1, marginBottom: 10, paddingLeft: 4 }}>📋 예약 현황</div>
                {(data.slots[key]||[]).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 20px", color: "#64748b", fontSize: 13 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>이 시간대에 배정된 사회자가 없습니다.
                  </div>
                ) : (data.slots[key]||[]).map((item: any, i: number) => (
                  <div key={i} style={{ background: item.assigned ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.07)", border: item.assigned ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: item.assigned ? "linear-gradient(135deg,#dc2626,#ef4444)" : "rgba(148,163,184,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: item.assigned ? "#fff" : "#64748b", flexShrink: 0 }}>
                      {item.assigned ? item.mc_name.charAt(0) : "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: item.assigned ? "#f1f5f9" : "#64748b", fontStyle: item.assigned ? "normal" : "italic" }}>{item.mc_name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, background: item.assigned ? "#dc2626" : "rgba(148,163,184,0.2)", color: item.assigned ? "#fff" : "#64748b", padding: "2px 7px", borderRadius: 20 }}>{item.assigned ? "배정완료" : "미지정"}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        <span style={{ color: "#a78bfa", fontWeight: 600 }}>{item.time}</span> · {item.place}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 추천 사회자 */}
                <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 4 }}>✨ 이 시간대 가능한 사회자</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 14 }}>앞뒤 2시간 30분 이내 다른 예식이 없는 사회자입니다.</div>
                  {(() => {
                    const assignedMap = getAssignedMap(data.slots);
                    const available = getAvailableMcs(key, assignedMap);
                    if (available.length === 0) return <div style={{ padding: 16, textAlign: "center", color: "#64748b", fontSize: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>이 시간대에 가능한 사회자가 없습니다.</div>;
                    return (
                      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
                        {available.map(name => {
                          const p = MC_PROFILES[name] || { tier: "STANDARD", img: "", url: "https://www.inusmc.co.kr/#mc" };
                          const tc = tierColor(p.tier);
                          return (
                            <a key={name} href={p.url} target="_blank" rel="noopener noreferrer"
                              style={{ flexShrink: 0, width: 120, scrollSnapAlign: "start", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block" }}>
                              {p.img ? (
                                <img src={p.img} alt={name} style={{ width: "100%", height: 130, objectFit: "cover", objectPosition: "top", display: "block" }}
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              ) : (
                                <div style={{ width: "100%", height: 130, background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(167,139,250,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#a78bfa" }}>{name.charAt(0)}</div>
                              )}
                              <div style={{ padding: "10px 10px 12px" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{name}</div>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: tc.bg, color: tc.color, border: tc.border }}>{p.tier}</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}

            {/* 안내 */}
            <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.18)", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#c4b5fd", lineHeight: 1.7, marginTop: 16 }}>
              💡 <strong>빨간색으로 표시된 사회자</strong>는 해당 시간대에 이미 예약이 완료된 사회자입니다.<br/>
              아래 추천 목록에서 가능한 사회자를 확인하고 문의해 주세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
