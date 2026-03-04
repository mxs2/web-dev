import { createApp } from "./infrastructure/http/app";
import { env } from "./shared/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[server] up on port ${env.PORT}`);
});
