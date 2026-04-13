type VesselPosition = {
  mmsi: string;
  latitude: number;
  longitude: number;
  sog?: number | undefined; // speed over ground
  cog?: number | undefined; // course over ground
  heading?: number | undefined;
  navStatus?: number | undefined;
  shipName?: string | undefined;
  timestamp: string;
};

class VesselStore {
  private vessels = new Map<string, VesselPosition>();

  upsert(vessel: VesselPosition): void {
    this.vessels.set(vessel.mmsi, vessel);
  }

  getAll(): VesselPosition[] {
    return Array.from(this.vessels.values());
  }

  getByMmsi(mmsi: string): VesselPosition | undefined {
    return this.vessels.get(mmsi);
  }

  remove(mmsi: string): void {
    this.vessels.delete(mmsi);
  }

  clear(): void {
    this.vessels.clear();
  }

  size(): number {
    return this.vessels.size;
  }
}

export type { VesselPosition };
export const vesselStore = new VesselStore();
