# AgentCheckout

A drop-in layer that makes any D2C merchant's store agent-shoppable in 10 minutes. Merchant pastes their store URL, gets an MCP endpoint and a one-line script tag. ChatGPT, Claude, and any MCP-compatible agent can then discover products, add to cart, and check out on that store — no re-platforming required.

## Live URL

**https://agentcheckout.vercel.app**

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Deploy:** Vercel
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

---

Built at OpenCode Buildathon 2026 — 4 hours, from scratch, with Claude Code.
