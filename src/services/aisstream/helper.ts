import { REGIONS, type BoundingBox } from "../dashboard/helper.js";

export const mapShipType = (type?: number): string => {
  if (type == null) return "unknown";

  if (type >= 70 && type <= 79) return "cargo";
  if (type >= 80 && type <= 89) return "tanker";
  if (type >= 60 && type <= 69) return "passenger";
  if (type === 30) return "fishing";
  if (type === 36) return "sailing";
  if (type === 37) return "pleasure";
  if (type === 52) return "tug";

  return "other";
};

export const mapNavStatus = (status?: number): string => {
  switch (status) {
    case 0:
      return "under way using engine";
    case 1:
      return "at anchor";
    case 2:
      return "not under command";
    case 3:
      return "restricted maneuverability";
    case 4:
      return "constrained by draught";
    case 5:
      return "moored";
    case 6:
      return "aground";
    case 7:
      return "engaged in fishing";
    case 8:
      return "under way sailing";
    case 9:
      return "reserved (future use)";
    case 10:
      return "reserved (future use)";
    case 11:
      return "power-driven vessel towing astern";
    case 12:
      return "power-driven vessel pushing ahead";
    case 13:
      return "reserved";
    case 14:
      return "AIS-SART (search and rescue)";
    case 15:
      return "undefined";
    default:
      return "unknown";
  }
};

const isPointInBBox = (
  lat: number,
  lng: number,
  bbox: BoundingBox,
): boolean => {
  const [[minLat, minLng], [maxLat, maxLng]] = bbox;

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

export const mapRegion = (lat: number, lng: number): string => {
  for (const region of REGIONS) {
    if (isPointInBBox(lat, lng, region.bbox)) {
      return region.name;
    }
  }

  return "Other";
};
