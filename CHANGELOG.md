# Changelog — AgentCheckout

## 2026-04-19 — Buildathon Day

### Phase 0 — Setup
- Next.js 16 scaffold with TypeScript + Tailwind
- Supabase project created, tables migrated, RLS disabled
- GitHub repo created (umangbuilds/agentcheckout)
- Environment variables configured

### Phase 1 — Core Build
- lib/products.ts — 8-item hardcoded catalog
- lib/supabase.ts — Lazy-init server-side client
- lib/agent.ts — Claude tool-use loop with 3 tools (search, cart, checkout)
- app/api/agent/route.ts — SSE streaming endpoint
- app/api/register/route.ts — Merchant signup
- app/api/mcp/[slug]/route.ts — MCP manifest (theater)
- app/layout.tsx — Root layout with OG metadata
- app/page.tsx — Landing page with signup form
- app/success/[slug]/page.tsx — Post-signup deliverables
- app/try/[slug]/page.tsx — Live agent demo

### Phase 1.5 — Smoke Test
- Fixed model ID (claude-sonnet-4-5-20250929)
- Improved search to use word-split matching
- Full end-to-end agent loop verified locally

### Phase 2 — Deploy
- Deployed to Vercel (US East)
- Custom domain: agentcheckout.app
- All env vars configured in Vercel
- SSO protection disabled for public access

### Phase 3 — Polish
- Premium white UI overhaul (Stripe aesthetic)
- Animated gradient hero text
- Typing terminal animation on landing page
- SVG icons for how-it-works cards
- Glow-on-hover card effects
- Stats strip below hero
- Testimonial section with avatar + stats sidebar
- Color-coded terminal lines in demo page
- Staggered fade-in animations across all pages
- OG image updated to white premium style
- Favicon generated via ImageResponse API

### Phase 4 — Code Freeze
- README.md with live URL and setup docs
- architecture.md documenting file map and key decisions
- Git tag: buildathon-submission
