import express from "express";
import healthRouter from "./routes/health.js";

const app = express();
const PORT = 3000;

app.use("/health", healthRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
