import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { aisStreamService } from "./services/aisstream/aisstream.service.js";
import { shipStore } from "./services/aisstream/shipStore.js";

const app: Express = express();
const PORT: number = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  aisStreamService.start();
  console.log("[AIS] AISStream service started");
});
