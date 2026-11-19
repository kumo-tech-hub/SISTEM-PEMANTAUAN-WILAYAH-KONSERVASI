import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { apiRouter } from "./routes.js";
import { env } from "./shared/config/env.js";
import { errorHandler, notFoundHandler } from "./shared/middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // Ekspos file upload statis (foto laporan pesisir)
  const uploadPath = path.resolve(process.cwd(), env.uploadDir);
  app.use("/uploads", express.static(uploadPath));

  // Pendaftaran router API utama
  app.use("/api", apiRouter);

  // Error handling terpusat
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
