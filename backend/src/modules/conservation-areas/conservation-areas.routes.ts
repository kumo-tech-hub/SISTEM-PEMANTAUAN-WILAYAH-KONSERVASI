import { Router } from "express";
import * as areasController from "./conservation-areas.controller.js";

export const conservationAreasRouter = Router();

// GET /api/conservation-areas - Daftar seluruh wilayah konservasi
conservationAreasRouter.get("/", areasController.getConservationAreas);

// GET /api/conservation-areas/zones - Daftar zonasi konservasi
conservationAreasRouter.get("/zones", areasController.getConservationZones);

// GET /api/conservation-areas/:id - Detail wilayah konservasi
conservationAreasRouter.get("/:id", areasController.getConservationAreaById);

