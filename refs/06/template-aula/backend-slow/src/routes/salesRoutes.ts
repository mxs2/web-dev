
import { Router } from "express";
import { getSalesReport } from "../controllers/salesController";

export const salesRoutes = Router();

// endpoint público, sem autenticação
salesRoutes.get("/sales/report", getSalesReport);
