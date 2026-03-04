import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { authMiddleware, requireAdmin } from "../middleware/auth";

export const usersRouter = Router();

// Cadastro de usuário - público
usersRouter.post("/", UsersController.create);

// Listagem de usuários - apenas admin
usersRouter.get("/", authMiddleware, requireAdmin, UsersController.list);
