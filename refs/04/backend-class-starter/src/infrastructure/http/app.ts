import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "../../application/routes";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api", router);

  // Not found
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  // Error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message ?? "Internal Server Error" });
  });

  return app;
};
