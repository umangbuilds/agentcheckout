/* Demo page — premium white with polished dark terminal */
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
            /* skip */
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
    if (line.startsWith("[AGENT] Added")) return "text-yellow-300";
    if (line.startsWith("[AGENT] Parsing")) return "text-gray-500";
    if (line.startsWith("[CHECKOUT] Processing")) return "text-gray-500";
    if (line.includes("\u2713") || line.includes("confirmed"))
      return "text-emerald-400 font-semibold";
    if (line.startsWith("[ERROR]")) return "text-red-400";
    if (line.startsWith("[AGENT]")) return "text-gray-400";
    return "text-gray-500";
  }

  return (
    <div className="min-h-screen bg-white dot-grid">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            AgentCheckout
          </span>
        </a>
        <div className="flex items-center gap-2 text-[12px] text-gray-400 font-mono bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          {slug}-store
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Agent Shopper
            </h1>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live
            </span>
          </div>
          <p className="text-gray-500 text-[15px]">
            Type a natural language shopping request. Watch the AI agent search,
            select, and checkout in real-time.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 transition-all placeholder:text-gray-400 bg-gray-50"
                disabled={running}
                placeholder="What would you like to buy?"
              />
            </div>
            <button
              onClick={handleRun}
              disabled={running || !query.trim()}
              className="shrink-0 bg-black text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 btn-shine"
            >
              {running ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M4 2L14 8L4 14V2Z" />
                  </svg>
                  Run Agent
                </>
              )}
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)]">
          {/* Chrome */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[11px] text-gray-600 font-mono">
                agent-session &mdash; {slug}
              </span>
            </div>
            {running && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                streaming
              </span>
            )}
          </div>

          {/* Body */}
          <div
            ref={terminalRef}
            className="p-5 min-h-[300px] max-h-[460px] overflow-y-auto font-mono text-[13px] leading-relaxed terminal-scroll"
          >
            {lines.length === 0 && !running && (
              <div className="text-gray-600 flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <span>Waiting for command...</span>
                <span className="w-2 h-4 bg-gray-600 animate-blink" />
              </div>
            )}
            {lines.map((line, i) => (
              <div
                key={i}
                className={`py-[3px] terminal-line ${getLineColor(line)}`}
              >
                {line}
              </div>
            ))}
            {running && lines.length > 0 && (
              <div className="py-0.5 flex items-center">
                <span className="w-2 h-4 bg-emerald-400 animate-blink" />
              </div>
            )}
          </div>
        </div>

        {/* Order confirmation */}
        {order && (
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-fade-up">
            {/* Green header */}
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.5 4.5L6.5 11.5L2.5 7.5"
                      stroke="white"
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
              <span className="text-[12px] font-mono text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                {order.order_id}
              </span>
            </div>

            {/* Order details */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                    Order ID
                  </p>
                  <p className="font-mono font-semibold text-sm">
                    {order.order_id}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                    Payment method
                  </p>
                  <p className="font-medium text-sm">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                    Status
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Confirmed
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-[12px] text-gray-400">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-semibold">
                      {"\u20B9"}
                      {(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                  <span className="font-semibold">Total</span>
                  <span className="font-mono font-bold text-xl">
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
