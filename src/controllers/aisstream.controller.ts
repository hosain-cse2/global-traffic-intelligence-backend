import type { Request, Response } from "express";
import { shipStore } from "../services/aisstream/shipStore.js";
import { fallbackShips } from "../services/aisstream/fallbackShips.js";

const listShipsController = async (req: Request, res: Response) => {
  const ships = shipStore.getAll();
  const result = ships.length > 0 ? ships : fallbackShips;
  res.status(200).json({ ships: result });
};

export { listShipsController };
