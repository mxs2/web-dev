import { prisma } from "../prisma";

export class CategoryRepository {
  async list() {
    return prisma.category.findMany({ orderBy: { id: "asc" } });
  }
  async create(data: { name: string }) {
    return prisma.category.create({ data });
  }
}
