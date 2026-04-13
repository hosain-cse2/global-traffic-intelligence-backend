import { Router } from "express";
import { listVesselsController } from "../controllers/aisstream.controller.js";

const aisRoutes: Router = Router();

aisRoutes.get("/vessels", listVesselsController);

export default aisRoutes;
