/* GET /api/stats — real-time public metrics for the landing page.
   Pulls counts from Supabase (merchants = signups, agent_sessions = agent traffic).
   Cached at the edge for 60s so we don't hammer the DB on every page view.
   Falls back to safe rounded numbers if Supabase is unavailable. */

import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const revalidate = 60; // cache for 60 seconds

type StatsResponse = {
  signups: number;       // total merchants registered
  agent_sessions: number; // total agent interactions recorded
  uptime_pct: number;    // static for now — 99.9% from Vercel 0% error rate
  generated_at: string;
  source: "live" | "fallback";
};

// Fallback values — used only if Supabase query fails.
// These are rounded DOWN from real known values so claims stay defensible.
const FALLBACK: Omit<StatsResponse, "generated_at" | "source"> = {
  signups: 30,
  agent_sessions: 1000,
  uptime_pct: 99.9,
};

export async function GET() {
  const headers = {
    "Content-Type": "application/json",
    // Edge cache for 60s, allow stale for 5 min if origin is slow
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  };

  try {
    const supabase = getSupabaseAdmin();

    // Parallel count queries
    const [merchantsRes, sessionsRes] = await Promise.all([
      supabase.from("merchants").select("*", { count: "exact", head: true }),
      supabase.from("agent_sessions").select("*", { count: "exact", head: true }),
    ]);

    // If either query errored, fall back gracefully
    if (merchantsRes.error || sessionsRes.error) {
      return new Response(
        JSON.stringify({
          ...FALLBACK,
          generated_at: new Date().toISOString(),
          source: "fallback",
        } satisfies StatsResponse),
        { headers }
      );
    }

    const signups = merchantsRes.count ?? 0;
    const agentSessions = sessionsRes.count ?? 0;

    return new Response(
      JSON.stringify({
        signups,
        agent_sessions: agentSessions,
        uptime_pct: 99.9,
        generated_at: new Date().toISOString(),
        source: "live",
      } satisfies StatsResponse),
      { headers }
    );
  } catch {
    return new Response(
      JSON.stringify({
        ...FALLBACK,
        generated_at: new Date().toISOString(),
        source: "fallback",
      } satisfies StatsResponse),
      { headers }
    );
  }
}
