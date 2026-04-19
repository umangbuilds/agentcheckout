/* Success page — polished deliverables with Stripe-level card design */
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
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-5">
        <a href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            AgentCheckout
          </span>
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-5">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg
                width="12"
                height="12"
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
            <span className="text-sm font-medium text-emerald-800">
              Setup complete
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Your store is agent-shoppable.
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Here&apos;s everything you need to go live.
          </p>
        </div>

        {/* Deliverable cards */}
        <div className="space-y-5">
          {/* Card 1: MCP Endpoint */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h2 className="font-semibold">MCP Endpoint</h2>
                <p className="text-xs text-gray-500">
                  Point any MCP-compatible agent at this URL
                </p>
              </div>
            </div>
            <div className="px-6 py-4">
              <CopyBlock value={mcpUrl} />
            </div>
          </div>

          {/* Card 2: Integration Snippet */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h2 className="font-semibold">Integration Snippet</h2>
                <p className="text-xs text-gray-500">
                  Paste into your site&apos;s &lt;head&gt; tag
                </p>
              </div>
            </div>
            <div className="px-6 py-4">
              <CopyBlock value={snippet} />
              <p className="mt-3 text-xs text-gray-400">
                Takes 30 seconds. Works with any website builder or custom code.
              </p>
            </div>
          </div>

          {/* Card 3: Try it */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h2 className="font-semibold">Test It Live</h2>
                <p className="text-xs text-gray-500">
                  Watch an AI agent shop on your store in real-time
                </p>
              </div>
            </div>
            <div className="px-6 py-5">
              <a
                href={tryUrl}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
              >
                <svg
                  width="14"
                  height="14"
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
      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-700 overflow-x-auto">
        {value}
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
          copied
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
      >
        {copied ? (
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="text-emerald-600"
            >
              <path
                d="M13.5 4.5L6.5 11.5L2.5 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copied
          </span>
        ) : (
          "Copy"
        )}
      </button>
    </div>
  );
}
