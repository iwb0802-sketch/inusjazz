import type { VercelRequest, VercelResponse } from "@vercel/node";
import { get, put } from "@vercel/blob";

export const config = { runtime: "nodejs" };

const GUIDE_PATH = "ai-script/company-guides.json";
const MAX_GUIDE_LENGTH = 30000;

type SharedGuideDocument = {
  version: 1;
  guide: string;
  learnedPatterns: LearnedPattern[];
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
  return { version: 1, guide: "", learnedPatterns: [], updatedAt: null };
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

function normalizeDocument(value: unknown): SharedGuideDocument {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    version: 1,
    guide: cleanText(record.guide, MAX_GUIDE_LENGTH),
    learnedPatterns: normalizePatterns(record.learnedPatterns),
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
    const guide = cleanText(body.guide, MAX_GUIDE_LENGTH);
    if (!guide) {
      res.status(400).json({ error: "저장할 회사 지침을 입력해주세요." });
      return;
    }

    const existing = await readSharedGuide();
    const document: SharedGuideDocument = {
      version: 1,
      guide,
      learnedPatterns: Array.isArray(body.learnedPatterns) ? normalizePatterns(body.learnedPatterns) : existing.learnedPatterns,
      updatedAt: new Date().toISOString(),
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
