/* Landing page — hero, signup form, how-it-works, payment rail footer */
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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">AgentCheckout</span>
        <a
          href="/try/demo"
          className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          Try the demo &rarr;
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-16 pb-12">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Make your D2C store
          <br />
          <span className="underline decoration-2 underline-offset-4">
            agent-shoppable
          </span>{" "}
          in 10 minutes.
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          One script tag. ChatGPT, Claude, and every AI agent can now discover
          your products and check out on your store.
        </p>
      </section>

      {/* Signup form */}
      <section className="max-w-4xl mx-auto px-8 pb-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-md space-y-4"
        >
          <input
            type="text"
            placeholder="Store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="url"
            placeholder="Store URL (https://...)"
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Setting up..."
              : "Make my store agent-shoppable \u2192"}
          </button>
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </form>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-bold mb-8">How it works</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Discovery</h3>
            <p className="text-sm text-gray-600">
              Agents find your products by query, category, or price via a
              hosted MCP endpoint.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Transaction</h3>
            <p className="text-sm text-gray-600">
              Agents add to cart and complete checkout through your existing
              payment processor.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Zero Re-platform</h3>
            <p className="text-sm text-gray-600">
              Works with Shopify, WooCommerce, custom builds. One script tag.
              No migration.
            </p>
          </div>
        </div>
      </section>

      {/* Payment rail footer */}
      <footer className="max-w-4xl mx-auto px-8 py-10 border-t border-gray-100">
        <p className="text-sm text-gray-400">
          Payments powered by:{" "}
          <span className="font-semibold text-gray-700">MoltPe</span>
          {" · "}
          <span className="text-gray-700">Razorpay</span>
          {" · "}
          <span className="text-gray-300">Stripe (soon)</span>
        </p>
      </footer>
    </div>
  );
}
