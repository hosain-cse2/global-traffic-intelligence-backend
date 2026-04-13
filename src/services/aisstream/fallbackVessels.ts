export type FallbackVessel = {
  mmsi: string;
  latitude: number;
  longitude: number;
  sog?: number;
  cog?: number;
  heading?: number;
  navStatus?: number;
  shipName?: string;
  timestamp: string;
};

type Region = {
  name: string;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
};

const REGIONS: Region[] = [
  { name: "North Sea", latMin: 51.5, latMax: 59.5, lonMin: -4.5, lonMax: 8.5 },
  {
    name: "Baltic Sea",
    latMin: 54.0,
    latMax: 60.5,
    lonMin: 10.0,
    lonMax: 25.0,
  },
  {
    name: "English Channel",
    latMin: 48.0,
    latMax: 51.5,
    lonMin: -6.0,
    lonMax: 2.5,
  },
  {
    name: "Mediterranean West",
    latMin: 35.0,
    latMax: 43.5,
    lonMin: -5.5,
    lonMax: 10.0,
  },
  {
    name: "Mediterranean East",
    latMin: 31.0,
    latMax: 38.5,
    lonMin: 18.0,
    lonMax: 36.0,
  },
  { name: "Black Sea", latMin: 41.0, latMax: 46.5, lonMin: 27.0, lonMax: 41.5 },
  {
    name: "Persian Gulf",
    latMin: 24.0,
    latMax: 30.5,
    lonMin: 48.0,
    lonMax: 56.5,
  },
  {
    name: "Arabian Sea",
    latMin: 12.0,
    latMax: 24.0,
    lonMin: 56.0,
    lonMax: 69.0,
  },
  { name: "Red Sea", latMin: 13.0, latMax: 28.5, lonMin: 32.0, lonMax: 44.0 },
  {
    name: "Bay of Bengal",
    latMin: 8.0,
    latMax: 21.5,
    lonMin: 80.0,
    lonMax: 96.0,
  },
  {
    name: "South China Sea",
    latMin: 5.0,
    latMax: 22.0,
    lonMin: 105.0,
    lonMax: 121.0,
  },
  {
    name: "East China Sea",
    latMin: 24.0,
    latMax: 33.0,
    lonMin: 121.0,
    lonMax: 131.0,
  },
  {
    name: "Singapore Strait",
    latMin: 0.8,
    latMax: 2.5,
    lonMin: 102.0,
    lonMax: 105.5,
  },
  {
    name: "Gulf of Mexico",
    latMin: 19.0,
    latMax: 29.5,
    lonMin: -96.0,
    lonMax: -82.0,
  },
  {
    name: "Caribbean",
    latMin: 10.0,
    latMax: 22.5,
    lonMin: -86.0,
    lonMax: -60.0,
  },
  {
    name: "West Africa",
    latMin: -5.0,
    latMax: 16.0,
    lonMin: -18.0,
    lonMax: 12.0,
  },
  {
    name: "East Africa",
    latMin: -20.0,
    latMax: 12.0,
    lonMin: 38.0,
    lonMax: 52.0,
  },
  {
    name: "South Africa",
    latMin: -35.5,
    latMax: -22.0,
    lonMin: 16.0,
    lonMax: 36.0,
  },
  {
    name: "Brazil Coast",
    latMin: -28.0,
    latMax: 2.0,
    lonMin: -48.0,
    lonMax: -34.0,
  },
  {
    name: "US East Coast",
    latMin: 25.0,
    latMax: 42.5,
    lonMin: -80.5,
    lonMax: -69.0,
  },
];

const SHIP_PREFIXES = [
  "Aurora",
  "Atlantic",
  "Blue",
  "Coral",
  "Delta",
  "Emerald",
  "Falcon",
  "Golden",
  "Harbor",
  "Horizon",
  "Imperial",
  "Jade",
  "Liberty",
  "Mercury",
  "Neptune",
  "Ocean",
  "Pacific",
  "Royal",
  "Sea",
  "Titan",
];

const SHIP_SUFFIXES = [
  "Carrier",
  "Trader",
  "Voyager",
  "Spirit",
  "Navigator",
  "Mariner",
  "Pioneer",
  "Star",
  "Queen",
  "Express",
  "Wind",
  "Wave",
  "Light",
  "Bridge",
  "Pearl",
  "Falcon",
  "Runner",
  "Glory",
  "Crest",
  "Venture",
];

function randomBetween(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(6));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("randomFrom: expected non-empty array");
  }
  const i = Math.floor(Math.random() * items.length);
  return items[i]!;
}

function generateShipName(index: number): string {
  const prefix = SHIP_PREFIXES[index % SHIP_PREFIXES.length];
  const suffix =
    SHIP_SUFFIXES[
      Math.floor(index / SHIP_PREFIXES.length) % SHIP_SUFFIXES.length
    ];
  return `${prefix} ${suffix} ${String(index + 1).padStart(3, "0")}`;
}

function generateMmsi(index: number): string {
  return String(400000000 + index).padStart(9, "0");
}

function createFallbackVessel(index: number): FallbackVessel {
  const region = REGIONS[index % REGIONS.length];
  if (region === undefined) {
    throw new Error("REGIONS must not be empty");
  }
  const latitude = randomBetween(region.latMin, region.latMax);
  const longitude = randomBetween(region.lonMin, region.lonMax);
  const sog = randomBetween(0, 24);
  const cog = randomInt(0, 359);
  const heading = randomInt(0, 359);
  const navStatus = randomFrom([0, 0, 0, 5, 8, 15]);

  return {
    mmsi: generateMmsi(index),
    latitude,
    longitude,
    sog,
    cog,
    heading,
    navStatus,
    shipName: generateShipName(index),
    timestamp: new Date().toISOString(),
  };
}

export const fallbackVessels: FallbackVessel[] = Array.from(
  { length: 500 },
  (_, index) => createFallbackVessel(index),
);
