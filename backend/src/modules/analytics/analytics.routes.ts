import { Router } from "express";
import * as analyticsController from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", analyticsController.getSummary);

