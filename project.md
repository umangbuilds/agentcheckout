# AgentCheckout — Project Spec

> This file is the single source of truth for Claude Code building this project autonomously.
> Read it end-to-end before taking any action. Follow it exactly.

---

## WHO AM I, WHAT IS THIS

You are Claude Code running Opus 4.7. You are building a product called **AgentCheckout**
for the OpenCode Buildathon at Razorpay HQ. The builder (UG) is a solo senior fintech
founder with 13+ years in payments. Submission deadline is **3:45 PM today**.
Internal code freeze is **2:30 PM today**.

**The product in one sentence:** A drop-in layer that makes any D2C merchant's store
agent-shoppable in 10 minutes. Merchant pastes store URL → gets an MCP endpoint +
one-line script → ChatGPT / Claude / any MCP agent can discover and checkout on their store.

**The track:** Revenue. The rubric rewards traction + live product quality.
The build exists to prove the concept end-to-end in a 3-minute stage demo.

**The narrative:** *"Every D2C merchant will need to accept agents as shoppers in the
next 18 months. Here's how, in 4 hours."*

---

## AUTONOMY RULES

You have full autonomy within this spec. Do NOT ask for permission on:

- Running `npm`, `vercel`, `supabase`, `git`, `gh` commands
- Creating files, editing files, deleting files within this repo
- Writing SQL migrations and running them via Supabase MCP
- Deploying to Vercel
- Any action the spec authorizes below

You MUST ask before doing any of the following:

- Installing a package NOT in the approved dependency list (see Stack section)
- Adding a feature NOT in the acceptance criteria
- Changing the file list
- Adding auth / login / multi-user
- Changing the tech stack
- Refactoring working code "because it bothers you"

**The rule:** If it's in this spec, do it without asking. If it's not, stop and ask.

---

## STACK (LOCKED)

- **Framework:** Next.js 14 App Router + TypeScript + Tailwind
- **Deploy:** Vercel
- **DB:** Supabase (new project named `agentcheckout`)
- **Runtime LLM:** Anthropic Claude Sonnet 4.5 via `@anthropic-ai/sdk`
- **Styling:** Inline Tailwind only. NO shadcn, NO custom design system, NO component library.
- **Icons:** none for MVP. Use emoji or plain text.
- **Analytics:** PostHog (client-side)

**Approved dependencies (npm install exactly these, no more):**

```
@anthropic-ai/sdk
@supabase/supabase-js
```

Everything else Next.js ships by default. No state management library. No toast library.
No form library. No validation library. No analytics library (Vercel Analytics is on by default, that's enough).
`useState` + native `<form>` + `alert()` for errors.

---

## ENVIRONMENT SETUP — PHASE 0

### Step 1: Verify basics (silent)

- `node --version` returns 18+
- `git --version`, `gh auth status` (should show `umangbuilds`)
- `vercel --version`, `vercel whoami`

### Step 2: Check `.env.local`

If `.env.local` doesn't exist, create it with:

```
ANTHROPIC_API_KEY=<ASK USER>
NEXT_PUBLIC_SUPABASE_URL=<fill after Supabase project created>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<fill after Supabase project created>
SUPABASE_SERVICE_ROLE_KEY=<fill after Supabase project created>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Supabase setup

**Try Path A first (auto via MCP):**

Use the Supabase MCP tools available to you to:

1. Create a new project named `agentcheckout` (US-East-1 preferred, Tokyo acceptable)
2. Wait for provisioning (~90 sec)
3. Run this SQL migration:

```sql
create table merchants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  email text not null,
  store_url text not null,
  store_name text not null,
  created_at timestamptz default now()
);

create table agent_sessions (
  id uuid primary key default gen_random_uuid(),
  merchant_slug text,
  query text,
  events jsonb default '[]'::jsonb,
  order_id text,
  order_total numeric,
  created_at timestamptz default now()
);

create index on agent_sessions (merchant_slug);
create index on agent_sessions (created_at desc);

