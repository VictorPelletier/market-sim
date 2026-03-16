import { Router, Request, Response } from "express";
import { SimulationState } from "../types";

const router = Router();

const state: SimulationState = {
  status: "idle",
  tick: 0,
  startedAt: null,
};

router.post("/start", (_req: Request, res: Response) => {
  if (state.status === "running") {
    res.status(400).json({ error: "Simulation already running" });
    return;
  }
  state.status = "running";
  state.startedAt = Date.now();
  res.json({ message: "Simulation started", state });
});

router.post("/pause", (_req: Request, res: Response) => {
  if (state.status !== "running") {
    res.status(400).json({ error: "Simulation is not running" });
    return;
  }
  state.status = "paused";
  res.json({ message: "Simulation paused", state });
});

router.post("/reset", (_req: Request, res: Response) => {
  state.status = "idle";
  state.tick = 0;
  state.startedAt = null;
  res.json({ message: "Simulation reset", state });
});

router.get("/status", (_req: Request, res: Response) => {
  res.json(state);
});

export default router;
