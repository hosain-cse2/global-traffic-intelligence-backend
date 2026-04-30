import type { Ship } from "../aisstream/shipStore.js";

export function countShipsByRegion(ships: Ship[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const ship of ships) {
    const region = ship.position?.region;

    if (!region) continue;

    counts[region] = (counts[region] ?? 0) + 1;
  }

  return counts;
}

type TopRegionResult = {
  region: string;
  count: number;
};

export function getTopRegion(ships: Ship[]): TopRegionResult | null {
  const counts = countShipsByRegion(ships);

  let topRegion: string | null = null;
  let topCount = 0;

  for (const [region, count] of Object.entries(counts)) {
    if (count > topCount) {
      topRegion = region;
      topCount = count;
    }
  }

  if (!topRegion) return null;

  return {
    region: topRegion,
    count: topCount,
  };
}

export const ShipType: string[] = [
  "cargo",
  "tanker",
  "passenger",
  "fishing",
  "sailing",
  "pleasure",
  "tug",
  "other",
];

export function getShipCountByType(
  ships: Ship[],
): { type: string; count: number }[] {
  return ShipType.map((type) => ({
    type,
    count: ships.filter((ship) => ship.type === type).length,
  }));
}

type TrafficLevel = "low" | "medium" | "high" | "not traffic";

export type RegionalTraffic = {
  region: string;
  totalShips: number;
  movingShips: number;
  stationaryShips: number;
  trafficLevel: TrafficLevel;
};

function getTrafficLevel(count: number): TrafficLevel {
  if (count > 3000) return "high";
  if (count > 1000) return "medium";
  if (count > 0) return "low";
  return "not traffic";
}

export type BoundingBox = [[number, number], [number, number]];
export const REGIONS: { name: string; bbox: BoundingBox }[] = [
  {
    name: "Mediterranean",
    bbox: [
      [30, -6],
      [46, 36],
    ],
  },
  {
    name: "North Sea",
    bbox: [
      [51, -4],
      [62, 9],
    ],
  },
  {
    name: "Baltic Sea",
    bbox: [
      [53, 9],
      [66, 31],
    ],
  },
  {
    name: "Black Sea",
    bbox: [
      [40, 27],
      [47, 42],
    ],
  },
  {
    name: "Arabian Gulf",
    bbox: [
      [24, 47],
      [31, 57],
    ],
  },
  {
    name: "Red Sea",
    bbox: [
      [12, 32],
      [30, 44],
    ],
  },
  {
    name: "South China Sea",
    bbox: [
      [0, 100],
      [25, 122],
    ],
  },
  {
    name: "North Atlantic",
    bbox: [
      [0, -80],
      [60, 0],
    ],
  },
  {
    name: "South Atlantic",
    bbox: [
      [-60, -70],
      [0, 20],
    ],
  },
  {
    name: "Indian Ocean",
    bbox: [
      [-40, 20],
      [30, 110],
    ],
  },
  {
    name: "Pacific Ocean",
    bbox: [
      [-60, -180],
      [60, -80],
    ],
  },
  {
    name: "Pacific Ocean East",
    bbox: [
      [-60, 120],
      [60, 180],
    ],
  },
  {
    name: "Gulf of Mexico",
    bbox: [
      [18, -98],
      [31, -80],
    ],
  },
  {
    name: "Caribbean",
    bbox: [
      [10, -85],
      [23, -60],
    ],
  },
  {
    name: "East China Sea",
    bbox: [
      [24, 118],
      [35, 131],
    ],
  },
  {
    name: "Sea of Japan",
    bbox: [
      [35, 130],
      [50, 142],
    ],
  },
];

export function getRegionTrafficList(ships: Ship[]): RegionalTraffic[] {
  return REGIONS.map((region) => ({
    region: region.name,
    totalShips: ships.filter((ship) => ship.position?.region === region.name)
      .length,
    movingShips: ships.filter(
      (ship) =>
        ship.position?.sog &&
        ship.position.sog > 1 &&
        ship.position?.region === region.name,
    ).length,
    stationaryShips: ships.filter(
      (ship) =>
        ship.position?.sog &&
        ship.position.sog < 1 &&
        ship.position?.region === region.name,
    ).length,
    trafficLevel: getTrafficLevel(
      ships.filter((ship) => ship.position?.region === region.name).length,
    ),
  }));
}

export function getMovementState(
  ships: Ship[],
): { state: string; count: number }[] {
  return [
    {
      state: "stationary",
      count: ships.filter((ship) => ship.position?.sog && ship.position.sog < 1)
        .length,
    },
    {
      state: "slow",
      count: ships.filter(
        (ship) =>
          ship.position?.sog && ship.position.sog >= 1 && ship.position.sog < 5,
      ).length,
    },
    {
      state: "normal",
      count: ships.filter(
        (ship) =>
          ship.position?.sog &&
          ship.position.sog >= 5 &&
          ship.position.sog < 20,
      ).length,
    },
    {
      state: "fast",
      count: ships.filter(
        (ship) =>
          ship.position?.sog &&
          ship.position.sog > 20 &&
          ship.position.sog < 25,
      ).length,
    },
    {
      state: "very fast",
      count: ships.filter(
        (ship) => ship.position?.sog && ship.position.sog > 25,
      ).length,
    },
    {
      state: "unknown",
      count: ships.filter((ship) => !ship.position?.sog).length,
    },
  ].sort((a, b) => a.count - b.count);
}
