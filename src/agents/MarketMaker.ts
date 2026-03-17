import { randomUUID } from "crypto";
import { Order, MarketState } from "../types";
import { BaseAgent } from "./Agent";

export class MarketMaker extends BaseAgent {
  private symbol: string;
  private spread: number;
  private quantity: number = 5;

  constructor(id: string, cash: number, symbol: string, spread = 2) {
    super(id, "MarketMaker", cash);
    this.symbol = symbol;
    this.spread = spread;
  }

  async act(marketState: MarketState): Promise<Order[]> {
  if (marketState.lastPrice === null) return []

  const mid = marketState.lastPrice
  const half = this.spread / 2

  const buyOrder: Order = {
    id: randomUUID(),
    agentId: this.id,
    symbol: this.symbol,
    side: "buy",
    type: "limit",
    price: mid - half,
    quantity: this.quantity,
    filled: 0,
    status: "open",
    timestamp: Date.now()
  }

  const sellOrder: Order = {
    ...buyOrder,
    id: randomUUID(),
    side: "sell",
    price: mid + half,
  }

  return [buyOrder, sellOrder]
}
 
}