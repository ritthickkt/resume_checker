"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/animations.module.css";

const MESSAGES = [
  "Scanning your resume…",
  "Checking runway conditions…",
  "Verifying passenger details…",
  "Running ATS simulation…",
  "Checking keywords and formatting…",
  "Preparing your boarding pass…",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 250);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        gap: "2rem",
      }}
    >
      {/* Radar spinner */}
      <div
        style={{
          position: "relative",
          width: 160,
          height: 160,
        }}
      >
        {/* Sweep */}
        <div className={styles.radarSweep} />

        {/* Rings */}
        {[1, 0.65, 0.33].map((scale, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              inset: 0,
              margin: "auto",
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              top: `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
            }}
          />
        ))}

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#FFFFFF",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 8px #FFFFFF",
          }}
        />

        {/* Tick marks */}
        {[0, 45, 90, 135].map((deg) => (
          <div
            key={deg}
            style={{
              position: "absolute",
              width: 2,
              height: 10,
              background: "rgba(255,255,255,0.35)",
              top: "50%",
              left: "50%",
              transformOrigin: "top center",
              transform: `rotate(${deg}deg) translateX(-1px)`,
              marginTop: -80,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <div style={{ textAlign: "center" }}>
        <p
          key={msgIndex}
          className={styles.fadeIn}
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "0.04em",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.25s ease",
            minHeight: "1.8rem",
          }}
        >
          {MESSAGES[msgIndex]}
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#737373",
            marginTop: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Stand by — checking runway conditions
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i <= msgIndex ? "#FFFFFF" : "rgba(255,255,255,0.18)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
