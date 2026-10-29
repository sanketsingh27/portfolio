import { ImageResponse } from "next/og";
export const alt = "Sanket’s desktop — work, writing, and room to explore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f1eee5",
        color: "#302f29",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 30, color: "#b44e2d" }}>✳ PERSONAL OS / 01</div>
      <div style={{ fontSize: 100 }}>Sanket’s desktop.</div>
      <div style={{ fontSize: 32 }}>Work, writing, and room to explore.</div>
    </div>,
    size,
  );
}
