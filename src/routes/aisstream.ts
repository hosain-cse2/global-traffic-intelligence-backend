import { Router } from "express";
import { listShipsController } from "../controllers/aisstream.controller.js";

const aisRoutes: Router = Router();

aisRoutes.get("/ships", listShipsController);

export default aisRoutes;
