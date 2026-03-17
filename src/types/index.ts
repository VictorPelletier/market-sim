export type OrderSide = "buy" | "sell";
export type OrderType = "limit" | "market";
export type OrderStatus = "open" | "filled" | "partial" | "cancelled";

export interface Order {
  id: string;
  agentId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;     // 0 for market orders
  quantity: number;
  filled: number;
  status: OrderStatus;
  timestamp: number;
}

export interface Trade {
  id: string;
  symbol: string;
  buyOrderId: string;
  sellOrderId: string;
  buyAgentId: string;
  sellAgentId: string;
  price: number;
  quantity: number;
  timestamp: number;
}

export interface MarketState {
  symbol: string;
  bestBid: number | null;
  bestAsk: number | null;
  lastPrice: number | null;
  priceHistory:number[];
  volume: number;
  timestamp: number;
}

export type SimulationStatus = "idle" | "running" | "paused";

export interface SimulationState {
  status: SimulationStatus;
  tick: number;
  startedAt: number | null;
}
