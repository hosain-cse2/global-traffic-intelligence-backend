import WebSocket from "ws";
import { vesselStore, type VesselPosition } from "./vesselStore.js";

type BoundingBox = [[number, number], [number, number]];

type AisStreamConfig = {
  apiKey: string;
  boundingBoxes: BoundingBox[];
};

class AisStreamService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isManuallyStopped = false;

  constructor(private readonly config: AisStreamConfig) {}

  start(): void {
    this.isManuallyStopped = false;
    this.connect();
  }

  stop(): void {
    this.isManuallyStopped = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private connect(): void {
    console.log("[AIS] Connecting to AISStream...");

    this.ws = new WebSocket("wss://stream.aisstream.io/v0/stream");

    this.ws.on("open", () => {
      console.log("[AIS] Connected");
      this.subscribe();
    });

    this.ws.on("message", (data: WebSocket.RawData) => {
      console.log("[AIS] Message received");
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      } catch (error) {
        console.error("[AIS] Failed to parse message:", error);
      }
    });

    this.ws.on("error", (error) => {
      console.error("[AIS] WebSocket error:", error);
    });

    this.ws.on("close", () => {
      console.warn("[AIS] Connection closed");

      this.ws = null;

      if (!this.isManuallyStopped) {
        this.scheduleReconnect();
      }
    });
  }

  private subscribe(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[AIS] Cannot subscribe, socket not open");
      return;
    }

    const subscriptionMessage = {
      APIKey: process.env.AISSTREAM_API_KEY,
      BoundingBoxes: [
        [
          [23, 47], // south-west (Saudi / Qatar)
          [31, 57], // north-east (Iran / Strait of Hormuz)
        ],
      ],
      FilterMessageTypes: [
        "PositionReport",
        "StandardClassBPositionReport",
        "ExtendedClassBPositionReport",
        "ShipStaticData",
      ],
    };

    this.ws.send(JSON.stringify(subscriptionMessage));
    console.log("[AIS] Subscription sent");
  }

  private handleMessage(message: any): void {
    const positionReport =
      message?.Message?.PositionReport ||
      message?.Message?.StandardClassBPositionReport ||
      message?.Message?.ExtendedClassBPositionReport;

    if (!positionReport) {
      return;
    }

    const metadata = message?.MetaData;

    const latitude = positionReport?.Latitude;
    const longitude = positionReport?.Longitude;
    const mmsi = metadata?.MMSI || positionReport?.UserID;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !mmsi
    ) {
      return;
    }

    const vessel: VesselPosition = {
      mmsi: String(mmsi),
      latitude,
      longitude,
      sog: this.toOptionalNumber(positionReport?.Sog),
      cog: this.toOptionalNumber(positionReport?.Cog),
      heading: this.toOptionalNumber(positionReport?.TrueHeading),
      navStatus: this.toOptionalNumber(positionReport?.NavigationalStatus),
      shipName: metadata?.ShipName || undefined,
      timestamp: metadata?.time_utc || new Date().toISOString(),
    };

    vesselStore.upsert(vessel);
  }

  private toOptionalNumber(value: unknown): number | undefined {
    return typeof value === "number" && !Number.isNaN(value)
      ? value
      : undefined;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    console.log("[AIS] Reconnecting in 5 seconds...");

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 5000);
  }
}

const aisStreamService = new AisStreamService({
  apiKey: process.env.AISSTREAM_API_KEY || "",
  boundingBoxes: [
    [
      [-90, -180],
      [90, 180],
    ],
  ],
});

export { AisStreamService, aisStreamService };
