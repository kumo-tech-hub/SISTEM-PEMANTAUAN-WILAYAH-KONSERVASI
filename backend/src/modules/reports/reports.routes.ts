import { Router } from "express";
import { uploadReportImage } from "../../shared/middlewares/upload.js";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import * as reportsController from "./reports.controller.js";
import {
  createReportSchema,
  getReportsQuerySchema,
  updateReportStatusSchema
} from "./reports.schema.js";

export const reportsRouter = Router();

// GET /api/reports - Daftar seluruh laporan pesisir (filter & search)
reportsRouter.get(
  "/",
  validateRequest(getReportsQuerySchema),
  reportsController.getReports
);

// GET /api/reports/:id - Detail laporan
reportsRouter.get("/:id", reportsController.getReportById);

// POST /api/reports - Kirim laporan baru (dengan opsional upload foto)
reportsRouter.post(
  "/",
  uploadReportImage.single("image"),
  validateRequest(createReportSchema),
  reportsController.createReport
);

// PATCH /api/reports/:id/status - Update status laporan oleh admin
reportsRouter.patch(
  "/:id/status",
  validateRequest(updateReportStatusSchema),
  reportsController.updateReportStatus
);

