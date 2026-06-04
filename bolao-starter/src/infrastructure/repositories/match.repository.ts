import { prisma } from "../prisma/index.js";

export class MatchRepository {
  async list(filters: { stage?: string; status?: string }) {
    const where: any = {};

    if (filters.stage) {
      where.stage = filters.stage;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return await prisma.match.findMany({ where, orderBy: { kickoffAt: "asc" } });
  }

  async findById(id: number) {
    return await prisma.match.findUnique({ where: { id } });
  }
}