insert into merchants (slug, email, store_url, store_name)
values ('demo', 'demo@agentcheckout.app', 'https://demo.example.com', 'Demo Running Store');
```

4. Fetch project URL, anon key, service role key from MCP
5. Write them into `.env.local`
6. Turn off Row Level Security on both tables (buildathon; no real auth)

**If Path A fails (MCP can't create projects):**

Stop immediately and tell the user:

> "Supabase MCP can't create projects. Please do this manually in 3 min:
> 1. Go to supabase.com/dashboard, click New Project
> 2. Name: `agentcheckout`, region: nearest to you
> 3. Wait for provisioning
> 4. Go to Settings → API, copy: Project URL, anon key, service_role key
> 5. Paste the three values into `.env.local`
> 6. Run the SQL from the migration file I'll create at `supabase/migration.sql`
> 7. Reply 'supabase ready' when done"
>
> While you do that, I'll scaffold Next.js in parallel."

Then proceed with Next.js scaffolding while user does Supabase manually.

### Step 4: Next.js scaffolding

From inside the repo root (don't create a subfolder):

```bash
npx create-next-app@latest . --ts --tailwind --app --no-src-dir --import-alias "@/*" --use-npm --eslint
npm install @anthropic-ai/sdk @supabase/supabase-js
```

If `create-next-app` complains about non-empty directory, move `project.md` out
temporarily, scaffold, then move it back.

### Step 5: Git

```bash
git add -A
git commit -m "initial scaffold"
gh repo create agentcheckout --private --source=. --push
```

### BLOCKER CHECK

If `ANTHROPIC_API_KEY` is not set in `.env.local`, STOP and tell the user:

> "Need the Anthropic API key to proceed. Go to console.anthropic.com, top up $5, generate a key (~90 sec). Paste the key and say 'key ready' when done."

---

## FILE LIST — BUILD EXACTLY THESE FILES

```
agentcheckout/
├── .env.local
├── project.md                          # this file
├── app/
│   ├── layout.tsx                      # root layout + metadata
│   ├── page.tsx                        # landing page + signup form
│   ├── success/[slug]/page.tsx         # post-signup deliverables page
│   ├── try/[slug]/page.tsx             # "watch agent shop" demo page
│   └── api/
│       ├── register/route.ts           # POST: creates merchant, returns slug + URLs
│       ├── agent/route.ts              # POST: streams agent tool-use loop as SSE
│       └── mcp/[slug]/route.ts         # GET: returns MCP-shaped JSON manifest (theater)
├── lib/
│   ├── agent.ts                        # Claude tool-use loop, yields events
│   ├── products.ts                     # hardcoded catalog (8 items)
│   └── supabase.ts                     # server client
└── package.json
```

**10 code files. Do not create additional files.** No README yet (that comes at 2:25 PM).
No tests. No docs folder.

---

## ACCEPTANCE CRITERIA — WHAT "DONE" MEANS

A build is done when ALL of these are true on the live deployed URL:

1. **Landing at `/`** loads with hero, signup form (store name, URL, email), and
   "Powered by MoltPe · Razorpay · Stripe (soon)" footer.
2. **POST to `/api/register`** with valid body writes a row to `merchants`, returns
   `{ slug, mcp_url, snippet, try_url }`.
3. **`/success/[slug]`** shows three blocks: MCP endpoint (copyable), integration snippet
   (copyable), "Try it" button linking to `/try/[slug]`.
4. **`/try/[slug]`** has a textarea prefilled with `"Buy me running shoes under ₹4000"`,
   a "Run Agent" button, and a black terminal-style trace panel.
5. **Clicking "Run Agent"** streams events from `/api/agent` via SSE. Events include:
   `[MCP] Connected`, `[AGENT] Searching...`, `[AGENT] Added: <product>`,
   `[CHECKOUT] Processing via MoltPe...`, `[CHECKOUT] ✓ Order <ID> confirmed — ₹<total>`.
6. **After stream completes**, a green "Order Confirmed" card appears with order ID,
   total, payment method (`MoltPe (test)`), and itemized list.
7. **GET `/api/mcp/[slug]`** returns a JSON manifest listing the 3 tools in MCP-shaped
   form. Theater — looks MCP-compliant to anyone who curls it.
8. **Vercel Analytics** is enabled (auto-on by default for all Vercel deployments — no config needed).
9. **Deployed on Vercel** with custom domain attached (user provides domain after
   scaffolding is done).

### NOT REQUIRED — DO NOT BUILD

- Real MCP protocol compliance (shape JSON to look MCP, don't implement the spec)
- Real Razorpay / MoltPe integration (payment is printed theater in the terminal)
- Real Shopify API integration (products are hardcoded)
- Merchant dashboard, login, auth, multi-user
- Admin panel
- Mobile responsiveness (desktop-only acceptable)
- Email sending
- Tests
- Error boundaries / loading skeletons beyond a basic spinner
- Dark mode
- The `/v1.js` file at `/v1.js` — the snippet shown to merchants is theater, the file doesn't need to exist

---

## CODE SCAFFOLDING — DIRECTIONAL, OPUS 4.7 WRITES THE ACTUAL CODE

### `lib/products.ts`

```typescript
export const PRODUCTS = [
  { id: "p1", name: "Nike Revolution 7", price: 3499, category: "shoes", desc: "Lightweight daily trainer" },
  { id: "p2", name: "Adidas Duramo SL", price: 3999, category: "shoes", desc: "Cushioned runner with Lightmotion midsole" },
  { id: "p3", name: "Puma Softride Pro", price: 2799, category: "shoes", desc: "Budget runner with soft foam" },
  { id: "p4", name: "Asics Gel Contend", price: 4499, category: "shoes", desc: "Gel cushioning with stability" },
  { id: "p5", name: "New Balance 520v8", price: 5499, category: "shoes", desc: "Premium daily trainer" },
  { id: "p6", name: "Nike Dri-FIT Tee", price: 1299, category: "apparel", desc: "Moisture-wicking running tee" },
  { id: "p7", name: "Adidas Track Pants", price: 2199, category: "apparel", desc: "Tapered training pants" },
  { id: "p8", name: "Puma Sports Cap", price: 599, category: "apparel", desc: "Lightweight running cap" },
];

