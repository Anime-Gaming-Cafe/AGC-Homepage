import "server-only";
import { getPrisma } from "@/lib/prisma";

export async function getPageDescription(): Promise<string | null> {
  const row = await getPrisma().pageDescription.findUnique({ where: { id: 1 } });
  return row?.description ?? null;
}

export async function getPageInformation(): Promise<string | null> {
  const row = await getPrisma().pageInformation.findUnique({ where: { id: 1 } });
  return row?.information ?? null;
}

export async function updatePageDescription(text: string): Promise<void> {
  await getPrisma().pageDescription.upsert({
    where: { id: 1 },
    create: { id: 1, description: text },
    update: { description: text },
  });
}

export async function updatePageInformation(text: string): Promise<void> {
  await getPrisma().pageInformation.upsert({
    where: { id: 1 },
    create: { id: 1, information: text },
    update: { information: text },
  });
}

export async function getTotalMessages(): Promise<string | null> {
  const row = await getPrisma().msgs.findUnique({ where: { id: 1 } });
  return row ? row.count.toString() : null;
}

export async function getTodayMessages(): Promise<string | null> {
  const row = await getPrisma().todayMsgs.findUnique({ where: { id: 1 } });
  return row ? row.count.toString() : null;
}

export async function getTodayJoins(): Promise<string | null> {
  const row = await getPrisma().todayJoins.findUnique({ where: { id: 1 } });
  return row ? row.count.toString() : null;
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
  const rows = await getPrisma().teamProfile.findMany({
    where: { userId: { in: userIds.map((id) => BigInt(id)) } },
  });
  for (const row of rows) {
    const userId = row.userId.toString();
    profiles.set(userId, {
      userId,
      frontDesc: row.frontDesc,
      backDesc: row.backDesc,
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
  const id = BigInt(userId);
  const previous = await getPrisma().teamProfile.findUnique({
    where: { userId: id },
  });

  if (
    previous?.frontDesc === frontDesc &&
    previous?.backDesc === backDesc
  ) {
    return;
  }

  await getPrisma().$transaction([
    getPrisma().teamProfile.upsert({
      where: { userId: id },
      create: { userId: id, frontDesc, backDesc },
      update: { frontDesc, backDesc },
    }),
    getPrisma().profileEdit.create({
      data: {
        userId: id,
        frontBefore: previous?.frontDesc ?? null,
        backBefore: previous?.backDesc ?? null,
        frontAfter: frontDesc,
        backAfter: backDesc,
      },
    }),
  ]);
}

export interface ProfileEditRecord {
  id: number;
  userId: string;
  editedAt: Date;
  frontBefore: string | null;
  backBefore: string | null;
  frontAfter: string | null;
  backAfter: string | null;
}

export async function getProfileEdits(
  limit = 100
): Promise<ProfileEditRecord[]> {
  const rows = await getPrisma().profileEdit.findMany({
    orderBy: { editedAt: "desc" },
    take: limit,
  });
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId.toString(),
    editedAt: row.editedAt,
    frontBefore: row.frontBefore,
    backBefore: row.backBefore,
    frontAfter: row.frontAfter,
    backAfter: row.backAfter,
  }));
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

export async function getPartners(): Promise<PartnerRecord[]> {
  return getPrisma().partner.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}

export async function createPartner(input: PartnerInput): Promise<void> {
  const prisma = getPrisma();
  const highest = await prisma.partner.findFirst({
    orderBy: { sortOrder: "desc" },
  });
  await prisma.partner.create({
    data: { ...input, sortOrder: (highest?.sortOrder ?? 0) + 10 },
  });
}

export async function updatePartner(
  id: number,
  input: PartnerInput
): Promise<void> {
  await getPrisma().partner.update({ where: { id }, data: input });
}

export async function deletePartner(id: number): Promise<void> {
  await getPrisma().partner.delete({ where: { id } });
}

export async function movePartner(
  id: number,
  direction: "up" | "down"
): Promise<void> {
  const prisma = getPrisma();
  const partners = await getPartners();
  const index = partners.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= partners.length) return;

  const a = partners[index];
  const b = partners[swapWith];
  await prisma.$transaction([
    prisma.partner.update({
      where: { id: a.id },
      data: { sortOrder: b.sortOrder },
    }),
    prisma.partner.update({
      where: { id: b.id },
      data: { sortOrder: a.sortOrder },
    }),
  ]);
}
