import { ImageResponse } from "next/og";
import { site } from "@/lib/data/site";

export const alt = "Arun Neupane (arundada9000) - Frontend Developer & CTO from Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0e15",
          color: "#e9e4d8",
          padding: "56px 64px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,180,84,0.18) 0%, rgba(10,14,21,0) 70%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff7a2f" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ffb454" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#2a364f" }} />
            <span style={{ marginLeft: 12, fontSize: 22, color: "#8d97a9" }}>
              <span style={{ color: "#ffb454" }}>arun@butwal</span>:~$ whoami
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 18,
              color: "#ffb454",
              background: "rgba(255,180,84,0.12)",
              border: "1px solid rgba(255,180,84,0.3)",
              padding: "6px 16px",
              borderRadius: 20,
            }}
          >
            ● Available for work · Butwal, Nepal
          </div>
        </div>

        {/* Center: Hero Identity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ fontSize: 88, fontWeight: 900, letterSpacing: -3, lineHeight: 1, color: "#ffffff" }}>
              ARUN
            </span>
            <span style={{ fontSize: 88, fontWeight: 900, letterSpacing: -3, lineHeight: 1, color: "#ffb454" }}>
              NEUPANE
            </span>
          </div>
          <div style={{ fontSize: 28, color: "#8d97a9", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#ff7a2f" }}>&gt;</span>
            <span>Frontend Developer · CTO @ Sajilo Digital</span>
          </div>
        </div>

        {/* Bottom stats & tags bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {["React 19", "Next.js 16", "TypeScript", "Tailwind v4", "PostGIS"].map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: 16,
                  color: "#8d97a9",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "6px 14px",
                  borderRadius: 10,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 18, color: "#8d97a9" }}>
            <span>70+ repos</span>
            <span>·</span>
            <span>3 production systems</span>
            <span>·</span>
            <span style={{ color: "#ffb454" }}>arundada9000</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
