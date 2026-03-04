import { Router } from "express";
import { UsersController } from "../controllers/users.controller";

export const usersRouter = Router();

// TODO: futuramente adicionar rota de login e proteção por role

usersRouter.get("/", UsersController.list);
usersRouter.post("/", UsersController.create);
