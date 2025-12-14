import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Sist - Agent Deployment Playground";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const geistFont = await readFile(
    join(process.cwd(), "src/assets/Geist-SemiBold.otf"),
  );
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        position: "relative",
      }}
    >
      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
              linear-gradient(to right, rgba(212, 175, 55, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
          display: "flex",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 700,
            background: "linear-gradient(to right, #d4af37, #f4e4c1)",
            backgroundClip: "text",
            color: "transparent",
            margin: 0,
            padding: 0,
            letterSpacing: "-0.05em",
          }}
        >
          Sist.
        </h1>
        <p
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.7)",
            margin: "20px 0 0 0",
            padding: 0,
            letterSpacing: "-0.025em",
          }}
        >
          Agent Deployment Playground
        </p>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistFont,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
