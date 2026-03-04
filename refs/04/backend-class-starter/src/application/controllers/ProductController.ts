import { Request, Response } from "express";
import { ProductRepository } from "../../infrastructure/repositories/ProductRepository";
import { createProductSchema, updateProductSchema } from "../../infrastructure/validation/product.schema";

const repo = new ProductRepository();

export class ProductController {
  list = async (_req: Request, res: Response) => {
    const data = await repo.list();
    res.json(data);
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await repo.getById(id);
    if (!item) return res.status(404).json({ error: "Product not found" });
    res.json(item);
  };

  create = async (req: Request, res: Response) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const created = await repo.create(parsed.data);
    res.status(201).json(created);
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const updated = await repo.update(id, parsed.data);
    res.json(updated);
  };

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await repo.remove(id);
    res.status(204).end();
  };
}
