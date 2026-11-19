import { createApp } from "./app.js";
import { ensureDefaultUsers } from "./modules/auth/auth.service.js";
import { closeDatabasePool } from "./shared/config/database.js";
import { env } from "./shared/config/env.js";

const app = createApp();

const server = app.listen(env.port, "0.0.0.0", async () => {
  console.log(`[simeka-backend] Running on http://0.0.0.0:${env.port} (${env.nodeEnv})`);
  console.log(`[simeka-backend] Modular API ready at http://0.0.0.0:${env.port}/api`);
  await ensureDefaultUsers();
});

async function shutdown(signal: string): Promise<void> {
  console.log(`[simeka-backend] Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    try {
      await closeDatabasePool();
      console.log("[simeka-backend] Database pool closed.");
      process.exit(0);
    } catch (error) {
      console.error("[simeka-backend] Error during shutdown:", error);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
