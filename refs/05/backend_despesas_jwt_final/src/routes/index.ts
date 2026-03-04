import { Router } from "express";
import { despesasRouter } from "./despesas.routes";
import { usersRouter } from "./users.routes";
import { authRouter } from "./auth.routes";

export const router = Router();

// Rotas de autenticação
router.use("/auth", authRouter);

// Rotas de domínio
router.use("/despesas", despesasRouter);
router.use("/users", usersRouter);
