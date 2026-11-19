import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/apiResponse.js";
import * as speciesService from "./species.service.js";

export async function getSpecies(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await speciesService.getSpeciesList();
    sendSuccess(res, list, "Daftar observasi spesies berhasil diambil", 200, {
      total: list.length
    });
  } catch (error) {
    next(error);
  }
}

