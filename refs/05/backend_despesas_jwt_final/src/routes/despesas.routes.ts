import { Router } from "express";
import { DespesasController } from "../controllers/despesas.controller";
import { authMiddleware } from "../middleware/auth";

export const despesasRouter = Router();

despesasRouter.use(authMiddleware);

despesasRouter.get("/", DespesasController.list);
despesasRouter.get("/:id", DespesasController.getById);
despesasRouter.post("/", DespesasController.create);
despesasRouter.put("/:id", DespesasController.update);
despesasRouter.delete("/:id", DespesasController.remove);
