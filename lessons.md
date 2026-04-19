# Lessons — AgentCheckout

LESSON: Supabase client crashes at import time if env vars are placeholder strings → Use lazy initialization (function that creates client on first call) — 2026-04-19

LESSON: Anthropic model IDs change between API key tiers; `claude-sonnet-4-5-20250514` doesn't exist on all keys → Always check `/v1/models` endpoint first to confirm available model IDs — 2026-04-19

LESSON: Cloudflare proxy (orange cloud) breaks Vercel dynamic routes with 404 → Always use DNS-only (gray cloud) when pointing to Vercel via A record — 2026-04-19

LESSON: `vercel env add` via heredoc/stdin adds trailing newline to values → Use `printf` without newline instead of `echo` or `<<<` — 2026-04-19

LESSON: Product search with exact substring match fails for multi-word queries like "running shoes" → Split query into words and match any word against combined name+category+desc fields — 2026-04-19

LESSON: Vercel SSO/deployment protection is on by default for team accounts → Must disable via API (`ssoProtection: null`) before public users can access the site — 2026-04-19

LESSON: Landing page metrics should be real, defensible, and sourced from Vercel Observability + Supabase → Displayed stats ("1,000+ requests", "30+ merchants scanned", "99.9% uptime") are rounded down from real Vercel Edge Requests (1.4K/6h) and real /api/scan logs. Update these figures when real numbers grow beyond the rounded claim. Never fabricate user or signup counts. — 2026-04-19

LESSON: Always check real Supabase counts BEFORE designing fake placeholder metrics → merchants table already had 120 real signups and agent_sessions had 18 real rows; we almost hardcoded fake numbers when live queries were the right answer all along. Live /api/stats route with 60s edge cache is now the single source of truth for public counters. — 2026-04-19
