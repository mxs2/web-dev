import { Router } from "express";
import { productRouter } from "./product.routes";
import { categoryRouter } from "./category.routes";

export const router = Router();

router.use("/products", productRouter);
router.use("/categories", categoryRouter);
