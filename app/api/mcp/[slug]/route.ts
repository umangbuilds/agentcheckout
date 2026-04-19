/* GET /api/mcp/[slug] — returns MCP-shaped JSON manifest (theater) */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const manifest = {
    protocol: "mcp",
    version: "2024-11-05",
    store_slug: slug,
    tools: [
      {
        name: "search_products",
        description: "Search the merchant's catalog",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            max_price: { type: "number" },
          },
          required: ["query"],
        },
      },
      {
        name: "add_to_cart",
        description: "Add a product to cart",
        input_schema: {
          type: "object",
          properties: {
            product_id: { type: "string" },
            qty: { type: "number" },
          },
          required: ["product_id"],
        },
      },
      {
        name: "checkout",
        description: "Complete the purchase",
        input_schema: {
          type: "object",
          properties: {
            cart: { type: "array" },
          },
          required: ["cart"],
        },
      },
    ],
  };

  return Response.json(manifest);
}
