import type { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Operasi berhasil",
  statusCode = 200,
  meta?: Record<string, unknown>
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
}

export function sendError(
  res: Response,
  message = "Terjadi kesalahan",
  statusCode = 400,
  error?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    message,
    error
  });
}

