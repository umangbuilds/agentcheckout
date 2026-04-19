/* OG image — generated via Next.js ImageResponse API */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AgentCheckout — Agent-shoppable D2C stores in 10 minutes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: "20px",
          }}
        >
          AgentCheckout
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Your D2C store, agent-shoppable.
        </div>
      </div>
    ),
    { ...size }
  );
}
