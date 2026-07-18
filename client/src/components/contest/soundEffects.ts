/**
 * 콘테스트 사운드 매니저 - 효과음
 */
const BASE = "/audio/contest/";

let muted = false;

export function setSoundMuted(value: boolean) {
  muted = value;
}

export function isSoundMuted() {
  return muted;
}

const sfxVolume: Record<string, number> = {
  heart: 0.55,
  select: 0.5,
  champion: 0.75,
};

export function playSfx(name: "heart" | "select" | "champion") {
  if (muted) return;
  const audio = new Audio(`${BASE}${name}.mp3`);
  audio.volume = sfxVolume[name] ?? 0.5;
  audio.play().catch(() => {});
}
