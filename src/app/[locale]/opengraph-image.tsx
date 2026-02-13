import { ImageResponse } from "next/og";

export const alt = "FIECON — Internationale Beratung";
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
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #62191C 0%, #873632 50%, #9E7161 100%)",
          fontFamily: "sans-serif",
          color: "#FFFFFF",
          padding: "60px 80px",
        }}
      >
        {/* Decorative top border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #E0CFC2, #CAAE9F, #9E7161)",
            display: "flex",
          }}
        />

        {/* Company name */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 700,
            letterSpacing: "12px",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          FIECON
        </div>

        {/* Divider line */}
        <div
          style={{
            width: "120px",
            height: "2px",
            background: "#CAAE9F",
            marginBottom: "24px",
            display: "flex",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#E0CFC2",
            textAlign: "center",
            display: "flex",
          }}
        >
          International Consulting Industries
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 400,
            color: "#CAAE9F",
            marginTop: "20px",
            display: "flex",
          }}
        >
          Hamburg · Belgrade · Texas
        </div>

        {/* Bottom border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #9E7161, #CAAE9F, #E0CFC2)",
            display: "flex",
          }}
        />

        {/* URL in corner */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "40px",
            fontSize: "16px",
            color: "#CAAE9F",
            display: "flex",
          }}
        >
          www.fiecon-consulting.eu
        </div>
      </div>
    ),
    { ...size },
  );
}
