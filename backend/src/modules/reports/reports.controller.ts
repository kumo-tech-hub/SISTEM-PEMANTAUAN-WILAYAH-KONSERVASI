import type { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../../shared/utils/apiResponse.js";
import * as reportsService from "./reports.service.js";

export async function getReports(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filter = {
      category: req.query.category as string | undefined,
      region: req.query.region as string | undefined,
      severity: req.query.severity as string | undefined,
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined
    };

    const reports = await reportsService.getAllReports(filter);
    sendSuccess(res, reports, "Daftar laporan berhasil diambil", 200, {
      total: reports.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getReportById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const report = await reportsService.getReportById(req.params.id);
    if (!report) {
      sendError(res, `Laporan dengan ID ${req.params.id} tidak ditemukan`, 404);
      return;
    }
    sendSuccess(res, report, "Detail laporan berhasil diambil");
  } catch (error) {
    next(error);
  }
}

export async function createReport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const report = await reportsService.createReport(req.body, imageUrl);
    sendSuccess(res, report, "Laporan baru berhasil dikirim", 201);
  } catch (error) {
    next(error);
  }
}

export async function updateReportStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await reportsService.updateReportStatus(req.params.id, req.body);
    if (!updated) {
      sendError(res, `Laporan dengan ID ${req.params.id} tidak ditemukan`, 404);
      return;
    }
    sendSuccess(res, updated, "Status laporan berhasil diperbarui");
  } catch (error) {
    next(error);
  }
}

