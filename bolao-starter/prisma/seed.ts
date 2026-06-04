import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Partidas da fase de grupos
  await prisma.match.createMany({
    data: [
      {
        homeTeam: "Brasil",
        awayTeam: "Argentina",
        stage: "GRUPOS",
        kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        status: "SCHEDULED",
      },
      {
        homeTeam: "França",
        awayTeam: "Alemanha",
        stage: "GRUPOS",
        kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
        status: "SCHEDULED",
      },
      {
        homeTeam: "Portugal",
        awayTeam: "Espanha",
        stage: "GRUPOS",
        kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        status: "SCHEDULED",
      },
      {
        homeTeam: "Japão",
        awayTeam: "Coreia do Sul",
        stage: "GRUPOS",
        kickoffAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // já aconteceu
        homeScore: 2,
        awayScore: 1,
        status: "FINISHED",
      },
    ],
    skipDuplicates: true,
  });

  // Bolão de exemplo
  const pool = await prisma.pool.upsert({
    where: { code: "BOLAO-2026" },
    update: {},
    create: {
      name: "Bolão da Turma",
      code: "BOLAO-2026",
    },
  });

  // Participantes de exemplo
  const p1 = await prisma.participant.upsert({
    where: { email_poolId: { email: "joao@example.com", poolId: pool.id } },
    update: {},
    create: { name: "João Silva", email: "joao@example.com", poolId: pool.id },
  });

  const p2 = await prisma.participant.upsert({
    where: { email_poolId: { email: "maria@example.com", poolId: pool.id } },
    update: {},
    create: { name: "Maria Souza", email: "maria@example.com", poolId: pool.id },
  });

  // Partida já finalizada para exemplo de palpite com pontuação
  const finishedMatch = await prisma.match.findFirst({
    where: { status: "FINISHED" },
  });

  if (finishedMatch) {
    await prisma.guess.upsert({
      where: {
        participantId_matchId_poolId: {
          participantId: p1.id,
          matchId: finishedMatch.id,
          poolId: pool.id,
        },
      },
      update: {},
      create: {
        poolId: pool.id,
        participantId: p1.id,
        matchId: finishedMatch.id,
        homeScore: 2,
        awayScore: 1,
        points: 3,
      },
    });

    await prisma.guess.upsert({
      where: {
        participantId_matchId_poolId: {
          participantId: p2.id,
          matchId: finishedMatch.id,
          poolId: pool.id,
        },
      },
      update: {},
      create: {
        poolId: pool.id,
        participantId: p2.id,
        matchId: finishedMatch.id,
        homeScore: 1,
        awayScore: 0,
        points: 1,
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