export type Product = typeof PRODUCTS[number];
```

### `lib/agent.ts`

Core agent loop. Uses Anthropic tool use via `@anthropic-ai/sdk`. Async generator that yields events.

**Tools to define:**

1. `search_products(query: string, max_price?: number)` — filters PRODUCTS
2. `add_to_cart(product_id: string, qty?: number)` — looks up product
3. `checkout(cart: {product_id: string, qty: number}[])` — returns `{order_id, items, total, currency: "INR", payment_method: "MoltPe (test)", status: "confirmed"}`. Order ID format: `AGN-` + 6 random uppercase chars.

**Agent loop requirements:**

- Model: `claude-sonnet-4-5`
- Max 6 agent turns (hard ceiling)
- `max_tokens: 1024`
- System prompt (verbatim):

> "You are a shopping agent for an MCP-enabled D2C store. When a user tells you what to buy, search products, add the best match to cart, then call checkout. Use only product_ids returned by search_products — never invent IDs. Be decisive — pick the best match on first search, don't over-browse."

**Event shapes yielded:**

- `{ type: "event", text: string }` — for `[MCP]`, `[AGENT]`, `[CHECKOUT]` status lines
- `{ type: "order", order: {...} }` — when checkout tool fires
- `{ type: "agent_final", text: string }` — assistant's final text reply
- `{ type: "error", text: string }` — on any caught error

**Emit these specific status lines as events at appropriate moments:**

- On start: `[MCP] Connected to ${slug}-store`
- Parsing: `[AGENT] Parsing query: "${userQuery}"`
- On search tool call: `[AGENT] Searching: "${query}"` then `[AGENT] Found ${n} products`
- On add_to_cart: `[AGENT] Added: ${product.name} — ₹${subtotal}`
- On checkout start: `[CHECKOUT] Processing via MoltPe...`
- On checkout success: `[CHECKOUT] ✓ Order ${orderId} confirmed — ₹${total}`

**At end of successful run**, best-effort write to `agent_sessions` (don't block or throw on Supabase failure — log and continue).

### `lib/supabase.ts`

Server-side client only. Never import into client components.

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### `app/api/agent/route.ts`

SSE streaming endpoint. Headers:

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

- POST body: `{ query: string, slug: string }`
- For each event from `runAgent()`: `controller.enqueue(encoder.encode('data: ' + JSON.stringify(event) + '\n\n'))`
- End with `data: [DONE]\n\n`
- `export const maxDuration = 60; export const runtime = "nodejs";`

### `app/api/register/route.ts`

- POST body: `{ email, store_url, store_name }`
- Generate slug: `slugify(store_name).slice(0,40) + "-" + 4-char-random`
- Insert into `merchants`. On duplicate slug error, retry once with new suffix.
- Use `process.env.NEXT_PUBLIC_APP_URL` as base URL (fall back to `http://localhost:3000`).
- Return:

