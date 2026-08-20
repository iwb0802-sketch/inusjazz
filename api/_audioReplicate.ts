export type ReplicatePrediction = {
  id: string;
  status: string;
  error?: string | null;
  output?: unknown;
};

const REPLICATE_API = "https://api.replicate.com/v1";
let cachedVersion: { id: string; expiresAt: number } | null = null;

function authHeaders() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN 환경변수가 설정되지 않았습니다.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function providerError(response: Response) {
  const text = await response.text().catch(() => "");
  return `Replicate 요청 실패 (${response.status})${text ? `: ${text}` : ""}`;
}

async function getDemucsVersion() {
  if (cachedVersion && cachedVersion.expiresAt > Date.now()) return cachedVersion.id;
  const response = await fetch(`${REPLICATE_API}/models/cjwbw/demucs`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await providerError(response));
  const model = await response.json() as { latest_version?: { id?: string } };
  const id = model.latest_version?.id;
  if (!id) throw new Error("Replicate Demucs 최신 버전을 찾지 못했습니다.");
  cachedVersion = { id, expiresAt: Date.now() + 10 * 60 * 1000 };
  return id;
}

export async function createAudioPrediction(sourceUrl: string) {
  const version = await getDemucsVersion();
  const response = await fetch(`${REPLICATE_API}/predictions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      version,
      input: { audio: sourceUrl, model_name: "htdemucs", stem: "vocals", output_format: "mp3", mp3_bitrate: 320 },
    }),
  });
  if (!response.ok) throw new Error(await providerError(response));
  return await response.json() as ReplicatePrediction;
}

export async function getAudioPrediction(id: string) {
  const response = await fetch(`${REPLICATE_API}/predictions/${id}`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await providerError(response));
  return await response.json() as ReplicatePrediction;
}

function asUrl(value: unknown) {
  if (typeof value === "string" && /^https?:\/\//.test(value)) return value;
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === "string" && /^https?:\/\//.test(url) ? url : null;
  }
  return null;
}

export function extractStemUrls(output: unknown) {
  if (!output || typeof output !== "object" || Array.isArray(output)) throw new Error("분리 결과 형식을 읽지 못했습니다.");
  const record = output as Record<string, unknown>;
  const firstUrl = (keys: string[]) => keys.map((key) => asUrl(record[key])).find(Boolean) ?? null;
  const vocalsUrl = firstUrl(["vocals", "vocal"]);
  const instrumentalUrl = firstUrl(["no_stem", "no_vocals", "instrumental", "accompaniment", "other"]);
  if (!vocalsUrl || !instrumentalUrl) throw new Error("보컬과 반주 결과 파일을 모두 받지 못했습니다.");
  return { vocalsUrl, instrumentalUrl };
}

export function describeAudioError(error: unknown) {
  const message = error instanceof Error ? error.message : "음원 분리 요청에 실패했습니다.";
  if (/\b402\b/i.test(message) && /insufficient credit/i.test(message)) return "Replicate 잔액이 부족합니다. 크레딧을 충전한 뒤 다시 시도해 주세요.";
  if (/\b401\b|unauthorized/i.test(message)) return "Replicate API 토큰을 확인해 주세요.";
  return message;
}
