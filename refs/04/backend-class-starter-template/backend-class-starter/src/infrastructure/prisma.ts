import { PrismaClient } from "@prisma/client";

// Cria um tipo global para armazenar a instância do Prisma
// Isso ajuda a reutilizar a conexão durante o hot reload no desenvolvimento
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Reutiliza uma instância existente do PrismaClient
// ou cria uma nova caso ainda não exista
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Configura logs do Prisma
    // query -> logs de queries SQL
    // info/warn/error -> logs internos do Prisma
    log: [{ emit: "event", level: "query" }, "info", "warn", "error"],
  });

// Em ambiente de desenvolvimento,
// salva a instância globalmente para evitar múltiplas conexões
// causadas pelo hot reload do Node/TSX
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Escuta eventos de execução de queries SQL
prisma.$on("query", (e) => {
  // Exibe queries apenas em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.log(`[prisma] ${e.query} :: ${e.params}`);
  }
});