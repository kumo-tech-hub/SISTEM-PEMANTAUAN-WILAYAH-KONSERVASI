import { checkDatabaseConnection } from "../../shared/config/database.js";

export async function getHealthStatus() {
  const isDbConnected = await checkDatabaseConnection();
  return {
    status: isDbConnected ? ("ok" as const) : ("degraded" as const),
    service: "simeka-backend",
    database: isDbConnected ? ("connected" as const) : ("disconnected" as const),
    timestamp: new Date().toISOString()
  };
}

