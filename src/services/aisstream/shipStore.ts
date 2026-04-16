type ShipMetadata = {
  mmsi: string;
  shipName: string;
  timestamp: string;
};

type ShipPosition = {
  latitude: number;
  longitude: number;
  sog?: number; // speed over ground
  cog?: number; // course over ground
  heading?: number;
  navStatus?: string;
};

type Ship = ShipMetadata & {
  type?: string;
  position?: ShipPosition;
};

class ShipStore {
  private ships = new Map<string, Ship>();

  upsert(ship: Ship): void {
    this.ships.set(ship.mmsi, ship);
  }

  getAll(): Ship[] {
    return Array.from(this.ships.values());
  }

  getAvailableShips(): Ship[] {
    return Array.from(this.ships.values()).filter((ship) => {
      const MAX_AGE_MINUTES = 10;

      return Array.from(this.ships.values()).filter((ship) => {
        // 1. MMSI
        if (!ship.mmsi) return false;

        // 2. Coordinates must exist
        if (
          typeof ship.position?.latitude !== "number" ||
          typeof ship.position?.longitude !== "number"
        ) {
          return false;
        }

        // 3. Valid coordinate range
        if (ship.position?.latitude < -90 || ship.position?.latitude > 90)
          return false;
        if (ship.position?.longitude < -180 || ship.position?.longitude > 180)
          return false;

        // 4. Remove garbage (0,0)
        if (ship.position?.latitude === 0 && ship.position?.longitude === 0)
          return false;

        // 5. Timestamp must be recent
        const ts = new Date(ship.timestamp).getTime();
        if (Number.isNaN(ts)) return false;

        const ageMinutes = (Date.now() - ts) / (1000 * 60);
        if (ageMinutes > MAX_AGE_MINUTES) return false;

        // 6. Valid heading OR COG
        const hasHeading =
          typeof ship.position?.heading === "number" &&
          ship.position.heading >= 0 &&
          ship.position.heading <= 359;

        const hasCog =
          typeof ship.position.cog === "number" &&
          ship.position.cog >= 0 &&
          ship.position.cog <= 359;

        if (!hasHeading && !hasCog) return false;

        return true;
      });
    });
  }

  getByMmsi(mmsi: string): Ship | undefined {
    return this.ships.get(mmsi);
  }

  remove(mmsi: string): void {
    this.ships.delete(mmsi);
  }

  clear(): void {
    this.ships.clear();
  }

  size(): number {
    return this.ships.size;
  }
}

export type { Ship, ShipMetadata, ShipPosition };
export const shipStore = new ShipStore();
