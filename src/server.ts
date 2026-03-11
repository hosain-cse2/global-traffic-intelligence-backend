import express, { type Express } from "express";
import healthRouter from "./routes/health.js";
import authRoutes from "./routes/auth.routes.js";

const app: Express = express();
const PORT: number = 3000;

app.use(express.json());

app.use("/health", healthRouter);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
