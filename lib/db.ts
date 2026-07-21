import "server-only";
import { Pool } from "pg";
import { getEnv } from "@/lib/config";

const globalForDb = globalThis as unknown as { __agcPool?: Pool };

function getPool(): Pool {
  if (!globalForDb.__agcPool) {
    globalForDb.__agcPool = new Pool({
      host: getEnv("DATABASE_HOST"),
      port: Number(process.env.DATABASE_PORT ?? 5432),
      user: getEnv("DATABASE_USER"),
      password: getEnv("DATABASE_PASSWORD"),
      database: getEnv("DATABASE_NAME"),
      max: 5,
    });
  }
  return globalForDb.__agcPool;
}

export function toDbUserId(snowflake: string): string {
  return BigInt.asIntN(64, BigInt(snowflake)).toString();
}

export function fromDbUserId(dbValue: string): string {
  return BigInt.asUintN(64, BigInt(dbValue)).toString();
}

async function queryScalar<T>(sql: string): Promise<T | null> {
  const result = await getPool().query(sql);
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return row[Object.keys(row)[0]] as T;
}

export async function getPageDescription(): Promise<string | null> {
  return queryScalar<string>("SELECT description FROM pagedescription");
}

export async function getPageInformation(): Promise<string | null> {
  return queryScalar<string>("SELECT information FROM pageinformation");
}

export async function getTotalMessages(): Promise<string | null> {
  return queryScalar<string>("SELECT count FROM msgs");
}

export async function getTodayMessages(): Promise<string | null> {
  return queryScalar<string>("SELECT count FROM todaymsgs");
}

export async function getTodayJoins(): Promise<string | null> {
  return queryScalar<string>("SELECT count FROM todayjoins");
}

export interface TeamProfile {
  userId: string;
  frontDesc: string | null;
  backDesc: string | null;
}

export async function getTeamProfiles(
  userIds: string[]
): Promise<Map<string, TeamProfile>> {
  const profiles = new Map<string, TeamProfile>();
  if (userIds.length === 0) return profiles;
  const result = await getPool().query(
    "SELECT userid, frontdesc, backdesc FROM teamprofile WHERE userid = ANY($1::bigint[])",
    [userIds.map(toDbUserId)]
  );
  for (const row of result.rows) {
    const userId = fromDbUserId(String(row.userid));
    profiles.set(userId, {
      userId,
      frontDesc: row.frontdesc ?? null,
      backDesc: row.backdesc ?? null,
    });
  }
  return profiles;
}

export async function getTeamProfile(
  userId: string
): Promise<TeamProfile | null> {
  const profiles = await getTeamProfiles([userId]);
  return profiles.get(userId) ?? null;
}

export async function upsertTeamProfile(
  userId: string,
  frontDesc: string,
  backDesc: string
): Promise<void> {
  const pool = getPool();
  const dbId = toDbUserId(userId);
  const existing = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM teamprofile WHERE userid = $1)",
    [dbId]
  );
  if (existing.rows[0].exists) {
    await pool.query(
      "UPDATE teamprofile SET frontdesc = $2, backdesc = $3 WHERE userid = $1",
      [dbId, frontDesc, backDesc]
    );
  } else {
    await pool.query(
      "INSERT INTO teamprofile (userid, frontdesc, backdesc) VALUES ($1, $2, $3)",
      [dbId, frontDesc, backDesc]
    );
  }
}
