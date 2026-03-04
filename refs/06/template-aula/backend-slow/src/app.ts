
import express from "express";
import cors from "cors";
import { salesRoutes } from "./routes/salesRoutes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use("/api", salesRoutes);
