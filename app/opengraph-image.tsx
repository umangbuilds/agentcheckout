/* OG image — premium white with gradient accent, matches site style */

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
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Subtle gradient accent in top-right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle at top right, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "60px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "black",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "24px", fontWeight: 700 }}>
              A
            </span>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 600, color: "#0a0a0a", letterSpacing: "-0.5px" }}>
            AgentCheckout
          </span>
        </div>

        {/* Main text */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#0a0a0a",
            letterSpacing: "-2.5px",
            lineHeight: 1.1,
            maxWidth: "800px",
          }}
        >
          Make your store agent-shoppable in 10 minutes
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#6b7280",
            marginTop: "24px",
            maxWidth: "600px",
            lineHeight: 1.4,
          }}
        >
          One integration. Every AI agent can discover and checkout on your store.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "16px",
            color: "#9ca3af",
          }}
        >
          <span>agentcheckout.app</span>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <span>MCP Protocol</span>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <span>Built at OpenCode Buildathon 2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
