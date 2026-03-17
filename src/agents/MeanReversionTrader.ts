import { randomUUID } from "crypto";
import { Order, MarketState } from "../types";
import { BaseAgent } from "./Agent";

export class MeanReversionTrader extends BaseAgent {
  private symbol: string;
  private windowSize: number;

  constructor(id: string, cash: number, symbol: string, windowSize = 20) {
    super(id, "MeanReversionTrader", cash);
    this.symbol = symbol;
    this.windowSize = windowSize;
  }

  async act(marketState: MarketState): Promise<Order | null> {
    if (marketState.lastPrice === null) return null;

    
   const window = marketState.priceHistory.slice(-this.windowSize)
   if (window.length < this.windowSize) return null
   const average = window.reduce((sum, price) => sum + price, 0) / window.length
   const side = marketState.lastPrice < average ? "buy" : "sell"
    const quantity = Math.floor(Math.random() * 10) + 1;
    const price = marketState.lastPrice

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