```json
{
  "slug": "fitkicks-a3x7",
  "mcp_url": "<APP_URL>/api/mcp/fitkicks-a3x7",
  "snippet": "<script src=\"<APP_URL>/v1.js\" data-store=\"fitkicks-a3x7\"></script>",
  "try_url": "<APP_URL>/try/fitkicks-a3x7"
}
```

### `app/api/mcp/[slug]/route.ts`

GET returns MCP-shaped JSON (theater — not real protocol):

```json
{
  "protocol": "mcp",
  "version": "2024-11-05",
  "store_slug": "<slug>",
  "tools": [
    { "name": "search_products", "description": "Search the merchant's catalog", "input_schema": { "type": "object", "properties": { "query": {"type": "string"}, "max_price": {"type": "number"} }, "required": ["query"] } },
    { "name": "add_to_cart", "description": "Add a product to cart", "input_schema": { "type": "object", "properties": { "product_id": {"type": "string"}, "qty": {"type": "number"} }, "required": ["product_id"] } },
    { "name": "checkout", "description": "Complete the purchase", "input_schema": { "type": "object", "properties": { "cart": {"type": "array"} }, "required": ["cart"] } }
  ]
}
```

### `app/layout.tsx`

Root HTML layout. Metadata:

- Title: "AgentCheckout — Agent-shoppable D2C stores in 10 minutes"
- Description: "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store."
- OpenGraph + Twitter card metadata (basic)

Just wraps `{children}` in html/body with default Next.js font. Nothing fancy.

### `app/page.tsx` — LANDING

Sections in order (single scroll, minimal):

1. **Nav** — "AgentCheckout" logo-text left, "Try the demo →" link right (goes to `/try/demo`)
2. **Hero** — two-line h1:
   - Line 1: "Make your D2C store"
   - Line 2: "agent-shoppable in 10 minutes."
   - Subhero: "One script tag. ChatGPT, Claude, and every AI agent can now discover your products and check out on your store."
3. **Signup form** — three inputs (store_name, store_url, email) + black submit button labeled "Make my store agent-shoppable →". On success, `router.push('/success/${slug}')`.
4. **Payment rail footer** — "Payments powered by:" with three text logos: **MoltPe** · Razorpay · Stripe (soon, greyed)
5. **"How it works" 3-column grid** — three cards:
   - **Discovery** — "Agents find your products by query, category, or price via a hosted MCP endpoint."
   - **Transaction** — "Agents add to cart and complete checkout through your existing payment processor."
   - **Zero Re-platform** — "Works with Shopify, WooCommerce, custom builds. One script tag. No migration."

Max-width 4xl container, `px-8 py-20`. Font stack default Tailwind sans.
Black button, white background, bordered `rounded-lg` inputs.

### `app/try/[slug]/page.tsx` — DEMO (the money shot)

1. Small text above: "Store: {slug}" (gray)
2. `<h1>` "Agent Shopper Demo"
3. White card: textarea prefilled `"Buy me running shoes under ₹4000"` + "▶ Run Agent" button
4. Black terminal panel below, `font-mono`, `text-green-400`, `min-h-[300px]`, rounded
5. Events stream into terminal panel line by line. Scrollbar pinned to bottom.
6. When `{type:"order"}` event arrives, render a green-bordered confirmation card below the trace with order ID, total, payment method, itemized list.

