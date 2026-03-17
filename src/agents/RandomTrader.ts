import { randomUUID } from "crypto";
import { Order, MarketState } from "../types";
import { BaseAgent } from "./Agent";

export class RandomTrader extends BaseAgent {
  private symbol: string;
  private noiseRange: number;

  constructor(id: string, cash: number, symbol: string, noiseRange = 2) {
    super(id, "RandomTrader", cash);
    this.symbol = symbol;
    this.noiseRange = noiseRange;
  }

  async act(marketState: MarketState): Promise<Order | null> {
    if (marketState.lastPrice === null) return null;

    const side = Math.random() < 0.5 ? "buy" : "sell";
    const noise = (Math.random() * 2 - 1) * this.noiseRange;
    const price = Math.max(0.01, Math.round((marketState.lastPrice + noise) * 100) / 100);
    const quantity = Math.floor(Math.random() * 10) + 1;

    return {
      id: randomUUID(),
      agentId: this.id,
      symbol: this.symbol,
      side,
      type: "limit",
      price,
      quantity,
      filled: 0,
      status: "open",
      timestamp: Date.now(),
    };
  }
}
