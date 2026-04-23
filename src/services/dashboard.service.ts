import {
  getShipCountByRegion,
  getShipCountByType,
  getTopRegion,
} from "./aisstream/helper.js";
import { shipStore, type Ship } from "./aisstream/shipStore.js";

export type DashboardStats = {
  totalShips: number;
  highSpeedShips: number;
  topRegions: { name: string; count: number } | null;
  shipCountByType: { type: string; count: number }[];
  shipCountByRegion: { region: string; count: number }[];
};

const HIGH_SPEED_THRESHOLD = 20;
const getHighSpeedShips = (ships: Ship[]): number => {
  return ships.filter(
    (ship) => ship.position?.sog && ship.position.sog > HIGH_SPEED_THRESHOLD,
  ).length;
};

const getDashboardStats = async (): Promise<DashboardStats> => {
  const ships = shipStore.getAll();
  const topRegion = getTopRegion(ships);
  return {
    totalShips: ships.length ?? 0,
    highSpeedShips: getHighSpeedShips(ships) ?? 0,
    topRegions: topRegion
      ? { name: topRegion.region, count: topRegion.count }
      : null,
    shipCountByType: getShipCountByType(ships),
    shipCountByRegion: getShipCountByRegion(ships),
  };
};

export { getDashboardStats };
