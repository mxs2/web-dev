import { Router } from "express";
import { DespesasController } from "../controllers/despesas.controller";

export const despesasRouter = Router();

// TODO: proteger estas rotas com autenticação JWT na próxima etapa

despesasRouter.get("/", DespesasController.list);
despesasRouter.get("/:id", DespesasController.getById);
despesasRouter.post("/", DespesasController.create);
despesasRouter.put("/:id", DespesasController.update);
despesasRouter.delete("/:id", DespesasController.remove);
