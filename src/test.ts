import { OrderBook } from "./engine/OrderBook"
import { Order } from "./types"

const makeOrder = (id: string, side: "buy" | "sell", price: number, quantity: number): Order => ({
  id,
  agentId: `agent-${id}`,
  symbol: "SIM",
  side,
  type: "limit",
  price,
  quantity,
  filled: 0,
  status: "open",
  timestamp: Date.now()
})

// Test 1 — match parfait
const book = new OrderBook("SIM")
book.submit(makeOrder("1", "buy",  100, 5))
book.submit(makeOrder("2", "sell", 100, 5))
console.log("Test 1 — trades:", book.getTrades())        // 1 trade qty 5 @ 100
console.log("Test 1 — state:", book.getState())          // lastPrice: 100

// Test 2 — partial fill
const book2 = new OrderBook("SIM")
book2.submit(makeOrder("3", "buy",  100, 10))
book2.submit(makeOrder("4", "sell", 99,  3))
console.log("Test 2 — trades:", book2.getTrades())       // 1 trade qty 3 @ 99
console.log("Test 2 — state:", book2.getState())         // lastPrice: 99, bestBid: 100