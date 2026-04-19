/* Success page — premium white with polished deliverable cards */
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function SuccessPage() {
  const params = useParams();
  const slug = params.slug as string;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const mcpUrl = `${baseUrl}/api/mcp/${slug}`;
  const snippet = `<script src="${baseUrl}/v1.js" data-store="${slug}"></script>`;
  const tryUrl = `/try/${slug}`;

  return (
    <div className="min-h-screen bg-white dot-grid">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-5">
        <a href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            AgentCheckout
          </span>
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 4.5L6.5 11.5L2.5 7.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-emerald-800">
              Setup complete
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Your store is{" "}
            <span className="animated-gradient-text">agent-shoppable</span>.
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Here&apos;s everything you need to go live.
          </p>
        </div>

        {/* Deliverable cards */}
        <div className="space-y-5">
          {/* Card 1: MCP Endpoint */}
          <div className="card-hover bg-white border border-gray-200 rounded-2xl overflow-hidden animate-fade-up-1">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">MCP Endpoint</h2>
                <p className="text-[12px] text-gray-400">
                  Point any MCP-compatible agent here
                </p>
              </div>
            </div>
            <div className="px-6 py-5">
              <CopyBlock value={mcpUrl} />
            </div>
          </div>

          {/* Card 2: Integration Snippet */}
          <div className="card-hover bg-white border border-gray-200 rounded-2xl overflow-hidden animate-fade-up-2">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">Integration Snippet</h2>
                <p className="text-[12px] text-gray-400">
                  Add to your site&apos;s &lt;head&gt; tag
                </p>
              </div>
            </div>
            <div className="px-6 py-5">
              <CopyBlock value={snippet} />
              <p className="mt-3 text-[12px] text-gray-400">
                Works with any website builder, Shopify theme, or custom code.
              </p>
            </div>
          </div>

          {/* Card 3: Try it */}
          <div className="card-hover bg-white border border-gray-200 rounded-2xl overflow-hidden animate-fade-up-3">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">Test It Live</h2>
                <p className="text-[12px] text-gray-400">
                  Watch an AI agent shop on your store
                </p>
              </div>
            </div>
            <div className="px-6 py-5">
              <a
                href={tryUrl}
                className="inline-flex items-center gap-2.5 bg-black text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-black/10 btn-shine"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M4 2L14 8L4 14V2Z" />
                </svg>
                Watch the agent shop your store
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CopyBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-[13px] text-gray-700 overflow-x-auto">
        {value}
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          copied
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
        }`}
      >
        {copied ? (
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4.5L6.5 11.5L2.5 7.5"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copied
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy
          </span>
        )}
      </button>
    </div>
  );
}
