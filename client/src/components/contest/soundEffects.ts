/**
 * 콘테스트 사운드 매니저 - 배경음악 + 효과음
 */
const BASE = "/audio/contest/";

let bgmAudio: HTMLAudioElement | null = null;
let muted = false;

function getBgm(): HTMLAudioElement {
  if (!bgmAudio) {
    bgmAudio = new Audio(`${BASE}bgm.mp3`);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.32;
  }
  return bgmAudio;
}

export function playBgm() {
  const audio = getBgm();
  audio.muted = muted;
  audio.play().catch(() => {});
}

export function stopBgm() {
  bgmAudio?.pause();
}

export function setSoundMuted(value: boolean) {
  muted = value;
  if (bgmAudio) bgmAudio.muted = value;
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
