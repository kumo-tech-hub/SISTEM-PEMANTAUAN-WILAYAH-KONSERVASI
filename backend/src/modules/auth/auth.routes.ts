import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import * as authController from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export const authRouter = Router();

// POST /api/auth/login - Login umum (bisa admin atau reporter)
authRouter.post(
  "/login",
  validateRequest(loginSchema),
  authController.login
);

// POST /api/auth/admin/login - Login khusus Admin KKP
authRouter.post(
  "/admin/login",
  validateRequest(loginSchema),
  authController.adminLogin
);

// POST /api/auth/reporter/login - Login khusus Pelapor Pesisir
authRouter.post(
  "/reporter/login",
  validateRequest(loginSchema),
  authController.reporterLogin
);

// POST /api/auth/register - Registrasi pengguna baru
authRouter.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);

// GET /api/auth/me - Cek profil user aktif (membutuhkan header Authorization: Bearer <token>)
authRouter.get(
  "/me",
  authenticate,
  authController.getMe
);
