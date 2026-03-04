import { prisma } from "../lib/prisma";

type ListParams = {
  userId?: number;
  isAdmin?: boolean;
};

type CreateDespesaInput = {
  descricao: string;
  valor: number;
  data: Date;
  categoria?: string;
  userId: number;
};

type UpdateDespesaInput = {
  descricao?: string;
  valor?: number;
  data?: Date;
  categoria?: string;
};

export const DespesasService = {
  async list(params: ListParams) {
    const { userId, isAdmin } = params;
    const where = !isAdmin && userId ? { userId } : {};
    return prisma.despesa.findMany({
      where,
      orderBy: { data: "desc" }
    });
  },

  async getById(id: number) {
    return prisma.despesa.findUnique({ where: { id } });
  },

  async create(input: CreateDespesaInput) {
    return prisma.despesa.create({ data: input });
  },

  async update(id: number, input: UpdateDespesaInput) {
    try {
      return await prisma.despesa.update({
        where: { id },
        data: input
      });
    } catch (e) {
      return null;
    }
  },

  async remove(id: number) {
    try {
      await prisma.despesa.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  }
};
