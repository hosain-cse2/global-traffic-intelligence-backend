// src/websocket/wsServer.ts
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

let wss: WebSocketServer | null = null;

export function startWebSocketServer(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    console.log("[WS] Frontend connected");

    socket.send(
      JSON.stringify({
        type: "connected",
        message: "Connected to backend WebSocket",
      }),
    );

    socket.on("close", () => {
      console.log("[WS] Frontend disconnected");
    });
  });
}

export function broadcastToClients(data: unknown) {
  if (!wss) return;

  const message = JSON.stringify(data);

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}
