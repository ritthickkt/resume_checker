"use client";

import Link from "next/link";

interface KeywordManifestProps {
  matched: string[];
  missing: string[];
  revealed: boolean;
  locked?: boolean;
}

export default function KeywordManifest({ matched, missing, revealed, locked = false }: KeywordManifestProps) {
  if (matched.length === 0 && missing.length === 0) return null;

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "2rem auto 0",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "'Courier New', 'Roboto Mono', monospace",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#111",
          padding: "0.875rem 1.5rem",
          borderBottom: "1px solid #222",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          🧳 Baggage Check — Keywords for This Posting
        </span>
      </div>

      <div
        style={{
          background: "#0D0D0D",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          filter: locked ? "blur(4px)" : "none",
          opacity: locked ? 0.6 : 1,
          pointerEvents: locked ? "none" : "auto",
          userSelect: locked ? "none" : "auto",
        }}>
        {missing.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8A8A8A",
                marginBottom: "0.6rem",
              }}
            >
              Missing from your resume
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {missing.map((kw) => (
                <span
                  key={kw}
                  style={{
                    background: "#FFFFFF",
                    color: "#000000",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "0.3rem 0.7rem",
                    borderRadius: 4,
                  }}
                >
                  ✕ {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {matched.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8A8A8A",
                marginBottom: "0.6rem",
              }}
            >
              On board
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {matched.map((kw) => (
                <span
                  key={kw}
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#D4D4D4",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                    padding: "0.3rem 0.7rem",
                    borderRadius: 4,
                  }}
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {locked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            background: "rgba(0,0,0,0.55)",
            padding: "1rem",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "#D4D4D4", textAlign: "center", fontFamily: "inherit" }}>
            🔒 {missing.length} missing keyword{missing.length !== 1 ? "s" : ""} for this posting — unlock to see them
          </span>
          <Link
            href="/pricing"
            style={{
              background: "#FFFFFF",
              color: "#000000",
              fontWeight: 800,
              fontSize: "0.8rem",
              borderRadius: 8,
              padding: "0.6rem 1.1rem",
              textDecoration: "none",
              fontFamily: "var(--font-space-grotesk), sans-serif",
            }}
          >
            Unlock Keyword Match →
          </Link>
        </div>
      )}
    </div>
  );
}
