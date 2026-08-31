import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const DEFAULT_DATABASE_URL =
  "postgresql://neondb_owner:npg_rgNnmypYq52a@ep-silent-firefly-aes9ag38-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

export function databaseUrl() {
  return process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
}

export function hasDatabase() {
  return Boolean(databaseUrl());
}

export function getPrisma() {
  const connectionString = databaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
