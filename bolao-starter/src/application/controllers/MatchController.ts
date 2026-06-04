import { Request, Response } from "express";
import { MatchRepository } from "../../infrastructure/repositories/match.repository.js";

const matchRepo = new MatchRepository();

export class MatchController {
  list = async (req: Request, res: Response) => {
    try {
      const stage = req.query.stage ? String(req.query.stage) : undefined;
      const status = req.query.status ? String(req.query.status) : undefined;

      const matches = await matchRepo.list({ stage, status });

      res.json(matches);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || "Internal error" });
    }
  };
}
