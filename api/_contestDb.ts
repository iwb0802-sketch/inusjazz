/**
 * 보이스 크라운 콘테스트 - DB 공용 헬퍼 (Railway Postgres)
 * api/hearts.ts, api/grandprix.ts에서 공용으로 사용
 *
 * 필요 환경변수: DATABASE_URL (Railway Postgres 연결 문자열)
 */
import pg from "pg";
const { Pool } = pg;
type Pool = pg.Pool;
type PoolClient = pg.PoolClient;
import { monthStamp, nextMonthStamp, prevMonthStamp } from "../shared/contestMonth.js";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
      max: 3,
      connectionTimeoutMillis: 8000,
    });
  }
  return pool;
}

export async function ensureSchema(client: PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS contest_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS hearts_current (
      contestant_name TEXT PRIMARY KEY,
      hearts INT NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS hearts_history (
      month_stamp TEXT NOT NULL,
      contestant_name TEXT NOT NULL,
      hearts INT NOT NULL DEFAULT 0,
      PRIMARY KEY (month_stamp, contestant_name)
    );
    CREATE TABLE IF NOT EXISTS champions (
      month_stamp TEXT PRIMARY KEY,
      contestant_name TEXT NOT NULL,
      hearts INT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS daily_plays (
      device_id TEXT NOT NULL,
      play_date DATE NOT NULL,
      play_count INT NOT NULL DEFAULT 0,
      PRIMARY KEY (device_id, play_date)
    );
  `);
}

/**
 * 하루 중복 투표(어뷰징) 방지: 기기(device_id) 기준 하루 최초 플레이만
 * 전체 공유 집계(하트)에 반영되도록, 토너먼트 시작 시 호출.
 * 반환된 count가 limit 이하면 이번 판은 집계에 반영(withinLimit=true),
 * 초과하면 재플레이는 "연습 모드"로 처리(집계에 반영 안 함).
 */
export async function registerPlayAndCheckLimit(
  client: PoolClient,
  deviceId: string,
  limit = 1
): Promise<{ count: number; withinLimit: boolean }> {
  const res = await client.query(
    `INSERT INTO daily_plays (device_id, play_date, play_count)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (device_id, play_date)
     DO UPDATE SET play_count = daily_plays.play_count + 1
     RETURNING play_count`,
    [deviceId]
  );
  const count = res.rows[0]?.play_count ?? 1;
  return { count, withinLimit: count <= limit };
}

/**
 * 월이 바뀌었으면:
 * 1) 직전(들) 달의 hearts_current -> hearts_history로 아카이브
 * 2) 그 달의 최다 하트 사회자를 champions에 확정 기록
 * 3) hearts_current 초기화
 * 4) contest_meta.current_month_stamp 갱신
 * (여러 달 건너뛴 경우, 즉 몇 달간 트래픽이 전혀 없었을 경우에도 루프 돌며 순서대로 처리)
 */
export async function rolloverIfNeeded(client: PoolClient) {
  const now = monthStamp();
  const metaRes = await client.query(
    `SELECT value FROM contest_meta WHERE key = 'current_month_stamp'`
  );
  const stored: string | undefined = metaRes.rows[0]?.value;

  if (!stored) {
    await client.query(
      `INSERT INTO contest_meta (key, value) VALUES ('current_month_stamp', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [now]
    );
    return;
  }

  let cursor = stored;
  while (cursor !== now) {
    const currentRows = (
      await client.query(
        `SELECT contestant_name, hearts FROM hearts_current`
      )
    ).rows as { contestant_name: string; hearts: number }[];

    for (const row of currentRows) {
      await client.query(
        `INSERT INTO hearts_history (month_stamp, contestant_name, hearts)
         VALUES ($1, $2, $3)
         ON CONFLICT (month_stamp, contestant_name) DO UPDATE SET hearts = $3`,
        [cursor, row.contestant_name, row.hearts]
      );
    }

    const top = [...currentRows].sort((a, b) => b.hearts - a.hearts)[0];
    if (top && top.hearts > 0) {
      await client.query(
        `INSERT INTO champions (month_stamp, contestant_name, hearts)
         VALUES ($1, $2, $3)
         ON CONFLICT (month_stamp) DO UPDATE SET contestant_name = $2, hearts = $3`,
        [cursor, top.contestant_name, top.hearts]
      );
    }

    await client.query(`DELETE FROM hearts_current`);

    cursor = nextMonthStamp(cursor);
  }

  await client.query(
    `UPDATE contest_meta SET value = $1 WHERE key = 'current_month_stamp'`,
    [now]
  );
}

export async function getLastMonthChampion(client: PoolClient) {
  const now = monthStamp();
  const last = prevMonthStamp(now);
  const res = await client.query(
    `SELECT contestant_name, hearts FROM champions WHERE month_stamp = $1`,
    [last]
  );
  if (res.rows.length === 0) return null;
  return {
    name: res.rows[0].contestant_name as string,
    hearts: res.rows[0].hearts as number,
    monthStamp: last,
  };
}
