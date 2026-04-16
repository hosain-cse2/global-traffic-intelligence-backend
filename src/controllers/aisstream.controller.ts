import type { Request, Response } from "express";
import {
  shipStore,
  type Ship,
  type ShipPosition,
} from "../services/aisstream/shipStore.js";

const listShipsController = async (req: Request, res: Response<Ship[]>) => {
  const ships = shipStore.getAvailableShips();
  console.log(JSON.stringify(ships, null, 2)); // TODO: remove this
  res.status(200).json(ships);
};

export { listShipsController };
