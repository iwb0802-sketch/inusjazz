import type { VercelRequest, VercelResponse } from "@vercel/node";
import { del, head, issueSignedToken, list, presignUrl, put } from "@vercel/blob";

export const config = { runtime: "nodejs", maxDuration: 300 };

const UPSTREAM_BACKUP_URL = "http://bnsmusics.godohosting.com/bns/admin/database_backup.php";
const BACKUP_PREFIX = "db-backups/";
const MAX_BACKUP_BYTES = 150 * 1024 * 1024;
const UPLOAD_URL_TTL_MS = 15 * 60 * 1000;
const DEFAULT_RETENTION_DAYS = 30;

type UpstreamBackupResponse = {
  ok: boolean;
  bytes: number;
  sha256: string;
  blobUrl: string;
  tableCount: number;
  rowCount: number;
  createdAt: string;
};

function headerValue(req: VercelRequest, name: string): string {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function cronAuthorized(req: VercelRequest): boolean {
  const cronSecret = process.env.CRON_SECRET || "";
  return Boolean(cronSecret) && headerValue(req, "authorization") === `Bearer ${cronSecret}`;
}

function textValue(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function integerValue(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function isSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function privateBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".private.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function retentionDays(): number {
  const configured = Number(process.env.DATABASE_BACKUP_RETENTION_DAYS || DEFAULT_RETENTION_DAYS);
  if (!Number.isSafeInteger(configured)) return DEFAULT_RETENTION_DAYS;
  return Math.min(Math.max(configured, 7), 365);
}

function backupPath(now: Date): string {
  const stamp = now.toISOString().replace(/[-:.TZ]/g, "");
  return `${BACKUP_PREFIX}${stamp.slice(0, 4)}/${stamp.slice(4, 6)}/inus-db-${stamp}.sql.gz`;
}

function parseUpstreamResponse(value: unknown): UpstreamBackupResponse {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const bytes = integerValue(record.bytes);
  const sha256 = textValue(record.sha256, 80).toLowerCase();
  const blobUrl = textValue(record.blobUrl, 2000);
  const tableCount = integerValue(record.tableCount);
  const rowCount = integerValue(record.rowCount);
  const createdAt = textValue(record.createdAt, 50);

  if (record.ok !== true || bytes === null || bytes < 100 || bytes > MAX_BACKUP_BYTES || !isSha256(sha256) || !privateBlobUrl(blobUrl) || tableCount === null || rowCount === null || !createdAt) {
    throw new Error("백업 서버의 완료 응답을 확인하지 못했습니다.");
  }

  return { ok: true, bytes, sha256, blobUrl, tableCount, rowCount, createdAt };
}

async function pruneExpiredBackups(cutoff: Date): Promise<number> {
  let cursor: string | undefined;
  let removed = 0;

  do {
    const page = await list({ prefix: BACKUP_PREFIX, limit: 1000, cursor });
    const expired = page.blobs
      .filter((blob) => (blob.pathname.endsWith(".sql.gz") || blob.pathname.endsWith(".json")) && blob.uploadedAt < cutoff)
      .map((blob) => blob.url);

    if (expired.length > 0) {
      await del(expired);
      removed += expired.length;
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return removed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.status(405).json({ ok: false, message: "GET 요청만 가능합니다." });
    return;
  }

  if (!cronAuthorized(req)) {
    res.status(401).json({ ok: false, message: "Unauthorized" });
    return;
  }

  const upstreamSecret = process.env.HAPPYCALL_SCHEDULER_SECRET || "";
  if (!upstreamSecret) {
    res.status(500).json({ ok: false, message: "백업 스케줄러 설정이 누락되었습니다." });
    return;
  }

  const now = new Date();
  const pathname = backupPath(now);
  const expiresAt = Date.now() + UPLOAD_URL_TTL_MS;

  try {
    const signedToken = await issueSignedToken({
      pathname,
      operations: ["put"],
      allowedContentTypes: ["application/gzip"],
      maximumSizeInBytes: MAX_BACKUP_BYTES,
      validUntil: expiresAt,
    });
    const upload = await presignUrl(signedToken, {
      operation: "put",
      pathname,
      access: "private",
      allowedContentTypes: ["application/gzip"],
      maximumSizeInBytes: MAX_BACKUP_BYTES,
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      validUntil: expiresAt,
    });

    const form = new URLSearchParams();
    form.set("secret", upstreamSecret);
    form.set("upload_url", upload.presignedUrl);

    const upstream = await fetch(UPSTREAM_BACKUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(280000),
    });
    const rawBody = await upstream.text();
    let parsedBody: unknown = {};
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      // 고도호스팅 오류 페이지는 개인·운영 정보를 포함할 수 있어 응답 본문을 보관하거나 노출하지 않는다.
    }

    if (!upstream.ok) {
      throw new Error("고도호스팅 DB 백업 실행에 실패했습니다.");
    }

    const backup = parseUpstreamResponse(parsedBody);
    const savedBlob = await head(backup.blobUrl);
    if (savedBlob.size !== backup.bytes) {
      throw new Error("저장된 백업 파일 크기 검증에 실패했습니다.");
    }

    const days = retentionDays();
    let reportSaved = true;
    try {
      await put(pathname.replace(/\.sql\.gz$/, ".json"), JSON.stringify({
        version: 1,
        createdAt: backup.createdAt,
        pathname,
        bytes: backup.bytes,
        sha256: backup.sha256,
        tableCount: backup.tableCount,
        rowCount: backup.rowCount,
      }), {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "application/json; charset=utf-8",
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      });
    } catch (error) {
      reportSaved = false;
      console.error("DB backup metadata write failed", error instanceof Error ? error.message : "unknown");
    }

    let deletedCount = 0;
    let retentionCleanupCompleted = true;
    try {
      deletedCount = await pruneExpiredBackups(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));
    } catch (error) {
      retentionCleanupCompleted = false;
      console.error("DB backup retention cleanup failed", error instanceof Error ? error.message : "unknown");
    }
    console.log("DB backup completed", { pathname, bytes: backup.bytes, tableCount: backup.tableCount, rowCount: backup.rowCount, deletedCount, retentionCleanupCompleted });

    res.status(200).json({
      ok: true,
      pathname,
      bytes: backup.bytes,
      tableCount: backup.tableCount,
      rowCount: backup.rowCount,
      retentionDays: days,
      deletedCount,
      reportSaved,
      retentionCleanupCompleted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "DB 백업 중 오류가 발생했습니다.";
    console.error("DB backup failed", message);
    res.status(502).json({ ok: false, message });
  }
}
