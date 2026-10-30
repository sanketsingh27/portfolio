import { ImageResponse } from "next/og";
export const alt =
  "Sanket Singh — full-stack engineer building products worth shipping";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#15140f",
        color: "#f2efe5",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 30, color: "#edca67" }}>
        SANKET SINGH · FULL-STACK ENGINEER
      </div>
      <div
        style={{
          fontSize: 100,
          fontWeight: 700,
          display: "flex",
          flexDirection: "column",
        }}
      >
        I build products.
        <br />
        And I ship them.
      </div>
      <div style={{ fontSize: 32 }}>
        Backend systems. Generative AI. Available to join immediately.
      </div>
    </div>,
    size,
  );
}
