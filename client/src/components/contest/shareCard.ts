/**
 * VOV 결과 공유 카드 - 캔버스로 세로형(9:16) 이미지 생성
 * 카카오톡 등 공유를 고려해 순수 클라이언트 canvas로 그려서 PNG blob을 반환한다.
 * 외부 호스팅 이미지가 CORS를 허용하지 않아 캔버스가 오염(tainted)되는 경우
 * 사진 없이 텍스트만으로 카드를 완성해 항상 안전하게 동작하도록 한다.
 */

const W = 750;
const H = 1334;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface ShareCardData {
  championName: string;
  championImage: string;
  highlight: string;
  monthHearts: number;
  monthLabel: string;
}

export async function buildShareCard(data: ShareCardData): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 배경
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#14110b");
  bg.addColorStop(0.5, "#0d0d0d");
  bg.addColorStop(1, "#0d0d0d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 160, 20, W / 2, 160, 420);
  glow.addColorStop(0, "rgba(212,184,150,0.18)");
  glow.addColorStop(1, "rgba(212,184,150,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // 상단 로고 텍스트
  ctx.textAlign = "center";
  ctx.fillStyle = "#d4b896";
  ctx.font = "600 22px 'Noto Sans KR', sans-serif";
  ctx.fillText("INUSMUSIC · VOTE ON VOICE", W / 2, 92);

  ctx.font = "600 64px 'Cormorant Garamond', serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("V", W / 2 - 148, 168);
  ctx.fillStyle = "#5BB5A2";
  const drawVOV = () => {
    ctx.font = "600 64px 'Cormorant Garamond', serif";
  };
  drawVOV();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 58px 'Cormorant Garamond', serif";
  ctx.fillText("VOTE ON VOICE", W / 2, 168);

  // 사진 원형
  const cx = W / 2;
  const cy = 430;
  const r = 168;
  const img = await loadImage(data.championImage);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (img) {
    const scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
    const iw = img.width * scale;
    const ih = img.height * scale;
    // 인물사진은 얼굴이 상단부에 위치하는 경우가 많아 살짝 위쪽(얼굴 쪽)을 기준으로 자른다.
    // 화면 좌표계에서 이미지를 아래로 내릴수록(y0 증가) 얼굴이 있는 상단부가 더 많이 보인다.
    const verticalBias = Math.max(0, Math.min(ih - r * 2, ih * 0.12));
    ctx.drawImage(img, cx - iw / 2, cy - ih / 2 + verticalBias, iw, ih);
  } else {
    ctx.fillStyle = "#1c1c1c";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  ctx.restore();

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#d4b896";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // 라벨
  ctx.font = "500 20px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "#d4b896";
  ctx.fillText("이번 회차 챔피언", cx, cy + r + 66);

  // 이름
  ctx.font = "700 56px 'Noto Serif KR', serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${data.championName} 사회자`, cx, cy + r + 132);

  // highlight (2줄 래핑)
  ctx.font = "400 26px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  const wrapLines = (text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 2);
  };
  const lines = wrapLines(data.highlight, W - 140);
  lines.forEach((line, i) => {
    ctx.fillText(line, cx, cy + r + 178 + i * 36);
  });

  // 하트 카드
  const cardY = cy + r + 250;
  const cardH = 130;
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  roundedRect(ctx, 90, cardY, W - 180, cardH, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(212,184,150,0.35)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 90, cardY, W - 180, cardH, 24);
  ctx.stroke();

  ctx.font = "600 22px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillText(`${data.monthLabel} 누적 하트`, cx, cardY + 48);

  ctx.font = "700 44px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "#5BB5A2";
  ctx.fillText(`♥ ${data.monthHearts.toLocaleString()}개`, cx, cardY + 100);

  // 하단 안내
  ctx.font = "500 24px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("나도 내 결혼식 사회자 목소리 찾으러 가기", cx, H - 130);

  ctx.font = "700 30px 'Noto Sans KR', sans-serif";
  ctx.fillStyle = "#d4b896";
  ctx.fillText("inusmc.co.kr/contest", cx, H - 82);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}
