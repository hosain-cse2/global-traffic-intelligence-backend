import { shipStore, type Ship } from "./shipStore.js";

const MAX_AGE_MS = 10 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

function cleanupShipsOutOfRange(ships: Ship[]): void {
  for (const ship of ships) {
    if (
      ship.position?.latitude &&
      ship.position?.longitude &&
      (ship.position?.latitude < -90 || ship.position?.latitude > 90) &&
      (ship.position?.longitude < -180 || ship.position?.longitude > 180)
    ) {
      shipStore.remove(ship.mmsi);
      console.log("[AIS] Ship removed from ship store: ", ship.mmsi);
    }
  }
}

function cleanupOldShips(ships: Ship[]): void {
  const now = Date.now();
  for (const ship of ships) {
    if (now - new Date(ship.timestamp).getTime() > MAX_AGE_MS) {
      shipStore.remove(ship.mmsi);
      console.log("[AIS] Ship removed from ship store: ", ship.mmsi);
    }
  }
}

const startShipStoreCleanup = () => {
  setInterval(() => {
    console.log("[AIS] Ship store clean up started...");
    const ships = shipStore.getAll();
    cleanupShipsOutOfRange(ships);
    cleanupOldShips(ships);
    console.log("[AIS] Ship store clean up completed...");
  }, CLEANUP_INTERVAL_MS);
};

export { startShipStoreCleanup };
