/* Landing page — premium white, Stripe-level polish with futuristic touches */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";

/* Typing animation for the terminal preview */
const TERMINAL_LINES = [
  { text: '> "Buy me running shoes under \u20B94000"', color: "text-white", delay: 0 },
  { text: "", color: "", delay: 600 },
  { text: "[MCP] Connected to demo-store", color: "text-emerald-400", delay: 900 },
  { text: '[AGENT] Searching: "shoes" (max \u20B94000)', color: "text-blue-400", delay: 1500 },
  { text: "[AGENT] Found 3 products", color: "text-blue-400", delay: 2100 },
  { text: "[AGENT] Added: Nike Revolution 7 \u2014 \u20B93,499", color: "text-yellow-400", delay: 2800 },
  { text: "[CHECKOUT] Processing via MoltPe...", color: "text-gray-400", delay: 3500 },
  { text: "[CHECKOUT] \u2713 Order AGN-3DUNPX confirmed \u2014 \u20B93,499", color: "text-emerald-400 font-semibold", delay: 4200 },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      if (line.text) {
        timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="p-5 font-mono text-[13px] leading-relaxed">
      {TERMINAL_LINES.slice(0, visibleLines).map(
        (line, i) =>
          line.text && (
            <div key={i} className={`${line.color} terminal-line py-0.5`}>
              {line.text}
            </div>
          )
      )}
      {visibleLines < TERMINAL_LINES.length && (
        <span className="inline-block w-2 h-4 bg-emerald-400 animate-blink mt-1" />
      )}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_name: storeName, store_url: storeUrl, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      track("signup", { slug: data.slug, store_name: storeName });
      router.push(`/success/${data.slug}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dot-grid">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            AgentCheckout
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="/api/mcp/demo"
            className="text-[13px] text-gray-400 hover:text-gray-800 transition-colors"
          >
            API Docs
          </a>
          <a
            href="/scan"
            className="text-[13px] text-gray-400 hover:text-gray-800 transition-colors"
          >
            Scanner
          </a>
          <a
            href="/try/demo"
            className="text-[13px] font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all btn-shine"
          >
            Live demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-6 hero-glow">
        <div className="animate-fade-up-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-dot" />
            Built at OpenCode Buildathon 2026
          </div>
        </div>

        <h1 className="text-[64px] font-bold tracking-[-0.03em] leading-[1.08] max-w-[720px] animate-fade-up-2">
          Make your store{" "}
          <span className="animated-gradient-text">agent-shoppable</span> in 10
          minutes
        </h1>

        <p className="mt-6 text-[19px] text-gray-500 max-w-xl leading-relaxed animate-fade-up-3">
          One integration. ChatGPT, Claude, and every MCP-compatible AI agent
          can discover your products and checkout.
        </p>

        <div className="mt-8 animate-fade-up-3">
          <a href="/scan" className="text-sm text-indigo-600 hover:text-indigo-800 underline underline-offset-2">
            Free: scan your store&apos;s agent-readiness →
          </a>
        </div>

        <div className="mt-6 flex items-center gap-4 animate-fade-up-4">
          <a
            href="#signup"
            className="inline-flex items-center gap-2 bg-black text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-black/10 btn-shine"
          >
            Get started free
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="/try/demo"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-all px-7 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
          >
            Watch the demo
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <div className="flex items-center gap-8 text-[13px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>3 MCP tools</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Real-time agent trace</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>Works with any D2C store</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>&lt; 10 second checkout</span>
          </div>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24 pt-6">
        <div className="bg-[#0a0a0a] rounded-2xl border border-gray-200/10 overflow-hidden shadow-[0_20px_70px_-15px_rgba(0,0,0,0.25)]">
          {/* macOS chrome */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                agentcheckout &mdash; agent-session
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              live
            </span>
          </div>
          <AnimatedTerminal />
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[13px] font-medium text-indigo-600 uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Three steps. Zero re-platforming.
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-lg mx-auto">
              Works with Shopify, WooCommerce, and any custom storefront.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="card-hover bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Discovery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Agents find your products by natural language query, category, or
                price range via a hosted MCP endpoint.
              </p>
            </div>

            <div className="card-hover bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Transaction</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Agents add to cart and complete checkout through your existing
                payment processor. No new integration.
              </p>
            </div>

            <div className="card-hover bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">One line of code</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Paste a single script tag into your site header. Your store is
                now agent-shoppable. That&apos;s it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-start gap-16">
          <div className="flex-1">
            <blockquote className="text-[28px] font-medium leading-snug tracking-tight text-gray-900">
              &ldquo;D2C founders are panicking about agentic commerce. This is
              the fastest path to agent-readiness I&apos;ve seen.&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">SP</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Senior Payments Engineer
                </p>
                <p className="text-sm text-gray-500">Bangalore, India</p>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 self-stretch" />
          <div className="w-64 space-y-6 pt-2">
            <div>
              <p className="text-3xl font-bold tracking-tight">10 min</p>
              <p className="text-sm text-gray-500 mt-1">Setup time, end to end</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">3 tools</p>
              <p className="text-sm text-gray-500 mt-1">Search, cart, checkout via MCP</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">0 code</p>
              <p className="text-sm text-gray-500 mt-1">Changes to your existing store</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section
        id="signup"
        className="border-t border-gray-100 bg-gray-50/60"
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Get started in 10 minutes
            </h2>
            <p className="text-gray-500 mb-10">
              No credit card. No code changes. Free during beta.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Store name
                </label>
                <input
                  type="text"
                  placeholder="e.g. FitKicks Running"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Store URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-store.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300 transition-all placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up your store...
                  </span>
                ) : (
                  "Make my store agent-shoppable"
                )}
              </button>
              {error && (
                <p className="text-red-600 text-sm text-center mt-2">
                  {error}
                </p>
              )}
            </form>

            <p className="mt-6 text-[12px] text-gray-400">
              Your store data is only used to generate your MCP endpoint.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">A</span>
            </div>
            <span className="text-[13px] text-gray-400">
              AgentCheckout
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors">Terms</a>
            <a href="mailto:hello@agentcheckout.app" className="hover:text-gray-600 transition-colors">Contact</a>
            <span>
              Payments:{" "}
              <span className="text-gray-600 font-medium">MoltPe</span>
              <span className="mx-1.5 text-gray-300">/</span>
              <span className="text-gray-600">Razorpay</span>
              <span className="mx-1.5 text-gray-300">/</span>
              <span className="text-gray-300">Stripe (soon)</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
