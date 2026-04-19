/* Demo page — "watch agent shop" with SSE terminal trace + order confirmation */
"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
}

interface OrderResult {
  order_id: string;
  items: OrderItem[];
  total: number;
  currency: string;
  payment_method: string;
  status: string;
}

export default function TryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [query, setQuery] = useState("Buy me running shoes under ₹4000");
  const [lines, setLines] = useState<string[]>([]);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [running, setRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  async function handleRun() {
    setRunning(true);
    setLines([]);
    setOrder(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, slug }),
      });

      if (!res.ok || !res.body) {
        setLines((prev) => [...prev, `[ERROR] Request failed: ${res.status}`]);
        setRunning(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const chunks = buf.split("\n\n");
        buf = chunks.pop() || "";

        for (const chunk of chunks) {
          if (!chunk.startsWith("data: ")) continue;
          const data = chunk.slice(6);
          if (data === "[DONE]") continue;

          try {
            const ev = JSON.parse(data);
            if (ev.type === "event") {
              setLines((prev) => [...prev, ev.text]);
            } else if (ev.type === "order") {
              setOrder(ev.order);
            } else if (ev.type === "agent_final") {
              setLines((prev) => [...prev, `[AGENT] ${ev.text}`]);
            } else if (ev.type === "error") {
              setLines((prev) => [...prev, `[ERROR] ${ev.text}`]);
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      setLines((prev) => [...prev, `[ERROR] ${message}`]);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-4xl mx-auto px-8 py-6">
        <a href="/" className="text-xl font-bold tracking-tight">
          AgentCheckout
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-8">
        <p className="text-sm text-gray-400 mb-1">Store: {slug}</p>
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Agent Shopper Demo
        </h1>

        {/* Query input + run button */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-black"
            disabled={running}
          />
          <button
            onClick={handleRun}
            disabled={running || !query.trim()}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? "Agent working..." : "\u25B6 Run Agent"}
          </button>
        </div>

        {/* Terminal trace */}
        <div
          ref={terminalRef}
          className="bg-black rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto font-mono text-sm text-green-400"
        >
          {lines.length === 0 && !running && (
            <p className="text-gray-600">
              Click &quot;Run Agent&quot; to start...
            </p>
          )}
          {lines.map((line, i) => (
            <div key={i} className="py-0.5">
              {line}
            </div>
          ))}
          {running && lines.length > 0 && (
            <div className="py-0.5 animate-pulse text-gray-500">_</div>
          )}
        </div>

        {/* Order confirmation card */}
        {order && (
          <div className="mt-6 border-2 border-green-500 rounded-lg p-6 bg-green-50">
            <h2 className="text-lg font-bold text-green-800 mb-4">
              Order Confirmed
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Order ID:</span>{" "}
                {order.order_id}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.payment_method}
              </p>
              <div className="border-t border-green-200 pt-3 mt-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-1"
                  >
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <span className="font-mono">
                      {"\u20B9"}
                      {item.price * item.qty}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-green-200 font-bold">
                  <span>Total</span>
                  <span className="font-mono">
                    {"\u20B9"}
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
