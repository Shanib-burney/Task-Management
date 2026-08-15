import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma-client";
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SCHEMA } =
  process.env;

if (
  !DB_HOST ||
  !DB_PORT ||
  !DB_USERNAME ||
  !DB_PASSWORD ||
  !DB_NAME ||
  !DB_SCHEMA
) {
  throw new Error(
    "One or more required DB environment variables are missing: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SCHEMA",
  );
}

// Build PostgreSQL connection string dynamically
const connectionString = `postgresql://${encodeURIComponent(
  DB_USERNAME,
)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}`;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    errorFormat: "minimal",
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
