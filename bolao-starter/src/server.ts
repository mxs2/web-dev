import { createApp } from "./infrastructure/http/app.js";
import { env } from "./shared/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[server] up on port ${env.PORT}`);
});
