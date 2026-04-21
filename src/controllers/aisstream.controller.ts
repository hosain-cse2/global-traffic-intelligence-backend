import type { Request, Response } from "express";
import {
  shipStore,
  type Ship,
  type ShipPosition,
} from "../services/aisstream/shipStore.js";
import {
  getDashboardStats,
  type DashboardStats,
} from "../services/dashboard.service.js";

const listShipsController = async (_req: Request, res: Response<Ship[]>) => {
  const ships = shipStore.getAll();
  res.status(200).json(ships);
};

const dashboardStatsController = async (
  _req: Request,
  res: Response<DashboardStats>,
) => {
  const stats = await getDashboardStats();
  res.status(200).json(stats);
};

export { listShipsController, dashboardStatsController };
