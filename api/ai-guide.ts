import type { VercelRequest, VercelResponse } from "@vercel/node";
import { get, put } from "@vercel/blob";

export const config = { runtime: "nodejs" };

const GUIDE_PATH = "ai-script/company-guides.json";
const MAX_GUIDE_LENGTH = 30000;
const MAX_HISTORY_ITEMS = 20;

type GuideVersion = {
  id: string;
  guide: string;
  savedAt: string;
};

type SharedGuideDocument = {
  version: 2;
  guide: string;
  learnedPatterns: LearnedPattern[];
  guideHistory: GuideVersion[];
  currentVersionId: string | null;
  updatedAt: string | null;
};

type LearnedPattern = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
};

type SaveGuidePayload = {
  guide?: unknown;
  learnedPatterns?: unknown;
  restoreVersionId?: unknown;
};

function addCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Inus-Ai-Password");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.AI_SCRIPT_ADMIN_PASSWORD || "";
  const header = req.headers["x-inus-ai-password"];
  const provided = Array.isArray(header) ? header[0] : (header || "");

  if (!expected) {
    res.status(500).json({ error: "AI_SCRIPT_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." });
    return false;
  }
  if (provided !== expected) {
    res.status(401).json({ error: "관리자 인증 정보가 올바르지 않습니다." });
    return false;
  }
  return true;
}

function cleanText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function emptyDocument(): SharedGuideDocument {
  return { version: 2, guide: "", learnedPatterns: [], guideHistory: [], currentVersionId: null, updatedAt: null };
}

function normalizePatterns(value: unknown): LearnedPattern[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20).map((item, index) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return {
      id: cleanText(record.id, 100) || `pattern-${index + 1}`,
      title: cleanText(record.title, 160) || `학습 요약 ${index + 1}`,
      summary: cleanText(record.summary, 8000),
      createdAt: cleanText(record.createdAt, 40) || new Date().toISOString(),
    };
  }).filter((item) => Boolean(item.summary));
}

function normalizeHistory(value: unknown): GuideVersion[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.map((item, index) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const id = cleanText(record.id, 100) || `legacy-${index + 1}`;
    return {
      id,
      guide: cleanText(record.guide, MAX_GUIDE_LENGTH),
      savedAt: cleanText(record.savedAt, 40) || new Date().toISOString(),
    };
  }).filter((item) => {
    if (!item.guide || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).slice(0, MAX_HISTORY_ITEMS);
}

function normalizeDocument(value: unknown): SharedGuideDocument {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const guide = cleanText(record.guide, MAX_GUIDE_LENGTH);
  const history = normalizeHistory(record.guideHistory);
  const currentVersionId = cleanText(record.currentVersionId, 100) || null;
  const existingCurrent = currentVersionId && history.some((item) => item.id === currentVersionId) ? currentVersionId : null;

  if (guide && history.length === 0) {
    const migratedVersion: GuideVersion = {
      id: "legacy-current",
      guide,
      savedAt: cleanText(record.updatedAt, 40) || new Date().toISOString(),
    };
    return {
      version: 2,
      guide,
      learnedPatterns: normalizePatterns(record.learnedPatterns),
      guideHistory: [migratedVersion],
      currentVersionId: migratedVersion.id,
      updatedAt: cleanText(record.updatedAt, 40) || migratedVersion.savedAt,
    };
  }

  return {
    version: 2,
    guide,
    learnedPatterns: normalizePatterns(record.learnedPatterns),
    guideHistory: history,
    currentVersionId: existingCurrent,
    updatedAt: cleanText(record.updatedAt, 40) || null,
  };
}

function parseBody(req: VercelRequest): SaveGuidePayload {
  if (typeof req.body === "string") return JSON.parse(req.body) as SaveGuidePayload;
  return (req.body || {}) as SaveGuidePayload;
}

async function readSharedGuide(): Promise<SharedGuideDocument> {
  const result = await get(GUIDE_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return emptyDocument();

  const text = await new Response(result.stream).text();
  try {
    return normalizeDocument(JSON.parse(text));
  } catch {
    return emptyDocument();
  }
}

async function saveSharedGuide(document: SharedGuideDocument): Promise<void> {
  await put(GUIDE_PATH, JSON.stringify(document), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
}

function newVersionId(now: string): string {
  return `guide-${now.replace(/[^0-9]/g, "").slice(0, 14)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (addCors(req, res)) return;
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === "GET") {
      const document = await readSharedGuide();
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(document);
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "GET 또는 POST 요청만 허용됩니다." });
      return;
    }

    const body = parseBody(req);
    const existing = await readSharedGuide();
    const restoreVersionId = cleanText(body.restoreVersionId, 100);

    if (restoreVersionId) {
      const selected = existing.guideHistory.find((item) => item.id === restoreVersionId);
      if (!selected) {
        res.status(404).json({ error: "선택한 저장 버전을 찾을 수 없습니다. 최신 지침을 다시 불러온 후 시도해주세요." });
        return;
      }
      const restored: SharedGuideDocument = {
        ...existing,
        guide: selected.guide,
        currentVersionId: selected.id,
        updatedAt: new Date().toISOString(),
      };
      await saveSharedGuide(restored);
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(restored);
      return;
    }

    const guide = cleanText(body.guide, MAX_GUIDE_LENGTH);
    if (!guide) {
      res.status(400).json({ error: "저장할 회사 지침을 입력해주세요." });
      return;
    }

    const now = new Date().toISOString();
    const alreadySaved = existing.guideHistory.find((item) => item.guide === guide);
    const currentVersion = alreadySaved || { id: newVersionId(now), guide, savedAt: now };
    const history = [currentVersion, ...existing.guideHistory.filter((item) => item.id !== currentVersion.id)].slice(0, MAX_HISTORY_ITEMS);
    const document: SharedGuideDocument = {
      version: 2,
      guide,
      learnedPatterns: Array.isArray(body.learnedPatterns) ? normalizePatterns(body.learnedPatterns) : existing.learnedPatterns,
      guideHistory: history,
      currentVersionId: currentVersion.id,
      updatedAt: now,
    };
    await saveSharedGuide(document);

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(document);
  } catch (error) {
    console.error("Shared AI guide error:", error);
    const message = error instanceof Error ? error.message : "공용 회사 지침 저장 중 오류가 발생했습니다.";
    res.status(500).json({ error: message });
  }
}
