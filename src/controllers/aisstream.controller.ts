import type { Request, Response } from "express";
import { vesselStore } from "../services/aisstream/vesselStore.js";
import { fallbackVessels } from "../services/aisstream/fallbackVessels.js";

const listVesselsController = async (req: Request, res: Response) => {
  const vessels = vesselStore.getAll();
  const result = vessels.length > 0 ? vessels : fallbackVessels;
  res.status(200).json({ vessels: result });
};

export { listVesselsController };
