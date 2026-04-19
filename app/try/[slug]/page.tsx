/* Demo page — polished agent terminal with Stripe-level aesthetics */
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

  const [query, setQuery] = useState("Buy me running shoes under \u20B94000");
  const [lines, setLines] = useState<string[]>([]);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [running, setRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

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
            /* skip malformed JSON */
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

  function getLineColor(line: string): string {
    if (line.startsWith("[MCP]")) return "text-emerald-400";
    if (line.startsWith("[AGENT] Searching") || line.startsWith("[AGENT] Found"))
      return "text-blue-400";
    if (line.startsWith("[AGENT] Added")) return "text-yellow-400";
    if (line.startsWith("[AGENT] Parsing")) return "text-gray-400";
    if (line.startsWith("[CHECKOUT] Processing")) return "text-gray-400";
    if (line.includes("\u2713") || line.includes("confirmed"))
      return "text-emerald-400 font-semibold";
    if (line.startsWith("[ERROR]")) return "text-red-400";
    if (line.startsWith("[AGENT]")) return "text-gray-300";
    return "text-gray-400";
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            AgentCheckout
          </span>
        </a>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          store: {slug}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Agent Shopper
          </h1>
          <p className="mt-2 text-gray-500">
            Watch an AI agent discover products, add to cart, and checkout in real-time.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to buy?
          </label>
          <div className="flex gap-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={1}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
              disabled={running}
            />
            <button
              onClick={handleRun}
              disabled={running || !query.trim()}
              className="shrink-0 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {running ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2L14 8L4 14V2Z" />
                  </svg>
                  Run Agent
                </>
              )}
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#0c0c0c] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          {/* Terminal chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-gray-500 font-mono">
                agent-session &mdash; {slug}
              </span>
            </div>
            {running && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                streaming
              </span>
            )}
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="p-6 min-h-[320px] max-h-[480px] overflow-y-auto font-mono text-sm leading-relaxed terminal-scroll"
          >
            {lines.length === 0 && !running && (
              <div className="text-gray-600 flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <span>Ready. Click &quot;Run Agent&quot; to start.</span>
                <span className="w-2 h-5 bg-gray-600 animate-blink" />
              </div>
            )}
            {lines.map((line, i) => (
              <div key={i} className={`py-0.5 ${getLineColor(line)}`}>
                {line}
              </div>
            ))}
            {running && lines.length > 0 && (
              <div className="py-0.5 flex items-center gap-1">
                <span className="w-2 h-5 bg-emerald-400 animate-blink" />
              </div>
            )}
          </div>
        </div>

        {/* Order confirmation card */}
        {order && (
          <div className="mt-6 bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-sm animate-fade-up">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M13.5 4.5L6.5 11.5L2.5 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="font-semibold text-emerald-900">
                  Order Confirmed
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Order ID
                  </p>
                  <p className="font-mono font-medium text-sm">
                    {order.order_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Payment
                  </p>
                  <p className="font-medium text-sm">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Confirmed
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-medium">
                      {"\u20B9"}
                      {(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                  <span className="font-semibold">Total</span>
                  <span className="font-mono font-bold text-lg">
                    {"\u20B9"}
                    {order.total.toLocaleString("en-IN")}
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
