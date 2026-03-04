
import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`Servidor (lento) rodando na porta ${env.PORT}`);
});
