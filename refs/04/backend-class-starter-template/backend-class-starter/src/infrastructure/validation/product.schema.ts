import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(3),
  priceCents: z.number().int().nonnegative(),
  inStock: z.boolean().optional().default(true),
  categoryId: z.number().int().positive(),
});

export const updateProductSchema = createProductSchema.partial();
