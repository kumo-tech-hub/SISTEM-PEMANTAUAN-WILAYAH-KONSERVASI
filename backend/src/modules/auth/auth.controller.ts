import type { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../../shared/utils/apiResponse.js";
import * as authService from "./auth.service.js";

/**
 * Login tunggal (Unified Login)
 * Otomatis mendeteksi peran pengguna (admin atau reporter) berdasarkan data di database.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await authService.login(req.body);
    sendSuccess(
      res,
      session,
      `Login berhasil sebagai ${session.user.role === "admin" ? "Admin KKP" : "Pelapor Pesisir"}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan login";
    sendError(res, message, 401);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await authService.register(req.body);
    sendSuccess(res, session, "Registrasi akun berhasil", 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan registrasi";
    sendError(res, message, 400);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, "Pengguna tidak terautentikasi", 401);
      return;
    }

    const user = await authService.getUserById(req.user.id);
    if (!user) {
      sendError(res, "Profil pengguna tidak ditemukan", 404);
      return;
    }

    sendSuccess(res, user, "Profil pengguna berhasil diambil");
  } catch (error) {
    next(error);
  }
}
