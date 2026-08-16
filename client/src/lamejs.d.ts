/** 이너스뮤직 스튜디오 — 테이프 벤치: 브라우저 내 MP3 인코더 타입 선언 */
declare module "lamejs" {
  class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }

  const lamejs: { Mp3Encoder: typeof Mp3Encoder };
  export default lamejs;
}
