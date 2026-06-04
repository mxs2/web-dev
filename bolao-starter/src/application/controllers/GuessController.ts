import { Request, Response } from "express";
import { GuessService } from "../../infrastructure/services/guess.service.js";

const service = new GuessService();

export class GuessController {
  create = async (req: Request, res: Response) => {
    try {
      const { poolId, participantId, matchId, homeScore, awayScore } = req.body;

      if (
        poolId == null ||
        participantId == null ||
        matchId == null ||
        homeScore == null ||
        awayScore == null
      ) {
        res
          .status(400)
          .json({
            error:
              "Campos obrigatórios ausentes: poolId, participantId, matchId, homeScore, awayScore",
          });
        return;
      }

      const guess = await service.create({
        poolId,
        participantId,
        matchId,
        homeScore,
        awayScore,
      });
      res.status(201).json(guess);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || "Internal error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { homeScore, awayScore } = req.body;
      const updated = await service.update(id, { homeScore, awayScore });
      res.json(updated);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || "Internal error" });
    }
  };

  ranking = async (req: Request, res: Response) => {
    try {
      const poolId = Number(req.params.poolId);
      const ranking = await service.ranking(poolId);
      res.json(ranking);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || "Internal error" });
    }
  };

  removeParticipant = async (req: Request, res: Response) => {
    try {
      const poolId = Number(req.params.poolId);
      const participantId = Number(req.params.participantId);
      await service.removeParticipant(poolId, participantId);
      res.status(204).send();
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || "Internal error" });
    }
  };
}
