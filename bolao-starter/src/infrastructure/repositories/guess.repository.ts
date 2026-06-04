import { prisma } from "../prisma/index.js";

export class GuessRepository {
  async findByParticipantAndMatch(participantId: number, matchId: number, poolId: number) {
    return await prisma.guess.findUnique({
      where: {
        participantId_matchId_poolId: {
          participantId,
          matchId,
          poolId,
        },
      },
      include: { match: true, participant: true },
    });
  }

  async create(data: {
    poolId: number;
    participantId: number;
    matchId: number;
    homeScore: number;
    awayScore: number;
  }) {
    return await prisma.guess.create({ data });
  }

  async update(id: number, data: { homeScore?: number; awayScore?: number }) {
    return await prisma.guess.update({ where: { id }, data });
  }

  async findById(id: number) {
    return await prisma.guess.findUnique({
      where: { id },
      include: { match: true, participant: true },
    });
  }

  async listByPool(poolId: number) {
    return await prisma.guess.findMany({
      where: { poolId },
      include: { participant: true, match: true },
    });
  }
}
