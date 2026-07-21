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
    CREATE TABLE IF NOT EXISTS rank_snapshots (
      snapshot_date DATE NOT NULL,
      contestant_name TEXT NOT NULL,
      hearts INT NOT NULL DEFAULT 0,
      PRIMARY KEY (snapshot_date, contestant_name)
    );
    CREATE TABLE IF NOT EXISTS contest_events (
      id SERIAL PRIMARY KEY,
      event_type TEXT NOT NULL,
      contestant_name TEXT,
      device_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

/**
 * KST(Asia/Seoul) 기준 오늘 날짜의 하트 스냅샷을 하루에 한 번만 저장한다.
 * 그날의 첫 API 호출(GET/POST 어느 쪽이든) 시점에, 그 요청이 하트를 변경하기 "전" 상태를
 * 그대로 스냅샷으로 남겨 "자정 시점 값"에 가깝게 만든다.
 * 이후 현재 hearts_current 값과 이 스냅샷을 비교하면 당일(=전일 대비) 순위 변동을 계산할 수 있다.
 */
export async function ensureDailySnapshot(client: PoolClient) {
  const existsRes = await client.query(
    `SELECT 1 FROM rank_snapshots WHERE snapshot_date = (now() AT TIME ZONE 'Asia/Seoul')::date LIMIT 1`
  );
  if (existsRes.rows.length > 0) return;

  const currentRows = (
    await client.query(`SELECT contestant_name, hearts FROM hearts_current`)
  ).rows as { contestant_name: string; hearts: number }[];

  for (const row of currentRows) {
    await client.query(
      `INSERT INTO rank_snapshots (snapshot_date, contestant_name, hearts)
       VALUES ((now() AT TIME ZONE 'Asia/Seoul')::date, $1, $2)
       ON CONFLICT (snapshot_date, contestant_name) DO NOTHING`,
      [row.contestant_name, row.hearts]
    );
  }
}

/** 오늘(KST) 스냅샷 값을 반환 (없으면 빈 객체) - 현재값과 비교해 순위변동 계산용 */
export async function getTodaySnapshot(client: PoolClient): Promise<Record<string, number>> {
  const rows = (
    await client.query(
      `SELECT contestant_name, hearts FROM rank_snapshots WHERE snapshot_date = (now() AT TIME ZONE 'Asia/Seoul')::date`
    )
  ).rows as { contestant_name: string; hearts: number }[];
  const map: Record<string, number> = {};
  for (const r of rows) map[r.contestant_name] = r.hearts;
  return map;
}

/**
 * 두 하트 맵으로 각각 순위를 매겨, 사회자별 순위 변동(양수=상승, 음수=하락, 0=동일)을 계산한다.
 * 새로 진입해 이전 스냅샷에 없던 사회자는 변동 없음(null)으로 처리.
 */
export function computeRankChange(
  before: Record<string, number>,
  after: Record<string, number>
): Record<string, number | null> {
  const rankOf = (map: Record<string, number>) => {
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const ranks: Record<string, number> = {};
    sorted.forEach(([name], idx) => {
      ranks[name] = idx + 1;
    });
    return ranks;
  };
  const beforeRanks = rankOf(before);
  const afterRanks = rankOf(after);
  const result: Record<string, number | null> = {};
  for (const name of Object.keys(after)) {
    if (!(name in beforeRanks)) {
      result[name] = null;
      continue;
    }
    result[name] = beforeRanks[name] - afterRanks[name];
  }
  return result;
}

/** 클릭/게임 이벤트 1건 기록 (실패해도 무시 - 통계용이라 메인 흐름을 막지 않음) */
export async function insertEvent(
  client: PoolClient,
  eventType: string,
  contestantName: string | null,
  deviceId: string | null
) {
  await client.query(
    `INSERT INTO contest_events (event_type, contestant_name, device_id) VALUES ($1, $2, $3)`,
    [eventType, contestantName, deviceId]
  );
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
