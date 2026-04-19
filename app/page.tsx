/* Landing page — Stripe meets Notion aesthetic */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        body: JSON.stringify({
          store_name: storeName,
          store_url: storeUrl,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/success/${data.slug}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            AgentCheckout
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/api/mcp/demo"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            API
          </a>
          <a
            href="/try/demo"
            className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Live demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse-dot" />
            Built at OpenCode Buildathon 2026
          </span>
        </div>

        <h1 className="text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl">
          Make your store{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            agent-shoppable
          </span>{" "}
          in 10 minutes
        </h1>

        <p className="mt-6 text-xl text-gray-500 max-w-2xl leading-relaxed">
          One integration. ChatGPT, Claude, and every MCP-compatible AI agent
          can discover your products and checkout on your store.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <a
            href="#signup"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
          >
            Get started free
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="/try/demo"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors px-6 py-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
          >
            Watch the demo
          </a>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-[#0c0c0c] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-gray-500 font-mono ml-2">
              agent-session
            </span>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed">
            <div className="text-gray-500">
              {"> "}
              <span className="text-white">
                &quot;Buy me running shoes under 4000&quot;
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="text-emerald-400">[MCP] Connected to demo-store</div>
              <div className="text-blue-400">
                [AGENT] Searching: &quot;shoes&quot; (max &#8377;4000)
              </div>
              <div className="text-blue-400">[AGENT] Found 3 products</div>
              <div className="text-yellow-400">
                [AGENT] Added: Nike Revolution 7 &#8212; &#8377;3,499
              </div>
              <div className="text-gray-400">
                [CHECKOUT] Processing via MoltPe...
              </div>
              <div className="text-emerald-400 font-semibold">
                [CHECKOUT] &#10003; Order AGN-3DUNPX confirmed &#8212; &#8377;3,499
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight">
            Three steps. Zero re-platforming.
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Works with Shopify, WooCommerce, and custom builds.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
              <span className="text-indigo-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Discovery</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Agents find your products by natural language query, category, or
              price range via a hosted MCP endpoint.
            </p>
          </div>

          <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
              <span className="text-emerald-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Transaction</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Agents add to cart and complete checkout through your existing
              payment rail. No new integration needed.
            </p>
          </div>

          <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
              <span className="text-amber-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">One line of code</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Paste a single script tag into your site header. Your store is
              now agent-shoppable. That&apos;s it.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <blockquote className="text-2xl font-medium leading-relaxed text-gray-800">
              &ldquo;D2C founders are panicking about agentic commerce. This is
              the fastest path to agent-readiness I&apos;ve seen.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">SP</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Senior Payments Engineer
                </p>
                <p className="text-sm text-gray-500">Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section id="signup" className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Get started in 10 minutes
          </h2>
          <p className="text-gray-500 mb-10">
            No credit card required. Free during beta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Store name
              </label>
              <input
                type="text"
                placeholder="e.g. FitKicks Running"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Store URL
              </label>
              <input
                type="url"
                placeholder="https://your-store.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up your store..." : "Make my store agent-shoppable"}
            </button>
            {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <p className="mt-6 text-xs text-gray-400">
            By signing up you agree to our terms. Your store data is only used
            to generate your MCP endpoint.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-sm font-medium text-gray-400">
              AgentCheckout
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
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
