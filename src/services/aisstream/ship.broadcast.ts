import { broadcastToClients } from "../websocket/ws.server.js";
import { shipStore } from "./shipStore.js";

export function broadcastShip() {
  setInterval(() => {
    const ships = shipStore.getAll();
    broadcastToClients({
      type: "ships:snapshot",
      payload: ships,
    });
  }, 5000);
}
