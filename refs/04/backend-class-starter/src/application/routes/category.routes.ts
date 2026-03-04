import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

export const categoryRouter = Router();
const controller = new CategoryController();

categoryRouter.get("/", controller.list);
categoryRouter.post("/", controller.create);
