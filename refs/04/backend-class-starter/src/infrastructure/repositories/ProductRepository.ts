import { prisma } from "../prisma";

export type CreateProductDTO = {
  name: string;
  sku: string;
  priceCents: number;
  inStock?: boolean;
  categoryId: number;
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export class ProductRepository {
  async list() {
    return prisma.product.findMany({ include: { category: true }, orderBy: { id: "asc" } });
  }
  async getById(id: number) {
    return prisma.product.findUnique({ where: { id }, include: { category: true } });
  }
  async create(data: CreateProductDTO) {
    return prisma.product.create({ data });
  }
  async update(id: number, data: UpdateProductDTO) {
    return prisma.product.update({ where: { id }, data });
  }
  async remove(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}
