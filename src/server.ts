import express from "express";
import healthRouter from "./routes/health.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/health", healthRouter);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
