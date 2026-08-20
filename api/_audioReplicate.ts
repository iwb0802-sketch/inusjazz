export type ReplicatePrediction = { id: string; status: string; error?: string | null; output?: unknown };
const API = "https://api.replicate.com/v1";
let cachedVersion: { id: string; expiresAt: number } | null = null;

function headers() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN 환경변수가 설정되지 않았습니다.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}
async function errorFor(response: Response) {
  const detail = await response.text().catch(() => "");
  return `Replicate 요청 실패 (${response.status})${detail ? `: ${detail}` : ""}`;
}
async function version() {
  if (cachedVersion && cachedVersion.expiresAt > Date.now()) return cachedVersion.id;
  const response = await fetch(`${API}/models/cjwbw/demucs`, { headers: headers() });
  if (!response.ok) throw new Error(await errorFor(response));
  const model = await response.json() as { latest_version?: { id?: string } };
  if (!model.latest_version?.id) throw new Error("Replicate Demucs 최신 버전을 찾지 못했습니다.");
  cachedVersion = { id: model.latest_version.id, expiresAt: Date.now() + 10 * 60 * 1000 };
  return cachedVersion.id;
}
export async function createPrediction(sourceUrl: string) {
  const response = await fetch(`${API}/predictions`, { method: "POST", headers: headers(), body: JSON.stringify({ version: await version(), input: { audio: sourceUrl, model_name: "htdemucs", stem: "vocals", output_format: "mp3", mp3_bitrate: 320 } }) });
  if (!response.ok) throw new Error(await errorFor(response));
  return await response.json() as ReplicatePrediction;
}
export async function getPrediction(id: string) {
  const response = await fetch(`${API}/predictions/${id}`, { headers: headers() });
  if (!response.ok) throw new Error(await errorFor(response));
  return await response.json() as ReplicatePrediction;
}
function urlFor(value: unknown) {
  if (typeof value === "string" && /^https?:\/\//.test(value)) return value;
  if (value && typeof value === "object" && "url" in value) { const url = (value as { url?: unknown }).url; return typeof url === "string" && /^https?:\/\//.test(url) ? url : null; }
  return null;
}
export function stemsFrom(output: unknown) {
  if (!output || typeof output !== "object" || Array.isArray(output)) throw new Error("분리 결과 형식을 읽지 못했습니다.");
  const record = output as Record<string, unknown>;
  const find = (names: string[]) => names.map((name) => urlFor(record[name])).find(Boolean) ?? null;
  const vocalsUrl = find(["vocals", "vocal"]);
  const instrumentalUrl = find(["no_stem", "no_vocals", "instrumental", "accompaniment", "other"]);
  if (!vocalsUrl || !instrumentalUrl) throw new Error("보컬과 MR 파일을 모두 받지 못했습니다.");
  return { vocalsUrl, instrumentalUrl };
}
