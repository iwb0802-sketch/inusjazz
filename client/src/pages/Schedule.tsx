/**
 * 사회자 스케줄 현황 페이지 - /schedule
 */
import { useState, useRef } from "react";

const API_URL = "/api/schedule";

// 활동 사회자 명단 (구한림, 김성환 제외)
const ALL_EMCEES = [
  "고승범","김민수","길상우","김범태","김선혁",
  "민준호","이우영","장윤태","석재선","이도영","이도건","심비성",
  "김태우","최윤아"
];

type Tier = "PREMIUM" | "BEST" | "STANDARD";
interface McProfile {
  name: string; tier: Tier; tierOrder: number;
  img: string; url: string; desc: string; audio: string;
}

const MC_PROFILES: McProfile[] = [
  { name:"석재선",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-profile-3_33ff7a32.jpg",         url:"https://blog.naver.com/inusmusics/223822182933", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-jaesun.mp3" },
  { name:"이우영",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-lee-wooyoung-new_fa27e84d.webp", url:"/profile-wooyoung.html",                         desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-wooyoung.mp3" },
  { name:"장윤태",  tier:"PREMIUM",  tierOrder:1, img:"https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg", url:"https://blog.naver.com/inusmusics/223246261228", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-yuntae.mp3" },
  { name:"최윤아",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-yuna.jpg",                       url:"https://blog.naver.com/inusmusics/224327229799", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-yoona.mp3" },
  { name:"민준호",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-minjunho.webp", url:"https://www.inusmc.co.kr/#mc", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-minjunho.mp3" },
  { name:"고승범",  tier:"BEST",     tierOrder:2, img:"/images/mc-profile-4_a9e52880.jpg",         url:"https://blog.naver.com/inusmusics/223235771542", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-seungbeom.mp3" },
  { name:"김민수",  tier:"BEST",     tierOrder:2, img:"/images/mc-profile-1_33531819.jpg",         url:"https://blog.naver.com/inusmusics/223996383838", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-minsu.mp3" },
  { name:"김선혁",  tier:"BEST",     tierOrder:2, img:"/images/host_sunhyuk_1ed704ab.jpg",         url:"https://blog.naver.com/inusmusics/221025505211", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-sunhyuk.mp3" },
  { name:"김태우",  tier:"BEST",     tierOrder:2, img:"/images/mc-taewoo.webp", url:"https://www.inusmc.co.kr/#mc", desc:"웨딩 사회 경력 5년+", audio:"/audio/mc-taewoo.mp3" },
  { name:"길상우",  tier:"BEST",     tierOrder:2, img:"/images/mc-gilsangwoo.jpg",                 url:"https://blog.naver.com/inusmusics/220802942529", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-gilsangwoo.mp3" },
  { name:"이도영",  tier:"BEST",     tierOrder:2, img:"/images/mc-profile-2_f194877b.jpg",         url:"https://blog.naver.com/inusmusics/223845891681", desc:"웨딩 사회 경력 4년+",  audio:"/audio/mc-idoyoung.mp3" },
  { name:"김범태",  tier:"STANDARD", tierOrder:3, img:"/images/mc-beomtae.webp", url:"https://www.inusmc.co.kr/#mc", desc:"웨딩 전문 사회자", audio:"/audio/mc-beomtae.mp3" },
  { name:"심비성",  tier:"STANDARD", tierOrder:3, img:"/images/mc-simbisung.webp", url:"https://www.inusmc.co.kr/#mc", desc:"웨딩 전문 사회자", audio:"/audio/mc-simbisung.mp3" },
  { name:"이도건",  tier:"STANDARD", tierOrder:3, img:"/images/mc-idogeon.jpg", url:"https://www.inusmc.co.kr/#mc", desc:"웨딩 전문 사회자", audio:"/audio/mc-idogeon.mp3" },
];
const MC_MAP: Record<string, McProfile> = {};
MC_PROFILES.forEach(p => { MC_MAP[p.name] = p; });

const SLOT_RANGES: Record<string, [number, number]> = {
  am: [660, 840], pm1: [840, 960], pm2: [960, 1140],
};
const SLOT_LABELS: Record<string, string> = {
  am: "오전 11~2시", pm1: "오후 2~4시", pm2: "오후 4~7시",
};

function parseTimeToMin(t: string): number {
  const m = t.match(/(\d+)\s*시\s*(\d+)?/);
  if (m) { let h=parseInt(m[1]); const min=m[2]?parseInt(m[2]):0; if(h>=1&&h<=7)h+=12; return h*60+min; }
  return 9999;
}
function getAssignedMap(slots: Record<string, any[]>) {
  const map: Record<string, number[]> = {};
  ["am","pm1","pm2","other"].forEach(k => {
    (slots[k]||[]).forEach((item: any) => {
      if (item.assigned && item.mc_name !== "미지정") {
        if (!map[item.mc_name]) map[item.mc_name] = [];
        map[item.mc_name].push(parseTimeToMin(item.time));
      }
    });
  });
  return map;
}
function getAvailableMcs(slotKey: string, assignedMap: Record<string, number[]>) {
  const [rangeStart, rangeEnd] = SLOT_RANGES[slotKey];
  return ALL_EMCEES.filter(name => {
    const times = assignedMap[name] || [];
    const blockedRanges = times.map(t => [t - 150, t + 150] as [number, number]);
    for (let t = rangeStart; t <= rangeEnd; t += 30) {
      if (!blockedRanges.some(([s, e]) => t >= s && t <= e)) return true;
    }
    return false;
  });
}
function minToTimeStr(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const displayH = h > 12 ? h - 12 : h;
  return min === 0 ? `${displayH}시` : `${displayH}시${String(min).padStart(2,'0')}분`;
}
function getAvailableTimeInSlot(mcName: string, slotKey: string, assignedMap: Record<string, number[]>): string {
  const times = assignedMap[mcName] || [];
  const [rangeStart, rangeEnd] = SLOT_RANGES[slotKey];
  const blockedRanges = times.map(t => [t - 150, t + 150] as [number, number]);
  const availTimes: number[] = [];
  for (let t = rangeStart; t <= rangeEnd; t += 30) {
    if (!blockedRanges.some(([s, e]) => t >= s && t <= e)) availTimes.push(t);
  }
  if (availTimes.length === 0) return '';
  const segments: [number, number][] = [];
  let segStart = availTimes[0], segEnd = availTimes[0];
  for (let i = 1; i < availTimes.length; i++) {
    if (availTimes[i] - availTimes[i-1] <= 30) { segEnd = availTimes[i]; }
    else { segments.push([segStart, segEnd]); segStart = availTimes[i]; segEnd = availTimes[i]; }
  }
  segments.push([segStart, segEnd]);
  return segments.map(([s, e]) => s === e ? `${minToTimeStr(s)} 가능` : `${minToTimeStr(s)}~${minToTimeStr(e)} 가능`).join(', ');
}
function getAvailableSlots(mcName: string, slotKey: string, assignedMap: Record<string, number[]>): string[] {
  const times = assignedMap[mcName] || [];
  return Object.entries(SLOT_RANGES)
    .filter(([k, [rangeStart, rangeEnd]]) => {
      if (k === slotKey) return false;
      const blockedRanges = times.map(t => [t - 150, t + 150] as [number, number]);
      for (let t = rangeStart; t <= rangeEnd; t += 30) {
        if (!blockedRanges.some(([s, e]) => t >= s && t <= e)) return true;
      }
      return false;
    })
    .map(([k]) => SLOT_LABELS[k]);
}
function sortByTierAndName(names: string[]) {
  return [...names].sort((a,b) => {
    const pa=MC_MAP[a]||{tierOrder:99}; const pb=MC_MAP[b]||{tierOrder:99};
    if(pa.tierOrder!==pb.tierOrder) return pa.tierOrder-pb.tierOrder;
    return a.localeCompare(b,"ko");
  });
}
function formatDate(d: string) {
  const dt=new Date(d+"T00:00:00"); const days=["일","월","화","수","목","금","토"];
  return `${dt.getFullYear()}년 ${dt.getMonth()+1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`;
}

const C = {
  bg:"linear-gradient(135deg,#0a0f1e 0%,#0d1a2e 50%,#0a1628 100%)",
  card:"rgba(255,255,255,0.05)", cardBorder:"rgba(255,255,255,0.08)",
  mint:"#5BB5A2", mintLight:"rgba(91,181,162,0.15)", mintBorder:"rgba(91,181,162,0.3)",
  gold:"#d4b896", goldLight:"rgba(212,184,150,0.15)", goldBorder:"rgba(212,184,150,0.3)",
  text:"#e2e8f0", textMuted:"#64748b", textSub:"#94a3b8",
};

// 오디오 재생 버튼 컴포넌트
function AudioBtn({ audioSrc, size = 28 }: { audioSrc: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioSrc) return null;

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (playing) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      const audio = new Audio(audioSrc);
      audio.play().catch(() => {});
      audio.onended = () => setPlaying(false);
      audioRef.current = audio;
      setPlaying(true);
    }
  };

  return (
    <button onClick={toggle}
      style={{ width:size, height:size, borderRadius:"50%", background: playing ? C.mint : C.mintLight, border:`1px solid ${C.mintBorder}`, color: playing ? "#fff" : C.mint, fontSize:size*0.45, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}
      title={playing ? "정지" : "목소리 듣기"}>
      {playing ? "⏹" : "▶"}
    </button>
  );
}

// 가능한 사회자 카드
function McCard({ name }: { name: string }) {
  const p = MC_MAP[name];
  const [imgErr, setImgErr] = useState(false);
  const tierStyles: Record<Tier, React.CSSProperties> = {
    PREMIUM:  { background: C.goldLight, color: C.gold, border: `1px solid ${C.goldBorder}` },
    BEST:     { background: C.mintLight, color: C.mint, border: `1px solid ${C.mintBorder}` },
    STANDARD: { background: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" },
  };
  const tier: Tier = p?.tier || "STANDARD";
  const url = p?.url || "https://www.inusmc.co.kr/#mc";
  return (
    <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:12, overflow:"hidden", position:"relative" }}>
      {/* 오디오 버튼 - 우상단 */}
      {p?.audio && (
        <div style={{ position:"absolute", top:6, right:6, zIndex:2 }}>
          <AudioBtn audioSrc={p.audio} size={26} />
        </div>
      )}
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
        {p?.img && !imgErr ? (
          <img src={p.img} alt={name} onError={() => setImgErr(true)}
            style={{ width:"100%", height:110, objectFit:"cover", objectPosition:"top", display:"block" }} />
        ) : (
          <div style={{ width:"100%", height:110, background:`linear-gradient(135deg,${C.mintLight},rgba(91,181,162,0.05))`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:700, color:C.mint }}>
            {name.charAt(0)}
          </div>
        )}
        <div style={{ padding:"10px 10px 12px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>{name}</div>
          <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, ...tierStyles[tier] }}>{tier}</span>
        </div>
      </a>
    </div>
  );
}

// 배정완료 사회자 카드
function AssignedCard({ item, slotKey, assignedMap }: { item: any; slotKey: string; assignedMap: Record<string, number[]> }) {
  const p = MC_MAP[item.mc_name];
  const [imgErr, setImgErr] = useState(false);
  const sameSlotAvail = getAvailableTimeInSlot(item.mc_name, slotKey, assignedMap);
  const otherAvail = getAvailableSlots(item.mc_name, slotKey, assignedMap);
  const tier: Tier = p?.tier || "STANDARD";
  const tierStyles: Record<Tier, React.CSSProperties> = {
    PREMIUM:  { background: C.goldLight, color: C.gold, border: `1px solid ${C.goldBorder}` },
    BEST:     { background: C.mintLight, color: C.mint, border: `1px solid ${C.mintBorder}` },
    STANDARD: { background: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" },
  };
  const avatarUrl = p?.url || "https://www.inusmc.co.kr/#mc";
  const hasAvail = sameSlotAvail || otherAvail.length > 0;

  return (
    <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"flex-start", gap:14 }}>
      <a href={avatarUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0 }}>
        {p?.img && !imgErr ? (
          <img src={p.img} alt={item.mc_name} onError={() => setImgErr(true)}
            style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", objectPosition:"top", border:`2px solid ${C.mintBorder}` }} />
        ) : (
          <div style={{ width:48, height:48, borderRadius:"50%", background:C.mintLight, border:`2px solid ${C.mintBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:C.mint }}>
            {item.mc_name.charAt(0)}
          </div>
        )}
      </a>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
          <a href={avatarUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:15, fontWeight:700, color:C.text, textDecoration:"none" }}>{item.mc_name}</a>
          <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, ...tierStyles[tier] }}>{tier}</span>
          <span style={{ fontSize:10, fontWeight:700, background:"rgba(239,68,68,0.2)", color:"#f87171", padding:"2px 7px", borderRadius:20, border:"1px solid rgba(239,68,68,0.3)" }}>배정완료</span>
          {p?.audio && <AudioBtn audioSrc={p.audio} size={26} />}
        </div>
        <div style={{ fontSize:12, color:C.textSub, marginBottom: hasAvail ? 8 : 0 }}>
          <span style={{ color:C.mint, fontWeight:600 }}>{item.times ? item.times.join(', ') : item.time}</span>
          {p && <span style={{ marginLeft:8, color:C.textMuted }}>{p.desc}</span>}
        </div>
        {hasAvail && (
          <div style={{ background:"rgba(91,181,162,0.1)", border:`1px solid ${C.mintBorder}`, borderRadius:8, padding:"6px 10px" }}>
            <div style={{ fontSize:10, color:C.mint, fontWeight:700, marginBottom:4 }}>⏰ 추가 가능 시간</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {sameSlotAvail && (
                <span style={{ fontSize:11, fontWeight:700, background:C.mint, color:"#fff", padding:"3px 10px", borderRadius:20 }}>
                  {sameSlotAvail}
                </span>
              )}
              {otherAvail.map(s => (
                <span key={s} style={{ fontSize:11, fontWeight:700, background:C.mintLight, color:C.mint, padding:"3px 10px", borderRadius:20, border:`1px solid ${C.mintBorder}` }}>
                  {s} 가능
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch(`${API_URL}?date=${date}`);
      const json = await res.json();
      if (json.code !== 1) setError(json.message || "조회 실패");
      else { setData(json); setActiveTab("am"); }
    } catch { setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요."); }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif", background:C.bg, minHeight:"100vh", color:C.text, padding:"0 0 80px" }}>

      {/* 상단 네비 */}
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", borderBottom:`1px solid ${C.cardBorder}`, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:10 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:6, color:C.mint, textDecoration:"none", fontSize:13, fontWeight:600, padding:"6px 12px", background:C.mintLight, border:`1px solid ${C.mintBorder}`, borderRadius:8 }}>
          ← 메인으로
        </a>
        <div style={{ flex:1, textAlign:"center", fontSize:15, fontWeight:700, color:C.text }}>사회자 스케줄 현황</div>
        <div style={{ width:80 }} />
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 16px" }}>

        {/* 헤더 */}
        <div style={{ textAlign:"center", padding:"16px 0 24px" }}>
          <div style={{ fontSize:11, letterSpacing:3, color:C.mint, fontWeight:700, marginBottom:8 }}>INUS MUSIC</div>
          <p style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>예식 날짜를 선택하면 해당 날짜에<br/>배정된 사회자 현황을 확인할 수 있습니다.</p>
        </div>

        {/* 날짜 검색 */}
        <div style={{ background:C.card, borderRadius:16, padding:20, marginBottom:24, border:`1px solid ${C.cardBorder}` }}>
          <div style={{ fontSize:12, color:C.textSub, marginBottom:10, fontWeight:600 }}>📅 예식 날짜 선택</div>
          <div style={{ display:"flex", gap:10 }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              onKeyDown={e => e.key==="Enter" && search()}
              style={{ flex:1, height:48, background:"rgba(255,255,255,0.08)", border:`1.5px solid ${C.cardBorder}`, borderRadius:10, color:C.text, fontSize:16, padding:"0 14px", fontFamily:"inherit", outline:"none" }} />
            <button onClick={search}
              style={{ height:48, padding:"0 24px", background:`linear-gradient(135deg,#3d9e8c,${C.mint})`, border:"none", borderRadius:10, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", boxShadow:`0 4px 15px rgba(91,181,162,0.3)` }}>
              조회
            </button>
          </div>
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign:"center", padding:"40px 0", color:C.textSub }}>
            <div style={{ width:36, height:36, border:`3px solid ${C.mintLight}`, borderTopColor:C.mint, borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
            <div>조회 중...</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* 에러 */}
        {error && <div style={{ textAlign:"center", padding:"20px", color:"#f87171" }}>⚠️ {error}</div>}

        {/* 초기 안내 */}
        {!loading && !data && !error && (
          <div style={{ textAlign:"center", padding:"32px 20px", color:C.textMuted }}>
            <div style={{ fontSize:44, marginBottom:14 }}>🎤</div>
            <div style={{ fontSize:14, lineHeight:1.8 }}>날짜를 선택하고 조회 버튼을 누르면<br/>해당 날짜에 배정된 사회자 현황을<br/>시간대별로 확인할 수 있습니다.</div>
          </div>
        )}

        {/* 결과 */}
        {data && (() => {
          const assignedMap = getAssignedMap(data.slots);
          return (
            <div>
              <div style={{ textAlign:"center", fontSize:16, fontWeight:700, color:C.text, marginBottom:16, padding:"12px 16px", background:C.card, borderRadius:12, border:`1px solid ${C.cardBorder}` }}>
                <span style={{ color:C.mint }}>{formatDate(data.date)}</span> 사회자 현황
              </div>

              {/* 탭 */}
              <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                {["am","pm1","pm2"].map(key => {
                  const cnt = (data.slots[key]||[]).filter((i: any) => i.assigned).length;
                  const isActive = activeTab===key;
                  return (
                    <button key={key} onClick={() => setActiveTab(key)}
                      style={{ flex:1, height:52, background:isActive?`linear-gradient(135deg,#3d9e8c,${C.mint})`:C.card, border:isActive?"none":`1.5px solid ${C.cardBorder}`, borderRadius:12, color:isActive?"#fff":C.textSub, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", lineHeight:1.4, boxShadow:isActive?`0 4px 15px rgba(91,181,162,0.25)`:"none" }}>
                      {SLOT_LABELS[key]}<br/>
                      <span style={{ fontSize:10, background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"1px 6px" }}>{cnt}건 배정</span>
                    </button>
                  );
                })}
              </div>

              {/* 탭 내용 */}
              {["am","pm1","pm2"].map(key => {
                if (activeTab !== key) return null;
                const assignedItems = (data.slots[key]||[]).filter((i: any) => i.assigned);
                // 같은 이름끼리 합치기 (시간 여러 개 표시)
                const mergedMap: Record<string, any> = {};
                assignedItems.forEach((i: any) => {
                  if (!mergedMap[i.mc_name]) {
                    mergedMap[i.mc_name] = { ...i, times: [i.time] };
                  } else if (!mergedMap[i.mc_name].times.includes(i.time)) {
                    mergedMap[i.mc_name].times.push(i.time);
                  }
                });
                const uniqueNames = sortByTierAndName(Object.keys(mergedMap));
                const sortedItems = uniqueNames.map(n => mergedMap[n]).filter(Boolean);
                const availableMcs = sortByTierAndName(getAvailableMcs(key, assignedMap));

                return (
                  <div key={key}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:1, marginBottom:10, paddingLeft:4 }}>배정된 사회자</div>
                    {sortedItems.length === 0 ? (
                      <div style={{ textAlign:"center", padding:"24px 20px", color:C.textMuted, fontSize:13, background:C.card, borderRadius:12, border:`1px solid ${C.cardBorder}`, marginBottom:20 }}>
                        <div style={{ fontSize:24, marginBottom:8 }}>✅</div>이 시간대에 배정된 사회자가 없습니다.
                      </div>
                    ) : sortedItems.map((item: any, i: number) => (
                      <AssignedCard key={i} item={item} slotKey={key} assignedMap={assignedMap} />
                    ))}

                    <div style={{ marginTop:24, paddingTop:18, borderTop:`1px solid ${C.cardBorder}` }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.mint, marginBottom:4 }}>✨ 이 시간대 가능한 사회자</div>
                      <div style={{ fontSize:11, color:C.textMuted, marginBottom:14 }}>앞뒤 2시간 30분 이내 다른 예식이 없는 사회자입니다.</div>
                      {availableMcs.length === 0 ? (
                        <div style={{ padding:16, textAlign:"center", color:C.textMuted, fontSize:12, background:C.card, borderRadius:10 }}>이 시간대에 가능한 사회자가 없습니다.</div>
                      ) : (
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                          {availableMcs.map(name => <McCard key={name} name={name} />)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 안내 문구 */}
              <div style={{ background:C.mintLight, border:`1px solid ${C.mintBorder}`, borderRadius:12, padding:"16px 18px", fontSize:12, color:"#a7d9d0", lineHeight:1.8, marginTop:24 }}>
                <div style={{ fontWeight:700, color:C.mint, marginBottom:8 }}>📌 예약 안내</div>
                <div>• <strong>예약은 서울·경기·인천 지역만 가능합니다.</strong></div>
                <div style={{ marginTop:6 }}>• 사회자 가능 시간(예식 2시간 30분 간격 기준)은 <strong>서울 지역 기준</strong>입니다. 경기·인천 등 서울 외 지역의 예식은 이동 시간이 필요하므로, 화면에 '가능'으로 표시되더라도 바로 예약하지 마시고 <strong>반드시 상담 후 예약</strong>을 잡아주세요.</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 카카오톡 플로팅 버튼 */}
      <a href="https://pf.kakao.com/_wxovaM/chat" target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", bottom:24, right:20, width:56, height:56, borderRadius:"50%", background:"#FEE500", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.3)", zIndex:100, textDecoration:"none", fontSize:26 }}>
        💬
      </a>
    </div>
  );
}
