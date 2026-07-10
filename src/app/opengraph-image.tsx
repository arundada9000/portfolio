import { ImageResponse } from "next/og";

export const alt = "Arun Neupane - Frontend Developer";
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
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#8d97a9" }}>
          <span style={{ color: "#ffb454" }}>arun@butwal</span>:~$ whoami
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>ARUN</div>
          <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: "#ffb454" }}>
            NEUPANE
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8d97a9" }}>
          <span>frontend developer - react · next.js · typescript</span>
          <span style={{ color: "#ffb454" }}>butwal, nepal</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
