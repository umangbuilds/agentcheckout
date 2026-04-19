/* POST /api/register — creates merchant, returns slug + URLs */

import { getSupabaseAdmin } from "@/lib/supabase";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function randomSuffix(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function POST(request: Request) {
  try {
    const { email, store_url, store_name } = await request.json();

    if (!email || !store_url || !store_name) {
      return Response.json(
        { error: "email, store_url, and store_name are required" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(store_name).slice(0, 40);
    let slug = `${baseSlug}-${randomSuffix()}`;

    // Insert merchant — retry once on duplicate slug
    let { error } = await getSupabaseAdmin()
      .from("merchants")
      .insert({ slug, email, store_url, store_name });

    if (error?.code === "23505") {
      slug = `${baseSlug}-${randomSuffix()}`;
      const retry = await getSupabaseAdmin()
        .from("merchants")
        .insert({ slug, email, store_url, store_name });
      error = retry.error;
    }

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return Response.json({
      slug,
      mcp_url: `${baseUrl}/api/mcp/${slug}`,
      snippet: `<script src="${baseUrl}/v1.js" data-store="${slug}"></script>`,
      try_url: `${baseUrl}/try/${slug}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
