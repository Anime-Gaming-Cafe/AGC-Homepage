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

export async function updatePageDescription(text: string): Promise<void> {
  await getPool().query("UPDATE pagedescription SET description = $1", [text]);
}

export async function updatePageInformation(text: string): Promise<void> {
  await getPool().query("UPDATE pageinformation SET information = $1", [text]);
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

export interface PartnerRecord {
  id: number;
  name: string;
  url: string;
  logoUrl: string;
  tagline: string;
  description: string;
  discordInviteCode: string | null;
  sortOrder: number;
}

export interface PartnerInput {
  name: string;
  url: string;
  logoUrl: string;
  tagline: string;
  description: string;
  discordInviteCode: string | null;
}

function mapPartnerRow(row: {
  id: number;
  name: string;
  url: string;
  logo_url: string;
  tagline: string;
  description: string;
  discord_invite_code: string | null;
  sort_order: number;
}): PartnerRecord {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    logoUrl: row.logo_url,
    tagline: row.tagline,
    description: row.description,
    discordInviteCode: row.discord_invite_code,
    sortOrder: row.sort_order,
  };
}

export async function getPartners(): Promise<PartnerRecord[]> {
  const result = await getPool().query(
    "SELECT id, name, url, logo_url, tagline, description, discord_invite_code, sort_order FROM partners ORDER BY sort_order ASC, id ASC"
  );
  return result.rows.map(mapPartnerRow);
}

export async function createPartner(input: PartnerInput): Promise<void> {
  const pool = getPool();
  const maxOrder = await pool.query(
    "SELECT COALESCE(MAX(sort_order), 0) AS max FROM partners"
  );
  const nextOrder = Number(maxOrder.rows[0].max) + 10;
  await pool.query(
    `INSERT INTO partners (name, url, logo_url, tagline, description, discord_invite_code, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.name,
      input.url,
      input.logoUrl,
      input.tagline,
      input.description,
      input.discordInviteCode,
      nextOrder,
    ]
  );
}

export async function updatePartner(
  id: number,
  input: PartnerInput
): Promise<void> {
  await getPool().query(
    `UPDATE partners
     SET name = $2, url = $3, logo_url = $4, tagline = $5, description = $6, discord_invite_code = $7
     WHERE id = $1`,
    [
      id,
      input.name,
      input.url,
      input.logoUrl,
      input.tagline,
      input.description,
      input.discordInviteCode,
    ]
  );
}

export async function deletePartner(id: number): Promise<void> {
  await getPool().query("DELETE FROM partners WHERE id = $1", [id]);
}

export async function movePartner(
  id: number,
  direction: "up" | "down"
): Promise<void> {
  const pool = getPool();
  const partners = await getPartners();
  const index = partners.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= partners.length) return;

  const a = partners[index];
  const b = partners[swapWith];
  await pool.query("UPDATE partners SET sort_order = $2 WHERE id = $1", [
    a.id,
    b.sortOrder,
  ]);
  await pool.query("UPDATE partners SET sort_order = $2 WHERE id = $1", [
    b.id,
    a.sortOrder,
  ]);
}
