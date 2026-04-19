/* Success page — shows MCP endpoint, snippet, and try-it link after merchant signup */
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
    <div className="min-h-screen bg-white">
      <nav className="max-w-4xl mx-auto px-8 py-6">
        <a href="/" className="text-xl font-bold tracking-tight">
          AgentCheckout
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Your store is now agent-shoppable.
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Here&apos;s everything you need.
        </p>

        <div className="space-y-10">
          {/* Block 1: MCP Endpoint */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              1. Your MCP Endpoint
            </h2>
            <CopyBlock value={mcpUrl} />
          </div>

          {/* Block 2: Integration Snippet */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              2. Integration Snippet
            </h2>
            <CopyBlock value={snippet} />
            <p className="mt-2 text-sm text-gray-500">
              Paste into your site&apos;s &lt;head&gt; — takes 30 seconds.
            </p>
          </div>

          {/* Block 3: Try It */}
          <div>
            <h2 className="text-lg font-semibold mb-3">3. Try It</h2>
            <a
              href={tryUrl}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Watch the agent shop on your store &rarr;
            </a>
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
    <div className="flex items-start gap-3">
      <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono break-all">
        {value}
      </code>
      <button
        onClick={handleCopy}
        className="shrink-0 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
