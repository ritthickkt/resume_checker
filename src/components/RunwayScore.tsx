"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/animations.module.css";

interface RunwayScoreProps {
  score: number;
  animate: boolean;
}

export default function RunwayScore({ score, animate }: RunwayScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [fillWidth, setFillWidth] = useState(0);
  const lightsTopRef = useRef<HTMLDivElement>(null);
  const lightsBottomRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Generate edge lights
  useEffect(() => {
    [lightsTopRef, lightsBottomRef].forEach((ref) => {
      if (!ref.current) return;
      ref.current.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        const span = document.createElement("span");
        span.className = styles.rlight;
        span.style.animationDelay = `${i * 0.15}s`;
        ref.current.appendChild(span);
      }
    });
  }, []);

  // Animate fill + counter
  useEffect(() => {
    if (!animate) return;

    // Slight delay to let CSS transition register
    const delay = setTimeout(() => {
      setFillWidth(score);
    }, 50);

    const duration = 1800;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, score]);

  const scoreColor = "#FFFFFF";

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto 0", padding: "0 0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#737373",
          }}
        >
          ATS Runway Score
        </span>
        <div>
          <span
            style={{
              fontSize: "2.75rem",
              fontWeight: 900,
              color: scoreColor,
              lineHeight: 1,
              transition: "color 0.3s ease",
            }}
          >
            {displayScore}
          </span>
          <span style={{ fontSize: "1rem", color: "#737373", marginLeft: "0.25rem" }}>
            / 100
          </span>
        </div>
      </div>

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={displayScore}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          position: "relative",
          height: 48,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "visible",
        }}
      >
        {/* Top edge lights */}
        <div
          ref={lightsTopRef}
          style={{
            position: "absolute",
            top: -10,
            left: 8,
            right: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Fill bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fillWidth}%`,
            background: `linear-gradient(90deg, ${scoreColor} 0%, ${scoreColor}dd 100%)`,
            borderRadius: 10,
            transition: "width 1.8s cubic-bezier(0.22,1,0.36,1)",
            minWidth: fillWidth > 0 ? 48 : 0,
            boxShadow: `0 0 16px ${scoreColor}66`,
          }}
        >
          {/* Runway centerline dashes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 10px, rgba(0,0,0,0.25) 10px, rgba(0,0,0,0.25) 20px, rgba(0,0,0,0) 20px, rgba(0,0,0,0) 30px)",
              borderRadius: 10,
            }}
          />

          {/* Plane icon at tip */}
          {fillWidth > 0 && (
            <div
              style={{
                position: "absolute",
                right: -18,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1.5rem",
                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7))",
                zIndex: 3,
                transition: "all 0.3s ease",
              }}
            >
              ✈
            </div>
          )}
        </div>

        {/* Bottom edge lights */}
        <div
          ref={lightsBottomRef}
          style={{
            position: "absolute",
            bottom: -10,
            left: 8,
            right: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Score label below */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.25rem",
          fontSize: "0.72rem",
          color: "#737373",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>Needs Work</span>
        <span style={{ color: scoreColor }}>
          {score >= 85 ? "✓ Excellent" : score >= 70 ? "Good" : "Improve"}
        </span>
        <span>Cleared</span>
      </div>
    </div>
  );
}
