import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/apiResponse.js";

export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
    404
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const message = err instanceof Error ? err.message : "Terjadi kesalahan internal server";
  console.error("[error]", err);

  sendError(res, message, 500, process.env.NODE_ENV === "development" ? err : undefined);
}

