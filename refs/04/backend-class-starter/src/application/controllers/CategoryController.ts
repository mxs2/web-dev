import { Request, Response } from "express";
import { CategoryRepository } from "../../infrastructure/repositories/CategoryRepository";

const repo = new CategoryRepository();

export class CategoryController {
  list = async (_req: Request, res: Response) => {
    const data = await repo.list();
    res.json(data);
  };

  create = async (req: Request, res: Response) => {
    const { name } = req.body ?? {};
    if (!name || typeof name !== "string") return res.status(400).json({ error: "name required" });
    const created = await repo.create({ name });
    res.status(201).json(created);
  };
}
