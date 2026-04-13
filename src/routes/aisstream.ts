import { Router } from "express";
import { listVesselsController } from "../controllers/ais.controller.js";

const aisRoutes: Router = Router();

aisRoutes.get("/vessels", listVesselsController);

export default aisRoutes;
