import { Router } from "express";
import { despesasRouter } from "./despesas.routes";
import { usersRouter } from "./users.routes";

export const router = Router();

// Rotas públicas por enquanto (sem autenticação)
router.use("/despesas", despesasRouter);
router.use("/users", usersRouter);
