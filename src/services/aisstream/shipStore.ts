type ShipPosition = {
  mmsi: string;
  latitude: number;
  longitude: number;
  sog: number; // speed over ground
  cog: number; // course over ground
  heading: number;
  navStatus: number;
  shipName: string;
  timestamp: string;
};

class ShipStore {
  private ships = new Map<string, ShipPosition>();

  upsert(ship: ShipPosition): void {
    this.ships.set(ship.mmsi, ship);
  }

  getAll(): ShipPosition[] {
    return Array.from(this.ships.values());
  }

  getByMmsi(mmsi: string): ShipPosition | undefined {
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

export type { ShipPosition };
export const shipStore = new ShipStore();
