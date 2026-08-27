/**
 * 사회자 스케줄 현황 페이지 - /schedule
 */
import { useState, useRef } from "react";

const API_URL = "/api/schedule";
const KAKAO_URL = "https://pf.kakao.com/_wxovaM/chat";

// 활동 사회자 명단
const ALL_EMCEES = [
  "고승범","김민수","길상우","김범태","김선혁",
  "민준호","이우영","장윤태","석재선","이도영","이도건","심비성",
  "김태우","최윤아"
];

// 공개 스케줄에 표시하지 않는 사회자
const HIDDEN_PUBLIC_EMCEES = ["김성환"];
const isPublicEmcee = (name: string) => ALL_EMCEES.includes(name) && !HIDDEN_PUBLIC_EMCEES.includes(name);

type Tier = "PREMIUM" | "BEST" | "STANDARD";
interface McProfile {
  name: string; tier: Tier; tierOrder: number;
  img: string; url: string; desc: string; audio: string; imgPos?: string;
}

const MC_PROFILES: McProfile[] = [
  { name:"석재선",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-profile-3_33ff7a32.jpg",         url:"https://blog.naver.com/inusmusics/223822182933", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-jaesun.mp3" },
  { name:"이우영",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-lee-wooyoung-new_fa27e84d.webp", url:"https://blog.naver.com/inusmusics/220767962639", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-wooyoung.mp3", imgPos:"50% 55%" },
  { name:"장윤태",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-yuntae2.jpg", url:"https://blog.naver.com/inusmusics/223246261228", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-yuntae.mp3" },
  { name:"최윤아",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-yuna.jpg",                       url:"https://blog.naver.com/inusmusics/224327229799", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-yoona.mp3" },
  { name:"민준호",  tier:"PREMIUM",  tierOrder:1, img:"/images/mc-minjunho.webp", url:"https://blog.naver.com/inusmusics/223597460181", desc:"웨딩 사회 경력 10년+", audio:"/audio/mc-minjunho.mp3" },
  { name:"고승범",  tier:"BEST",     tierOrder:2, img:"/images/mc-profile-4_a9e52880.jpg",         url:"https://blog.naver.com/inusmusics/223235771542", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-seungbeom.mp3", imgPos:"50% 5%" },
  { name:"김민수",  tier:"BEST",     tierOrder:2, img:"/images/mc-profile-1_33531819.jpg",         url:"https://blog.naver.com/inusmusics/223996383838", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-minsu.mp3" },
  { name:"김선혁",  tier:"BEST",     tierOrder:2, img:"/images/host_sunhyuk_1ed704ab.jpg",         url:"https://blog.naver.com/inusmusics/221025505211", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-sunhyuk.mp3" },
  { name: "김태우",  tier:"BEST",     tierOrder:2, img:"/images/mc-taewoo.webp", url:"https://m.blog.naver.com/inusmusics/224364756942", desc:"웨딩 사회 경력 5년+", audio:"/audio/mc-taewoo.mp3" },
  { name:"길상우",  tier:"BEST",     tierOrder:2, img:"/images/mc-gilsangwoo.jpg",                 url:"https://blog.naver.com/inusmusics/220802942529", desc:"웨딩 사회 경력 5년+",  audio:"/audio/mc-gilsangwoo.mp3" },
  { name:"이도영",  tier:"BEST",     tierOrder:2, img:"/images/mc-profile-2_f194877b.jpg",         url:"https://blog.naver.com/inusmusics/223845891681", desc:"웨딩 사회 경력 4년+",  audio:"/audio/mc-idoyoung.mp3" },
  { name:"김범태",  tier:"STANDARD", tierOrder:3, img:"/images/mc-beomtae.webp", url:"https://blog.naver.com/inusmusics/223192531041", desc:"웨딩 전문 사회자", audio:"/audio/mc-beomtae.mp3", imgPos:"50% 20%" },
  { name:"심비성",  tier:"STANDARD", tierOrder:3, img:"/images/mc-simbisung.webp", url:"https://blog.naver.com/inusmusics/224198308789", desc:"웨딩 전문 사회자", audio:"/audio/mc-simbisung.mp3", imgPos:"50% 20%" },
  { name:"이도건",  tier:"STANDARD", tierOrder:3, img:"/images/mc-idogeon.jpg", url:"https://blog.naver.com/inusmusics/224099418463", desc:"웨딩 전문 사회자", audio:"/audio/mc-idogeon.mp3" },
];
const MC_MAP: Record<string, McProfile> = {};
MC_PROFILES.forEach(p => { MC_MAP[p.name] = p; });

const SLOT_RANGES: Record<string, [number, number]> = {
  am: [660, 840], pm1: [840, 960], pm2: [960, 1140],
};
const SLOT_LABELS: Record<string, string> = {
  am: "오전 11~2시", pm1: "오후 2~4시", pm2: "오후 4~7시", other: "기타 시간대",
};

// 웨딩홀 → 지역 매핑 테이블
const VENUE_REGION_MAP: Record<string, string> = {
  // 마포/홍대/합정
  "이룸웨딩": "마포", "이룸웨딩컨벤션": "마포",
  "라플레이스": "마포", "합정 웨딩시그니처": "합정",
  "메종드비": "마포",
  // 강남/서초
  "브라이드밸리": "강남", "S컨벤션": "강남", "강남s컨벤션": "강남",
  "아만티호텔": "강남", "프리마베라": "강남", "더모스트": "강남",
  "마리아쥬스퀘어": "강남", "KU컨벤션": "강남", "분당앤스퀘어": "분당",
  // 용산/중구/시청
  "PJ호텔": "용산", "pj호텔": "용산",
  "스탠포드호텔": "마포", "남산제이그랜하우스": "용산",
  "시청 오펠리스": "중구", "중구 루이비스": "중구",
  "프레스센터": "중구", "한국기독교회관": "중구",
  "웨스틴조선": "중구", "롯데호텔": "중구",
  // 영등포/여의도
  "위더스 영등포": "영등포", "위더스영등포": "영등포",
  "여의도": "여의도", "웨딩여율리": "여의도",
  "엘컨벤션": "영등포",
  // 성북/동대문
  "성균관컨벤션": "성북", "한전아트센터": "성동",
  "벨라루체": "동대문", "누리시아": "성북",
  // 동작/사당
  "사당아르테스": "동작", "아르테스웨딩홀": "동작",
  // 송파/강동
  "가든파이브": "송파", "강동노빌리티": "강동",
  "강동KDW웨딩홀": "강동", "샤이닝스톤": "송파",
  // 구로/금천
  "제이오스티엘": "구로", "구로 제이오스티엘": "구로",
  "공우이엔씨": "구로",
  // 노원/도봉
  "에디스웨딩": "노원", "에디스웨딩컨벤션": "노원",
  // 은평/서대문
  "벨라비타": "은평",
  // 종로/광화문
  "국방컨벤션": "용산", "호암교수회관": "관악",
  "전경련플라자": "여의도", "국회소통관": "여의도",
  "국회사랑재": "여의도", "국립외교원": "서초",
  "서울여성플라자": "동작",
  // 경기/인천
  "더베루미에": "부평", "더베르미에": "부평",
  "안양스칼라티움": "안양", "안양 스칼라티움": "안양",
  "안산 aw컨벤션": "안산",
  "의정부 웨딩팰리스": "의정부", "의정부컨벤션": "의정부",
  "부천 MJ컨벤션": "부천",
  "광명역사컨벤션": "광명", "광명역사컨벤션웨딩홀": "광명",
  "코리아디자인센터": "일산",
  // 기타
  "L65컨벤션": "마포", "더휴웨딩홀": "강남", "더휴": "강남",
  "더에스비웨딩": "강남", "더에스비웨딩컨벤션": "강남",
  "이스턴베니비스": "마포", "팰리시티컨벤션": "강남",
  "호텔파크하비오": "중랑", "파크하비오": "중랑",
  "경남호텔": "중구", "레이크호텔": "강남",
  "호텔베르누이": "강남", "베르누이": "강남", "호텔 베르누이": "강남",
  "에스티아웨딩홀": "강남", "온즈드롬": "마포",
  "당산 그랜드컨벤션": "영등포", "JJ웨딩컨벤션": "강남",
  "JK아트컨벤션": "강남", "상록아트홀": "강남",
  "더웨딩컨벤션": "강남", "엠플러스웨딩": "강남",
  "케이터틀": "강남", "jw컨벤션": "강남",
  "서울가든호텔": "마포", "엔씨소프트": "판교",
  "우리은행": "중구", "우리은행 본점": "중구", "우리은행본점": "중구",
  "국회의사당": "여의도", "프레스센터국제회의장": "중구",
};

// 지역명 키워드 (장소명에 포함되면 자동 감지)
const REGION_KEYWORDS = [
  "여의도","홍대","신초","합정","이태원","일산","분당","판교","수원","성남",
  "인천","부평","부천","안양","안산","광명","의정부","구리","남양주","하남",
  "동탄","신도림","여원","사당","강남","서초","송파","강동","마포","영등포",
  "성북","노원","은평","중랑","구로","금천","동작","관악","양천","용산",
];

// 장소에서 지역 추출 (매핑 테이블 우선 → 구/시 자동 감지 → 괄호 추출 → 지역명 키워드)
function extractRegion(place: string): string {
  if (!place) return "";
  const cleaned = place.replace(/\(취소\)/g, "").trim();

  // 1. 매핑 테이블에서 키워드 매칭
  for (const [key, region] of Object.entries(VENUE_REGION_MAP)) {
    if (cleaned.includes(key)) return region;
  }

  // 2. 괄호 안 내용 추출 (예: 웨딩여율리(여의도) → 여의도)
  const bracketMatch = cleaned.match(/\(([^)]+)\)/);
  if (bracketMatch) {
    const inner = bracketMatch[1].replace(/역$/, "").replace(/홈$/, "").trim();
    // 구/시/동 등 행정지명이면 바로 사용
    if (/[구시동군]s*$/.test(inner) && inner.length >= 2) {
      return inner.replace(/[구시동군]$/, "").trim();
    }
    if (inner.length >= 2 && inner.length <= 6) return inner;
  }

  // 3. 장소명에 구/시 키워드 포함 여부 (예: "강남구", "영등포구")
  const districtMatch = cleaned.match(/([^s(]+[구시])/);
  if (districtMatch) {
    const d = districtMatch[1].replace(/[구시]$/, "").trim();
    if (d.length >= 2) return d;
  }

  // 4. 지역명 키워드 직접 포함
  for (const kw of REGION_KEYWORDS) {
    if (cleaned.includes(kw)) return kw;
  }

  return "";
}

function parseTimeToMin(t: string): number {
  const m = t.match(/(\d+)\s*시\s*(\d+)?/);
  if (m) { let h=parseInt(m[1]); const min=m[2]?parseInt(m[2]):0; if(h>=1&&h<=7)h+=12; return h*60+min; }
  return 9999;
}
function getAssignedMap(slots: Record<string, any[]>) {
  const map: Record<string, number[]> = {};
  ["am","pm1","pm2","other"].forEach(k => {
    (slots[k]||[]).forEach((item: any) => {
      if (item.assigned && item.mc_name !== "미지정" && isPublicEmcee(item.mc_name)) {
        if (!map[item.mc_name]) map[item.mc_name] = [];
        map[item.mc_name].push(parseTimeToMin(item.time));
      }
    });
  });
  return map;
}
function getAvailableMcs(slotKey: string, assignedMap: Record<string, number[]>) {
  const [rangeStart, rangeEnd] = SLOT_RANGES[slotKey] || [0, 0];
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
  const range = SLOT_RANGES[slotKey];
  if (!range) return '';
  const [rangeStart, rangeEnd] = range;
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

// 오디오 재생 버튼
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
      style={{ width:size, height:size, borderRadius:"50%", background: playing ? C.mint : "rgba(0,0,0,0.55)", border:`2px solid ${playing ? C.mint : "rgba(255,255,255,0.7)"}`, color:"#fff", fontSize:size*0.4, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s", backdropFilter:"blur(4px)", boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}
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
  const url = p?.url || KAKAO_URL;
  return (
    <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:12, overflow:"hidden", position:"relative" }}>
      {p?.audio && (
        <div style={{ position:"absolute", top:6, right:6, zIndex:2 }}>
          <AudioBtn audioSrc={p.audio} size={26} />
        </div>
      )}
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
        {p?.img && !imgErr ? (
          <img src={p.img} alt={name} onError={() => setImgErr(true)}
            style={{ width:"100%", height:110, objectFit:"cover", objectPosition:p.imgPos||"50% 15%", display:"block" }} />
        ) : (
          <div style={{ width:"100%", height:110, background:`linear-gradient(135deg,${C.mintLight},rgba(91,181,162,0.05))`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:700, color:C.mint }}>
            {name.charAt(0)}
          </div>
        )}
        <div style={{ padding:"10px 10px 12px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>{name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
            <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4, ...tierStyles[tier] }}>{tier}</span>
            <span style={{ fontSize:9, fontWeight:600, padding:"2px 6px", borderRadius:4, background:"rgba(91,181,162,0.15)", color:C.mint, border:`1px solid ${C.mintBorder}` }}>서울 기준 가능</span>
          </div>
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
  const avatarUrl = p?.url || KAKAO_URL;
  const hasAvail = sameSlotAvail || otherAvail.length > 0;
  // 지역 정보
  // API의 place_region 우선 사용, 없으면 클라이언트 extractRegion 폴백
  const region = item.place_region || (item.place ? extractRegion(item.place) : "");

  return (
    <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"flex-start", gap:14 }}>
      <a href={avatarUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0 }}>
        {p?.img && !imgErr ? (
          <img src={p.img} alt={item.mc_name} onError={() => setImgErr(true)}
            style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", objectPosition:p.imgPos||"50% 15%", border:`2px solid ${C.mintBorder}` }} />
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
          {region && <span style={{ marginLeft:6, color:C.textMuted, fontSize:11 }}>📍 {region}</span>}
          {p && <span style={{ marginLeft:8, color:C.textMuted }}>{p.desc}</span>}
        </div>
        {hasAvail && (
          <div style={{ background:"rgba(91,181,162,0.1)", border:`1px solid ${C.mintBorder}`, borderRadius:8, padding:"6px 10px" }}>
            <div style={{ fontSize:10, color:C.mint, fontWeight:700, marginBottom:4 }}>⏰ 추가 가능 시간 <span style={{ fontWeight:400, color:C.textMuted }}>(서울 기준)</span></div>
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

  // 상담 신청 URL (날짜+시간대 포함)
  const getConsultUrl = (slotLabel: string) => {
    const msg = encodeURIComponent(`안녕하세요! ${date ? formatDate(date) : ""} ${slotLabel} 시간대 사회자 상담 신청합니다.`);
    return `${KAKAO_URL}?msg=${msg}`;
  };

  return (
    <div style={{ fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif", background:C.bg, minHeight:"100vh", color:C.text, padding:"0 0 100px", boxSizing:"border-box", overflowX:"hidden" }}>

      {/* 상단 네비 */}
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", borderBottom:`1px solid ${C.cardBorder}`, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:10 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:6, color:C.mint, textDecoration:"none", fontSize:13, fontWeight:600, padding:"6px 12px", background:C.mintLight, border:`1px solid ${C.mintBorder}`, borderRadius:8, whiteSpace:"nowrap" }}>
          ← 메인으로
        </a>
        <div style={{ flex:1, textAlign:"center", fontSize:15, fontWeight:700, color:C.text }}>사회자 스케줄 현황</div>
        <div style={{ width:80 }} />
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"18px 16px 24px" }}>

        {/* 하위 메뉴 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          <a href="/schedule" style={{ textDecoration:"none", textAlign:"center", padding:"11px 8px", color:"#fff", background:`linear-gradient(135deg,#3d9e8c,${C.mint})`, borderRadius:10, fontSize:13, fontWeight:800 }}>사회자 스케줄</a>
          <a href="/performance-schedule" style={{ textDecoration:"none", textAlign:"center", padding:"11px 8px", color:C.textSub, background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:10, fontSize:13, fontWeight:700 }}>주말 주요 편성</a>
        </div>

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
              style={{ flex:1, height:48, background:"rgba(255,255,255,0.08)", border:`1.5px solid ${C.cardBorder}`, borderRadius:10, color:C.text, fontSize:16, padding:"0 14px", fontFamily:"inherit", outline:"none", minWidth:0 }} />
            <button onClick={search}
              style={{ height:48, padding:"0 24px", background:`linear-gradient(135deg,#3d9e8c,${C.mint})`, border:"none", borderRadius:10, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", boxShadow:`0 4px 15px rgba(91,181,162,0.3)`, flexShrink:0 }}>
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
        {error && (
          <div style={{ textAlign:"center", padding:"24px 20px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12 }}>
            <div style={{ color:"#f87171", marginBottom:12 }}>⚠️ {error}</div>
            <button onClick={search} style={{ padding:"8px 20px", background:`linear-gradient(135deg,#3d9e8c,${C.mint})`, border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              다시 시도
            </button>
          </div>
        )}

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
          const hasOther = (data.slots["other"]||[]).filter((i: any) => i.assigned && i.mc_name !== "미지정" && isPublicEmcee(i.mc_name)).length > 0;
          const tabs = hasOther ? ["am","pm1","pm2","other"] : ["am","pm1","pm2"];

          return (
            <div>
              <div style={{ textAlign:"center", fontSize:16, fontWeight:700, color:C.text, marginBottom:16, padding:"12px 16px", background:C.card, borderRadius:12, border:`1px solid ${C.cardBorder}` }}>
                <span style={{ color:C.mint }}>{formatDate(data.date)}</span> 사회자 현황
              </div>

              {/* 탭 */}
              <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"nowrap", overflowX:"auto" }}>
                {tabs.map(key => {
                  const cnt = (data.slots[key]||[]).filter((i: any) => i.assigned && i.mc_name !== "미지정" && isPublicEmcee(i.mc_name)).length;
                  const isActive = activeTab===key;
                  return (
                    <button key={key} onClick={() => setActiveTab(key)}
                      style={{ flex:"1 0 auto", minWidth:0, height:52, background:isActive?`linear-gradient(135deg,#3d9e8c,${C.mint})`:C.card, border:isActive?"none":`1.5px solid ${C.cardBorder}`, borderRadius:12, color:isActive?"#fff":C.textSub, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", lineHeight:1.4, boxShadow:isActive?`0 4px 15px rgba(91,181,162,0.25)`:"none", padding:"0 8px" }}>
                      {SLOT_LABELS[key]}<br/>
                      <span style={{ fontSize:10, background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"1px 6px" }}>{cnt}건 배정</span>
                    </button>
                  );
                })}
              </div>

              {/* 가능 여부 안내 - 탭 바로 아래 */}
              <div style={{ background:"rgba(91,181,162,0.08)", border:`1px solid ${C.mintBorder}`, borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:11, color:"#a7d9d0", lineHeight:1.7 }}>
                ※ 가능 여부는 서울 기준으로 계산됩니다. 경기·인천 지역은 이동시간에 따라 달라질 수 있으며, 실제 예약은 상담 후 최종 확정됩니다.
              </div>

              {/* 탭 내용 */}
              {tabs.map(key => {
                if (activeTab !== key) return null;
                const assignedItems = (data.slots[key]||[]).filter((i: any) => i.assigned && i.mc_name !== "미지정" && isPublicEmcee(i.mc_name));
                // 같은 이름끼리 합치기 (시간 여러 개 표시, 장소도 합치기)
                const mergedMap: Record<string, any> = {};
                assignedItems.forEach((i: any) => {
                  if (!mergedMap[i.mc_name]) {
                    mergedMap[i.mc_name] = { ...i, times: [i.time], places: i.place ? [i.place] : [] };
                  } else {
                    if (!mergedMap[i.mc_name].times.includes(i.time)) mergedMap[i.mc_name].times.push(i.time);
                    if (i.place && !mergedMap[i.mc_name].places.includes(i.place)) mergedMap[i.mc_name].places.push(i.place);
                  }
                });
                const uniqueNames = sortByTierAndName(Object.keys(mergedMap));
                const sortedItems = uniqueNames.map(n => mergedMap[n]).filter(Boolean);
                const availableMcs = key !== "other" ? sortByTierAndName(getAvailableMcs(key, assignedMap)) : [];

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

                    {/* 가능한 사회자 섹션 (other 탭 제외) */}
                    {key !== "other" && (
                      <div style={{ marginTop:24, paddingTop:18, borderTop:`1px solid ${C.cardBorder}` }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.mint, marginBottom:4 }}>✨ 이 시간대 가능한 사회자</div>
                        <div style={{ fontSize:11, color:C.textMuted, marginBottom:12 }}>앞뒤 2시간 30분 이내 다른 예식이 없는 사회자 (서울 기준)</div>

                        {/* 원했던 사회자가 마감이어도 이탈하지 않도록 — 개인이 아닌 '이너스 검증'을 신뢰하게 만드는 안내 */}
                        <div style={{ background:C.card, border:`1px solid ${C.mintBorder}`, borderLeft:`3px solid ${C.mint}`, borderRadius:10, padding:"11px 13px", marginBottom:14 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:4, lineHeight:1.5, wordBreak:"keep-all" }}>
                            원하셨던 사회자가 마감이어도 괜찮습니다.
                          </div>
                          <div style={{ fontSize:11.5, color:C.textSub, lineHeight:1.7, wordBreak:"keep-all" }}>
                            아래 사회자 모두 <span style={{ color:C.mint, fontWeight:700 }}>동일한 기준으로 검증</span>된 분들입니다.
                            {" "}이너스뮤직은 특정 한 명이 아닌, 전체 진행 품질을 책임집니다.
                          </div>
                        </div>
                        {availableMcs.length === 0 ? (
                          <div style={{ padding:16, textAlign:"center", color:C.textMuted, fontSize:12, background:C.card, borderRadius:10 }}>이 시간대에 가능한 사회자가 없습니다.</div>
                        ) : (
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                            {availableMcs.map(name => <McCard key={name} name={name} />)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 상담 신청 CTA */}
                    <div style={{ marginTop:20, background:`linear-gradient(135deg,rgba(91,181,162,0.12),rgba(91,181,162,0.06))`, border:`1px solid ${C.mintBorder}`, borderRadius:14, padding:"16px 18px", textAlign:"center" }}>
                      <div style={{ fontSize:13, color:C.textSub, marginBottom:10 }}>
                        {date && <><span style={{ color:C.mint, fontWeight:700 }}>{formatDate(date)}</span> {SLOT_LABELS[key]} 예약 문의</>}
                      </div>
                      <a href={getConsultUrl(SLOT_LABELS[key])} target="_blank" rel="noopener noreferrer"
                        style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 24px", background:"#FEE500", borderRadius:10, color:"#3A1D1D", fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 12px rgba(254,229,0,0.3)" }}>
                        💬 이 시간대 상담 신청
                      </a>
                      <div style={{ fontSize:10, color:C.textMuted, marginTop:8 }}>카카오톡으로 연결됩니다 · 상담 후 최종 확정</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 카카오톡 플로팅 버튼 - 하단 고정 (AI 챗봇 제거, 단일 버튼) */}
      <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", bottom:24, right:20, display:"flex", alignItems:"center", gap:8, padding:"12px 18px", background:"#FEE500", borderRadius:28, color:"#3A1D1D", fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.3)", zIndex:100, whiteSpace:"nowrap" }}>
        💬 카카오 상담
      </a>
    </div>
  );
}
