import { Order, Trade, MarketState } from "../types";
import { randomUUID } from "crypto";

export class OrderBook {
  private symbol: string;
  private bids: Order[] = []; // sorted descending by price
  private asks: Order[] = []; // sorted ascending by price
  private trades: Trade[] = [];
  private lastPrice: number | null = null;
  private volume: number = 0;

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  submit(order: Order): Trade[] {
    if (order.type === "market") {
      return this.matchMarket(order);
    }
    return this.matchLimit(order);
  }

  private matchLimit(incoming: Order): Trade[] {
    const newTrades: Trade[] = [];
    const opposingSide = incoming.side === "buy" ? this.asks : this.bids;

    while (incoming.filled < incoming.quantity && opposingSide.length > 0) {
      const best = opposingSide[0];
      const canMatch =
        incoming.side === "buy"
          ? incoming.price >= best.price
          : incoming.price <= best.price;

      if (!canMatch) break;

      const trade = this.executeTrade(incoming, best);
      newTrades.push(trade);

      if (best.filled >= best.quantity) {
        opposingSide.shift();
        best.status = "filled";
      } else {
        best.status = "partial";
      }
    }

    if (incoming.filled < incoming.quantity) {
      incoming.status = incoming.filled > 0 ? "partial" : "open";
      this.insertResting(incoming);
    } else {
      incoming.status = "filled";
    }

    return newTrades;
  }

  private matchMarket(incoming: Order): Trade[] {
    const newTrades: Trade[] = [];
    const opposingSide = incoming.side === "buy" ? this.asks : this.bids;

    while (incoming.filled < incoming.quantity && opposingSide.length > 0) {
      const best = opposingSide[0];
      const trade = this.executeTrade(incoming, best);
      newTrades.push(trade);

      if (best.filled >= best.quantity) {
        opposingSide.shift();
        best.status = "filled";
      } else {
        best.status = "partial";
      }
    }

    incoming.status = incoming.filled >= incoming.quantity ? "filled" : "partial";
    return newTrades;
  }

  private executeTrade(incoming: Order, resting: Order): Trade {
    const fillQty = Math.min(
      incoming.quantity - incoming.filled,
      resting.quantity - resting.filled
    );
    const fillPrice = resting.price;

    incoming.filled += fillQty;
    resting.filled += fillQty;
    this.lastPrice = fillPrice;
    this.volume += fillQty;

    const [buyOrder, sellOrder] =
      incoming.side === "buy"
        ? [incoming, resting]
        : [resting, incoming];

    const trade: Trade = {
      id: randomUUID(),
      symbol: this.symbol,
      buyOrderId: buyOrder.id,
      sellOrderId: sellOrder.id,
      buyAgentId: buyOrder.agentId,
      sellAgentId: sellOrder.agentId,
      price: fillPrice,
      quantity: fillQty,
      timestamp: Date.now(),
    };

    this.trades.push(trade);
    return trade;
  }

  private insertResting(order: Order): void {
    if (order.side === "buy") {
      this.bids.push(order);
      this.bids.sort((a, b) => b.price - a.price);
    } else {
      this.asks.push(order);
      this.asks.sort((a, b) => a.price - b.price);
    }
  }

  cancel(orderId: string): boolean {
    for (const side of [this.bids, this.asks]) {
      const idx = side.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        side[idx].status = "cancelled";
        side.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  getState(): MarketState {
    return {
      symbol: this.symbol,
      bestBid: this.bids[0]?.price ?? null,
      bestAsk: this.asks[0]?.price ?? null,
      priceHistory: this.trades.slice(-200).map(t => t.price),
      lastPrice: this.lastPrice,
      volume: this.volume,
      timestamp: Date.now(),
    };
  }

  getTrades(): Trade[] {
    return this.trades;
  }

  reset(): void {
    this.bids = [];
    this.asks = [];
    this.trades = [];
    this.lastPrice = null;
    this.volume = 0;
  }
}
