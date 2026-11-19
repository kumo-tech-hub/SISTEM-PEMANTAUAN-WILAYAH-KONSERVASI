import type { Request, Response } from "express";
import * as healthService from "./health.service.js";

export async function checkHealth(_req: Request, res: Response): Promise<void> {
  const data = await healthService.getHealthStatus();
  const statusCode = data.database === "connected" ? 200 : 503;
  res.status(statusCode).json(data);
}

