import WebSocket from "ws";
import {
  shipStore,
  type ShipMetadata,
  type ShipPosition,
} from "./shipStore.js";
import { mapNavStatus, mapShipType } from "./helper.js";

type BoundingBox = [[number, number], [number, number]];

type AisStreamConfig = {
  apiKey: string;
  boundingBoxes: BoundingBox[];
  FilterMessageTypes: string[];
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
      try {
        const message = JSON.parse(data.toString());
        if (message) {
          this.handleMessage(message);
        } else {
          console.error("[AIS] Invalid message");
        }
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
      APIKey: this.config.apiKey,
      BoundingBoxes: this.config.boundingBoxes,
      FilterMessageTypes: this.config.FilterMessageTypes,
    };

    console.log({ subscriptionMessage }); // TODO: remove this
    console.log({ BoundingBoxes: this.config.boundingBoxes[0]?.[0] ?? [] }); // TODO: remove this
    console.log({ BoundingBoxes: this.config.boundingBoxes[0]?.[1] ?? [] }); // TODO: remove this

    this.ws.send(JSON.stringify(subscriptionMessage));
    console.log("[AIS] Subscription sent");
  }

  private handleShipMetadata(metadata: any): ShipMetadata {
    const mmsi = metadata.MMSI;
    const shipName = metadata.ShipName;
    const timestamp = metadata.time_utc;

    return { mmsi, shipName, timestamp };
  }

  private handleShipPositionMessage(positionData: any): ShipPosition {
    const shipPosition: ShipPosition = {
      latitude: positionData.Latitude,
      longitude: positionData.Longitude,
      sog: positionData.Sog,
      cog: positionData.Cog,
      heading: positionData.TrueHeading,
      navStatus: mapNavStatus(positionData.NavigationalStatus),
    };

    return shipPosition;
  }

  // TODO: fix this type message: any, it should be the correct type
  private handleMessage(message: any): void {
    let ship = shipStore.getByMmsi(message.MetaData.MMSI);

    if (!ship) {
      ship = {
        mmsi: message.MetaData.MMSI,
        shipName: message.MetaData.ShipName,
        timestamp: message.MetaData.time_utc,
        position: {
          latitude: message.MetaData.latitude,
          longitude: message.MetaData.longitude,
        },
      };
    }

    const shipPositionReport =
      message.Message.PositionReport ||
      message.Message.StandardClassBPositionReport ||
      message.Message.ExtendedClassBPositionReport;

    if (shipPositionReport) {
      ship.position = this.handleShipPositionMessage(shipPositionReport);
    } else if (message.Message.ShipStaticData) {
      ship.type = mapShipType(message.Message.ShipStaticData.Type);
    } else {
      console.error("[AIS] Message is not a position report or static data");
      return;
    }

    shipStore.upsert(ship);
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
    // [
    //   [30.0, -6.0],
    //   [46.0, 36.0],
    // ], // Mediterranean Sea
    // [
    //   [12.0, 42.0],
    //   [30.0, 60.0],
    // ], // Persian Gulf
    [
      [-90, -180],
      [90, 180],
    ], // Global
  ],
  FilterMessageTypes: [
    "PositionReport",
    "StandardClassBPositionReport",
    "ExtendedClassBPositionReport",
    "ShipStaticData",
  ],
});

export { AisStreamService, aisStreamService };
