/* Core agent loop — Claude tool-use via Anthropic SDK, yields SSE events */

import Anthropic from "@anthropic-ai/sdk";
import { PRODUCTS } from "./products";
import { getSupabaseAdmin } from "./supabase";

// -- Event types yielded by the agent generator --

export type AgentEvent =
  | { type: "event"; text: string }
  | { type: "order"; order: OrderResult }
  | { type: "agent_final"; text: string }
  | { type: "error"; text: string };

interface OrderResult {
  order_id: string;
  items: { product_id: string; name: string; price: number; qty: number }[];
  total: number;
  currency: string;
  payment_method: string;
  status: string;
}

// -- Tool definitions for the Anthropic API --

const tools: Anthropic.Tool[] = [
  {
    name: "search_products",
    description: "Search the merchant's catalog by query string and optional max price",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search term (name, category, or keyword)" },
        max_price: { type: "number", description: "Maximum price filter in INR" },
      },
      required: ["query"],
    },
  },
  {
    name: "add_to_cart",
    description: "Add a product to the shopping cart by product_id",
    input_schema: {
      type: "object" as const,
      properties: {
        product_id: { type: "string", description: "The product ID to add" },
        qty: { type: "number", description: "Quantity (default 1)" },
      },
      required: ["product_id"],
    },
  },
  {
    name: "checkout",
    description: "Complete the purchase with the current cart contents",
    input_schema: {
      type: "object" as const,
      properties: {
        cart: {
          type: "array",
          items: {
            type: "object",
            properties: {
              product_id: { type: "string" },
              qty: { type: "number" },
            },
            required: ["product_id", "qty"],
          },
          description: "Array of cart items with product_id and qty",
        },
      },
      required: ["cart"],
    },
  },
];

// -- Tool execution handlers --

function handleSearchProducts(input: { query: string; max_price?: number }): string {
  const queryWords = input.query.toLowerCase().split(/\s+/);
  let results = PRODUCTS.filter((p) => {
    const haystack = `${p.name} ${p.category} ${p.desc}`.toLowerCase();
    return queryWords.some((word) => haystack.includes(word));
  });
  if (input.max_price) {
    results = results.filter((p) => p.price <= input.max_price!);
  }
  return JSON.stringify(results);
}

function handleAddToCart(input: { product_id: string; qty?: number }): string {
  const product = PRODUCTS.find((p) => p.id === input.product_id);
  if (!product) {
    return JSON.stringify({ error: "Product not found" });
  }
  const qty = input.qty || 1;
  return JSON.stringify({
    product_id: product.id,
    name: product.name,
    price: product.price,
    qty,
    subtotal: product.price * qty,
  });
}

function handleCheckout(input: { cart: { product_id: string; qty: number }[] }): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  const orderId = `AGN-${suffix}`;

  const items = input.cart.map((ci) => {
    const product = PRODUCTS.find((p) => p.id === ci.product_id);
    return {
      product_id: ci.product_id,
      name: product?.name || "Unknown",
      price: product?.price || 0,
      qty: ci.qty,
    };
  });

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order: OrderResult = {
    order_id: orderId,
    items,
    total,
    currency: "INR",
    payment_method: "MoltPe (test)",
    status: "confirmed",
  };

  return JSON.stringify(order);
}

function executeTool(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case "search_products":
      return handleSearchProducts(input as { query: string; max_price?: number });
    case "add_to_cart":
      return handleAddToCart(input as { product_id: string; qty?: number });
    case "checkout":
      return handleCheckout(input as { cart: { product_id: string; qty: number }[] });
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// -- Main agent generator --

export async function* runAgent(
  userQuery: string,
  slug: string
): AsyncGenerator<AgentEvent> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const maxTurns = 6;

  yield { type: "event", text: `[MCP] Connected to ${slug}-store` };
  yield { type: "event", text: `[AGENT] Parsing query: "${userQuery}"` };

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userQuery },
  ];

  let orderResult: OrderResult | null = null;

  try {
    for (let turn = 0; turn < maxTurns; turn++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system:
          "You are a shopping agent for an MCP-enabled D2C store. When a user tells you what to buy, search products, add the best match to cart, then call checkout. Use only product_ids returned by search_products — never invent IDs. Be decisive — pick the best match on first search, don't over-browse.",
        tools,
        messages,
      });

      // Check if assistant wants to use tools
      const hasToolUse = response.content.some((block) => block.type === "tool_use");

      if (!hasToolUse) {
        // Final text response — agent is done
        const textBlock = response.content.find((block) => block.type === "text");
        if (textBlock && textBlock.type === "text") {
          yield { type: "agent_final", text: textBlock.text };
        }
        break;
      }

      // Process tool calls
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        const toolName = block.name;
        const toolInput = block.input as Record<string, unknown>;

        // Emit status events based on tool being called
        if (toolName === "search_products") {
          yield {
            type: "event",
            text: `[AGENT] Searching: "${toolInput.query}"${toolInput.max_price ? ` (max ₹${toolInput.max_price})` : ""}`,
          };
          const result = executeTool(toolName, toolInput);
          const parsed = JSON.parse(result);
          yield { type: "event", text: `[AGENT] Found ${parsed.length} products` };
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        } else if (toolName === "add_to_cart") {
          const result = executeTool(toolName, toolInput);
          const parsed = JSON.parse(result);
          if (parsed.error) {
            yield { type: "event", text: `[AGENT] Error: ${parsed.error}` };
          } else {
            yield {
              type: "event",
              text: `[AGENT] Added: ${parsed.name} — ₹${parsed.subtotal}`,
            };
          }
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        } else if (toolName === "checkout") {
          yield { type: "event", text: "[CHECKOUT] Processing via MoltPe..." };
          const result = executeTool(toolName, toolInput);
          const order = JSON.parse(result) as OrderResult;
          orderResult = order;
          yield {
            type: "event",
            text: `[CHECKOUT] ✓ Order ${order.order_id} confirmed — ₹${order.total}`,
          };
          yield { type: "order", order };
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        } else {
          const result = executeTool(toolName, toolInput);
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        }
      }

      // Add assistant turn + tool results to conversation
      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });
    }

    // Best-effort write to agent_sessions — don't block or throw
    try {
      await getSupabaseAdmin().from("agent_sessions").insert({
        merchant_slug: slug,
        query: userQuery,
        events: messages,
        order_id: orderResult?.order_id || null,
        order_total: orderResult?.total || null,
      });
    } catch (dbError) {
      console.error("Failed to write agent session:", dbError);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    yield { type: "error", text: `Agent error: ${message}` };
  }
}
