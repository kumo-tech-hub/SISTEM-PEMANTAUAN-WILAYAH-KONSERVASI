import dotenv from "dotenv";

dotenv.config();

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseCorsOrigins(value: string | undefined): string[] | boolean {
  if (!value || value.trim() === "*") {
    return true;
  }
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT, 4000),
  corsOrigin: parseCorsOrigins(
    process.env.CORS_ORIGIN ?? "http://localhost:8080,http://localhost:4174"
  ),
  db: {
    host: process.env.DB_HOST ?? "db",
    port: parsePort(process.env.DB_PORT, 3306),
    user: process.env.DB_USER ?? "simeka",
    password: process.env.DB_PASSWORD ?? "simeka_secret",
    name: process.env.DB_NAME ?? "simeka_db"
  },
  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  jwt: {
    secret: process.env.JWT_SECRET ?? "simeka_super_secret_jwt_key_2026",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d"
  }
} as const;
