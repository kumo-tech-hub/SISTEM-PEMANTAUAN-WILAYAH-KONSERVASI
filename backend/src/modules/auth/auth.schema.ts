import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter")
  })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nama pengguna minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter"),
    role: z.enum(["admin", "reporter"]).default("reporter"),
    agency: z.string().optional(),
    phone: z.string().optional()
  })
});
