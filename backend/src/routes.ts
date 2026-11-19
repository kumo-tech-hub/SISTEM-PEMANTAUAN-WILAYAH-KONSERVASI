import { Router } from "express";
import { analyticsRouter } from "./modules/analytics/index.js";
import { authRouter } from "./modules/auth/index.js";
import { conservationAreasRouter } from "./modules/conservation-areas/index.js";
import { healthRouter } from "./modules/health/index.js";
import { reportsRouter } from "./modules/reports/index.js";
import { speciesRouter } from "./modules/species/index.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    name: "SIMEKA Modular API",
    version: "0.2.0",
    status: "running",
    architecture: "Modular Feature-Based",
    endpoints: {
      health: "/api/health",
      reports: "/api/reports",
      conservationAreas: "/api/conservation-areas",
      auth: "/api/auth",
      species: "/api/species",
      analytics: "/api/analytics/summary"
    }
  });
});

apiRouter.use("/health", healthRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/conservation-areas", conservationAreasRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/species", speciesRouter);
apiRouter.use("/analytics", analyticsRouter);

