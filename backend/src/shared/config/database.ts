import mysql from "mysql2/promise";
import { env } from "./env.js";

export const dbPool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await dbPool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("[db] Health check failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function closeDatabasePool(): Promise<void> {
  await dbPool.end();
}

