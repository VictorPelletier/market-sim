import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./db";
import simulationRouter from "./routes/simulation";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/simulation", simulationRouter);

async function start() {
  try {
    await testConnection();
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`market-sim listening on http://localhost:${PORT}`);
  });
}

start();
