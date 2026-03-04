import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient in dev with hot-reload
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [{ emit: "event", level: "query" }, "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optional: log all queries in dev
prisma.$on("query", (e) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[prisma] ${e.query} :: ${e.params}`);
  }
});