Button disabled while running. Show "Agent working..." text during stream.

**SSE consumption pattern:**

```typescript
const res = await fetch("/api/agent", { method: "POST", body: JSON.stringify({query, slug}) });
const reader = res.body!.getReader();
const decoder = new TextDecoder();
let buf = "";
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });
  const lines = buf.split("\n\n");
  buf = lines.pop() || "";
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const data = line.slice(6);
    if (data === "[DONE]") continue;
    try {
      const ev = JSON.parse(data);
      // handle ev
    } catch {}
  }
}
```

Button disabled while running. Show "Agent working..." text during stream.

### `app/success/[slug]/page.tsx`

1. `<h1>` "✓ Your store is now agent-shoppable."
2. Subhead: "Here's everything you need."
3. Three numbered blocks:
   - **1. Your MCP Endpoint** — monospace `<code>` block with `mcp_url`, copy button
   - **2. Integration Snippet** — monospace `<code>` block with `snippet`, copy button, helper text "Paste into your site's `<head>` — takes 30 seconds."
   - **3. Try It** — black button "Watch the agent shop on your store →" linking to `/try/[slug]`

Copy buttons use `navigator.clipboard.writeText()`. Show "Copied!" for 2 sec on click.

---

## EXECUTION PHASES

### PHASE 0 — 5 min — Setup (silent, don't ask user except for keys)

- Verify Node 18+, npm, git, gh, vercel
- Next.js scaffold + install deps
- Supabase setup (auto via MCP if possible, else ask user to do it manually)
- Git init, initial commit, push to GitHub

### PHASE 1 — 60 min — Core Build (linear, single Claude Code session, no sub-agents)

Build all 10 files in this order:

1. `lib/products.ts` (2 min)
2. `lib/supabase.ts` (2 min)
3. `lib/agent.ts` (15 min — most important file, write carefully)
4. `app/api/agent/route.ts` (5 min)
5. `app/api/register/route.ts` (5 min)
6. `app/api/mcp/[slug]/route.ts` (3 min)
7. `app/layout.tsx` (3 min)
8. `app/page.tsx` (10 min)
9. `app/success/[slug]/page.tsx` (5 min)
10. `app/try/[slug]/page.tsx` (10 min)

After every 3 files, run `npm run build` to catch TS errors early. Fix, move on.

### PHASE 1.5 — 5 min — Local Smoke Test

```bash
npm run dev
```

Open `localhost:3000`:
- Submit a test store ("TestStore", "https://test.example.com", "test@x.com")
- Verify redirect to `/success/*`
- Click through to `/try/*`
- Click "Run Agent"
- Verify trace streams, order confirms
- If any step fails, fix and retry. Max 2 retries. If still broken, simplify — cut the order confirmation card, ship with just the trace.

### PHASE 2 — 10 min — Deploy

```bash
vercel --prod
```

Use defaults, link to UG's Vercel account. Add env vars in Vercel dashboard (paste from `.env.local`). Re-deploy. Tell user:

> "Phase 2 starting — deploying. What domain should I attach? (Paste the domain you bought, e.g. `agentcheckout.xyz`)"

After user provides domain, attach via `vercel domains add <domain>` + `vercel alias`. Update `NEXT_PUBLIC_APP_URL` env var to the domain. Re-deploy.

Smoke test on live URL.

### PHASE 3 — 15 min — Parallel Polish via Sub-Agents

At ~1:45 PM, dispatch **two sub-agents in parallel**. Both Sonnet 4.6. Give each a ~100-word task spec.

**Sub-agent A (Sonnet 4.6) — Landing page polish:**

