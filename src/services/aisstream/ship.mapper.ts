import type { ShipPosition } from "./shipStore.js";

export const shipMapper = (ship: ShipPosition) => {
  return {
    mmsi: ship.mmsi,
    latitude: ship.latitude,
    longitude: ship.longitude,
    sog: ship.sog,
    cog: ship.cog,
    heading: ship.heading,
    navStatus: ship.navStatus,
    shipName: ship.shipName,
  };
};

export const shipMapperList = (ships: ShipPosition[]) => {
  return ships.map(shipMapper);
};
