import { Router } from "express";
import * as speciesController from "./species.controller.js";

export const speciesRouter = Router();

speciesRouter.get("/", speciesController.getSpecies);

