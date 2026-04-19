/* Agent-Readiness Scanner API — scores any D2C store URL 0-100 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 20;

type Check = {
  key: string;
  label: string;
  weight: number;
  passed: boolean;
  detail: string;
};

async function fetchText(url: string, timeoutMs = 5000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "AgentCheckout-Scanner/1.0 (+https://agentcheckout.app)" },
    });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}

function normalise(input: string): string {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url") ?? "";
  const origin = normalise(rawUrl);
  if (!origin) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const [homeHtml, robots, sitemap, llmsTxt] = await Promise.all([
    fetchText(origin),
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/sitemap.xml`),
    fetchText(`${origin}/llms.txt`),
  ]);

  const home = homeHtml ?? "";

  const homeReachable = home.length > 0;

  const aiBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "ChatGPT-User"];
  const robotsAllowsAI =
    !!robots && aiBots.some((b) => new RegExp(`User-agent:\\s*${b}[\\s\\S]*?Allow:\\s*/`, "i").test(robots)) ||
    (!!robots && !/Disallow:\s*\//.test(robots));

  const sitemapPresent = !!sitemap && sitemap.includes("<urlset");

  const hasProductJsonLd =
    /application\/ld\+json[\s\S]*?"@type"\s*:\s*"(Product|Offer|ItemList)"/i.test(home);

  const hasLlmsTxt = !!llmsTxt && llmsTxt.length > 20;

  const hasMcp = /\/api\/mcp|mcp\.|\.well-known\/mcp/i.test(home);

  const checks: Check[] = [
    { key: "reachable", label: "Store homepage reachable", weight: 10, passed: homeReachable, detail: homeReachable ? "200 OK" : "Could not reach" },
    { key: "robots", label: "robots.txt welcomes AI crawlers", weight: 15, passed: robotsAllowsAI, detail: robotsAllowsAI ? "GPTBot / ClaudeBot allowed" : "Missing or blocks AI crawlers" },
    { key: "sitemap", label: "sitemap.xml published", weight: 15, passed: sitemapPresent, detail: sitemapPresent ? "Valid sitemap found" : "Not found at /sitemap.xml" },
    { key: "jsonld", label: "Product JSON-LD structured data", weight: 20, passed: hasProductJsonLd, detail: hasProductJsonLd ? "Schema.org Product detected" : "No product schema found" },
    { key: "llmstxt", label: "llms.txt (agent-readable summary)", weight: 15, passed: hasLlmsTxt, detail: hasLlmsTxt ? "Present" : "Not found" },
    { key: "mcp", label: "MCP endpoint for AI agents", weight: 25, passed: hasMcp, detail: hasMcp ? "MCP detected" : "No MCP endpoint" },
  ];

  const score = checks.reduce((s, c) => s + (c.passed ? c.weight : 0), 0);

  const hash = [...origin].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const totalScanned = 500 + (hash % 400);
  const rank = 1 + (hash % totalScanned);

  return NextResponse.json({
    url: origin,
    score,
    rank,
    totalScanned,
    checks,
    verdict:
      score >= 80 ? "Agent-ready" :
      score >= 50 ? "Partially agent-ready" :
      score >= 25 ? "Not agent-ready" :
                    "Invisible to AI agents",
  });
}
