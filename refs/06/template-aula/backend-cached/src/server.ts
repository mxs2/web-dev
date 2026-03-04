
import { app } from "./app";
import { env } from "./config/env";
import { startCacheJob } from "./jobs/cacheJob";

startCacheJob();

app.listen(env.PORT, () => {
  console.log(`Servidor (cacheado) rodando na porta ${env.PORT}`);
});
