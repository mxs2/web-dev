import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
