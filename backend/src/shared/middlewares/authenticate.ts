import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "reporter";
  agency?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Akses ditolak: token autentikasi tidak ditemukan", 401);
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.jwt.secret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      sendError(res, "Sesi login telah berakhir, silakan login kembali", 401);
      return;
    }
    sendError(res, "Token autentikasi tidak valid", 401);
  }
}

export function requireRole(...allowedRoles: Array<"admin" | "reporter">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Akses ditolak: tidak terautentikasi", 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        `Akses terlarang: peran ${req.user.role} tidak memiliki izin untuk tindakan ini`,
        403
      );
      return;
    }

    next();
  };
}