> "Read `app/page.tsx`. Improve: (1) hero typography — make 'agent-shoppable' visually stand out via font weight, underline, or subtle color. (2) Add one testimonial-style quote below hero: *'D2C founders are panicking about agentic commerce. This is the fastest path to agent-readiness.'* — attributed to 'Senior payments engineer, Bangalore'. (3) Ensure page looks okay at min-width 900px. Do NOT add components, libraries, or new files. Do NOT change form logic. Commit as 'polish: landing'."

**Sub-agent B (Sonnet 4.6) — OG image + meta + favicon:**

> "Create `app/opengraph-image.tsx` using Next.js ImageResponse API. Text: 'AgentCheckout' in large white font, subtext 'Your D2C store, agent-shoppable.' on black background. Create `app/icon.tsx` for favicon (simple 'A' on black). Update `app/layout.tsx` metadata with openGraph object pointing to the new image. Do NOT modify other files. Commit as 'polish: og'."

While sub-agents run, MAIN session: wait for their reports, then merge commits and re-deploy.

### PHASE 4 — Code Freeze at 2:30 PM

```bash
vercel --prod
git tag buildathon-submission && git push --tags
```

Write a minimal README.md with:
- What it is (one paragraph from the top of this file)
- Stack
- Live URL
- Tagline: "Built at OpenCode Buildathon 2026 — 4 hours, from scratch, with Claude Code."

**STOP TOUCHING CODE. Everything after this point is traction.**

---

## COMMUNICATION PROTOCOL

- **Report every phase completion** in one sentence. Example: *"Phase 1 complete: 11 files, `npm run build` clean, committed."*
- **Report every error** immediately with the error text and your proposed fix. Don't silently retry 5+ times.
- **Do NOT narrate every file write.** Batch reports.
- **At every 15-minute wall clock interval** (1:10, 1:25, 1:40, 1:55, 2:10, 2:25), drop a one-line status:
  `[TIME CHECK 1:25 — on track, finishing agent loop]`

---

## KNOWN GOTCHAS

- **Supabase JS client isn't a full Promise** — use `await` + `try/catch`, not `.catch()` chaining.
- **Don't use `document` or `window` in server components** — anything using them needs `"use client"` at the top.
- **Anthropic SDK tool results**: `content` field must be stringified JSON.
- **SSE in Next.js App Router** — use `ReadableStream` + `TextEncoder`. Do NOT use `res.write` — that's pages-router syntax.
- **Next.js App Router route precedence** — specific routes before dynamic. We only have dynamic routes, so no conflict here, just noting.
- **Vercel env vars** — always redeploy after changing env vars; they don't hot-reload.
- **Tool use loop** — the Anthropic SDK expects `role: "assistant"` turn to include the full content array (including `tool_use` blocks), then a `role: "user"` turn with `tool_result` blocks. Follow this pattern strictly.

---

## WHAT SUCCESS LOOKS LIKE

**By 2:30 PM:**

- `https://<domain>` is live (domain user provides after scaffolding)
- A merchant can submit their store, see endpoint + snippet on success page
- Anyone can visit `/try/demo`, click Run Agent, watch Claude shop a real catalog, see a fake order confirmation
- Vercel Analytics is logging page views (default behavior)
- GitHub repo shows 15–25 commits, all timestamps after ~1:00 PM
- UG can screenshot: Supabase rows, a live agent run, the deployed URL

**By 3:45 PM (submission):**

- 3+ merchants from UG's network have signed the waitlist OR committed to an LOI
- X post is up with engagement
- UG submits the form with live URL, repo link, Vercel Analytics screenshot, LOI evidence if available

---

## WHEN IN DOUBT

Ask yourself: *"Will this be visible in the 3-minute demo?"*
If no → skip it. Ship ugly.

If yes and it would take more than 5 minutes → ship without it, flag it for UG's
"what's next" slide.

---

## LAUNCH CHECKLIST BEFORE STARTING

Before running `npm install` or creating any file, confirm:

- [ ] `.env.local` has `ANTHROPIC_API_KEY` set
- [ ] `gh auth status` shows authenticated
- [ ] `vercel whoami` returns UG's account
- [ ] Node 18+ installed

If any of these fail, STOP and ask UG.

---

**END OF SPEC. BEGIN PHASE 0 NOW.**
