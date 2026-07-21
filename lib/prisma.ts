import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { getEnv } from "@/lib/config";

const globalForPrisma = globalThis as unknown as { __agcPrisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.__agcPrisma) {
    const adapter = new PrismaPg({ connectionString: getEnv("DATABASE_URL") });
    globalForPrisma.__agcPrisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.__agcPrisma;
}
