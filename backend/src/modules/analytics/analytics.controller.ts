import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import * as analyticsService from "./analytics.service.js";

export async function getSummary(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await analyticsService.getDashboardSummary();
    sendSuccess(res, summary, "Data ringkasan analitik berhasil diambil");
  } catch (error) {
    next(error);
  }
}

