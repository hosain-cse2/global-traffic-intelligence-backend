import { Router } from "express";
import {
  listShipsController,
  dashboardStatsController,
} from "../controllers/aisstream.controller.js";

const aisRoutes: Router = Router();

aisRoutes.get("/ships", listShipsController);
aisRoutes.get("/dashboard/stats", dashboardStatsController);

export default aisRoutes;
