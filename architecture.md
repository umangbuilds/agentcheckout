# Architecture — AgentCheckout

## Overview

AgentCheckout is a Next.js 16 App Router application. It runs a Claude-powered shopping agent that uses tool-use (function calling) to search products, add to cart, and checkout on behalf of users. Results stream in real-time via SSE.

## Request Flow

```
Browser → /api/agent (POST) → lib/agent.ts (Claude tool-use loop)
                                  ↓
                            lib/products.ts (hardcoded catalog)
                                  ↓
                            SSE stream back to browser
                                  ↓
                            lib/supabase.ts (log session)
```

## File Map

```
app/
  layout.tsx           — Root layout, metadata, fonts
  page.tsx             — Landing page (client component, signup form)
  globals.css          — Tailwind + custom animations
  icon.tsx             — Favicon (ImageResponse API)
  opengraph-image.tsx  — OG social card (ImageResponse API, edge runtime)

  api/
    agent/route.ts     — SSE streaming endpoint, calls runAgent()
    register/route.ts  — POST merchant signup, writes to Supabase
    mcp/[slug]/route.ts — GET MCP-shaped JSON manifest (theater)

  success/[slug]/page.tsx — Post-signup deliverables
  try/[slug]/page.tsx     — Live agent demo page

lib/
  agent.ts             — Core agent loop (Anthropic SDK, async generator)
  products.ts          — Hardcoded 8-item product catalog
  supabase.ts          — Lazy-init server-side Supabase client
```

## Key Decisions

- **Lazy Supabase client**: Initialized on first call, not at import time. This prevents build errors when env vars are placeholders.
- **Async generator pattern**: `runAgent()` yields events as they occur, allowing the SSE route to stream each event immediately.
- **Word-split search**: Product search splits the query into words and matches any word against name+category+description. More forgiving than exact substring match.
- **Theater MCP**: The `/api/mcp/[slug]` endpoint returns MCP-shaped JSON but doesn't implement the real MCP protocol. Sufficient for demo purposes.
- **No auth**: RLS disabled on both tables. Buildathon scope — no real user auth needed.

## Database Schema

**merchants**: id (uuid), slug (text, unique), email, store_url, store_name, created_at
**agent_sessions**: id (uuid), merchant_slug (text), query, events (jsonb), order_id, order_total, created_at
