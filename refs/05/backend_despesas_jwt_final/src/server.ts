import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (_req, res) => {
  res.send("API de Despesas - backend ativo");
});

app.listen(env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
});
