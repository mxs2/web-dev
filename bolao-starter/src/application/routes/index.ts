import { Router } from "express";
import { MatchController } from "../controllers/MatchController.js";
import { GuessController } from "../controllers/GuessController.js";

export const router = Router();

const matchCtrl = new MatchController();
const guessCtrl = new GuessController();

// Partidas
router.get("/matches", matchCtrl.list);

// Palpites
router.post("/guesses", guessCtrl.create);
router.patch("/guesses/:id", guessCtrl.update);

// Bolão — ranking e participantes
router.get("/pools/:poolId/ranking", guessCtrl.ranking);
router.delete("/pools/:poolId/participants/:participantId", guessCtrl.removeParticipant);
