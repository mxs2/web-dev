import { prisma } from "../prisma/index.js";

export class PoolRepository {
  async findById(id: number) {
    return await prisma.pool.findUnique({ where: { id }, include: { participants: true } });
  }

  async findParticipant(poolId: number, participantId: number) {
    return await prisma.participant.findFirst({ where: { id: participantId, poolId } });
  }

  async removeParticipant(poolId: number, participantId: number) {
    return await prisma.participant.delete({ where: { id: participantId } });
  }
}
