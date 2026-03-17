import { Order, MarketState } from "../types";

export interface Agent {
  id: string;
  name: string;
  cash: number;
  holdings: Record<string, number>;

  /**
   * Called each simulation tick. Returns an order to submit, or null to pass.
   */
  act(marketState: MarketState): Promise<Order | Order[] | null>

  /**
   * Called after a trade involving this agent is executed.
   */
  onTrade(price: number, quantity: number, side: "buy" | "sell"): void;
}

export abstract class BaseAgent implements Agent {
  id: string;
  name: string;
  cash: number;
  holdings: Record<string, number>;

  constructor(id: string, name: string, cash: number) {
    this.id = id;
    this.name = name;
    this.cash = cash;
    this.holdings = {};
  }

  abstract act(marketState: MarketState): Promise<Order | Order[] | null>

  onTrade(price: number, quantity: number, side: "buy" | "sell"): void {
    if (side === "buy") {
      this.cash -= price * quantity;
    } else {
      this.cash += price * quantity;
    }
  }
}
