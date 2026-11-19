import type { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../../shared/utils/apiResponse.js";
import * as areasService from "./conservation-areas.service.js";

export async function getConservationAreas(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const areas = await areasService.getConservationAreas();
    sendSuccess(res, areas, "Daftar wilayah konservasi berhasil diambil", 200, {
      total: areas.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getConservationZones(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const zones = await areasService.getConservationZones();
    sendSuccess(res, zones, "Daftar zona konservasi berhasil diambil", 200, {
      total: zones.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getConservationAreaById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const area = await areasService.getConservationAreaById(req.params.id);
    if (!area) {
      sendError(res, `Wilayah konservasi ${req.params.id} tidak ditemukan`, 404);
      return;
    }
    sendSuccess(res, area, "Detail wilayah konservasi berhasil diambil");
  } catch (error) {
    next(error);
  }
}

