import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

export const productRouter = Router();
const controller = new ProductController();

productRouter.get("/", controller.list);
productRouter.get("/:id", controller.getById);
productRouter.post("/", controller.create);
productRouter.put("/:id", controller.update);
productRouter.delete("/:id", controller.remove);
