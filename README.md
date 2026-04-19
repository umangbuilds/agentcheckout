# AgentCheckout

A drop-in layer that makes any D2C merchant's store agent-shoppable in 10 minutes. Merchant pastes their store URL, gets an MCP endpoint and a one-line script tag. ChatGPT, Claude, and any MCP-compatible agent can then discover products, add to cart, and check out on that store — no re-platforming required.

## Live URL

**https://agentcheckout.app**

Fallback: https://agentcheckout.vercel.app

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Deploy:** Vercel (US East)
- **Database:** Supabase (PostgreSQL)
- **Runtime LLM:** Anthropic Claude Sonnet 4.5 via `@anthropic-ai/sdk`
- **Payments:** MoltPe (test mode theater)

## How It Works

1. Merchant submits store name, URL, and email on the landing page
2. Gets back an MCP endpoint URL, integration snippet, and demo link
3. The MCP endpoint exposes `search_products`, `add_to_cart`, and `checkout` tools
4. An AI agent (Claude) uses those tools in a live loop to shop the store
5. Full agent trace streams in real-time via SSE to a terminal-style UI

## Key Routes

| Route | Description |
|---|---|
| `/` | Landing page + merchant signup |
| `/try/[slug]` | Live agent demo — watch Claude shop |
| `/success/[slug]` | Post-signup deliverables (MCP URL, snippet, demo link) |
| `/api/agent` | SSE streaming agent loop |
| `/api/register` | Merchant registration |
| `/api/mcp/[slug]` | MCP-shaped JSON manifest |

## Data Storage

| Table | Contents |
|---|---|
| `merchants` | Every signup: slug, store name, URL, email, timestamp |
| `agent_sessions` | Every demo run: query, events, order ID, total, timestamp |

## Local Development

```bash
cp .env.example .env.local   # fill in keys
npm install
npm run dev                   # http://localhost:3000
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API for agent loop |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-side key |
| `NEXT_PUBLIC_APP_URL` | Live domain for URL generation |

---

Built at OpenCode Buildathon 2026 — 4 hours, from scratch, with Claude Code.
