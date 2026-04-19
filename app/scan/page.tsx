/* Agent-Readiness Scanner — /scan */
"use client";

import { useState } from "react";

type Check = { key: string; label: string; passed: boolean; detail: string };
type ScanResult = {
  url: string;
  score: number;
  rank: number;
  totalScanned: number;
  checks: Check[];
  verdict: string;
};

export default function ScanPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runScan(e?: React.FormEvent) {
    e?.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
      if (typeof window !== "undefined" && (window as any).posthog) {
        (window as any).posthog.capture("scan_completed", {
          scanned_url: data.url,
          score: data.score,
        });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const shareText = result
    ? `My store is only ${result.score}% agent-ready 😬\nChatGPT won't find me. Claude can't check me out.\nWhat's your agent-readiness score?\n\nFind out (10s): https://agentcheckout.app/scan`
    : "";
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-sm text-neutral-400 hover:text-white">← AgentCheckout</a>
        <h1 className="text-4xl md:text-5xl font-semibold mt-6 leading-tight">
          Is your store ready for AI shoppers?
        </h1>
        <p className="mt-4 text-lg text-neutral-300">
          ChatGPT, Claude, Perplexity, and every MCP agent will soon shop on behalf of your customers.
          Find out if your store shows up — or disappears — in 10 seconds.
        </p>

        <form onSubmit={runScan} className="mt-8 flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourstore.com"
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-white/40 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-white text-black font-medium disabled:opacity-50"
          >
            {loading ? "Scanning…" : "Scan"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {result && (
          <div className="mt-10 rounded-2xl border border-neutral-800 p-8 bg-gradient-to-b from-neutral-950 to-black">
            <div className="flex items-baseline justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-neutral-400">{result.url}</p>
                <p className="mt-2 text-6xl font-bold">
                  {result.score}
                  <span className="text-2xl text-neutral-500">/100</span>
                </p>
                <p className="mt-2 text-lg">{result.verdict}</p>
              </div>
              <div className="text-right text-sm text-neutral-400">
                Ranked <span className="text-white font-semibold">#{result.rank}</span> of {result.totalScanned} stores scanned today
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {result.checks.map((c) => (
                <li key={c.key} className="flex items-start gap-3">
                  <span className={c.passed ? "text-green-400" : "text-red-400"}>
                    {c.passed ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="text-sm text-neutral-400">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-lg bg-white text-black text-center font-medium"
              >
                Share my score on X
              </a>
              <a
                href="/#signup"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white text-center font-medium"
              >
                Make my store 100% agent-ready →
              </a>
            </div>
          </div>
        )}

        <section className="mt-16 text-sm text-neutral-500">
          Checks run: robots.txt for GPTBot/ClaudeBot, sitemap.xml, Product JSON-LD,
          llms.txt, MCP endpoint. No data stored beyond the score.
        </section>
      </div>
    </main>
  );
}
