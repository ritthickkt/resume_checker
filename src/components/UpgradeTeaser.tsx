"use client";

import Link from "next/link";
import styles from "@/styles/animations.module.css";

interface UpgradeTeaserProps {
  score: number;
  topIssues: string[];
  revealed: boolean;
}

export default function UpgradeTeaser({ score, topIssues, revealed }: UpgradeTeaserProps) {
  if (topIssues.length === 0) return null;

  return (
    <div
      className={`${styles.ctaReveal} ${revealed ? styles.ctaRevealed : ""}`}
      style={{
        maxWidth: 720,
        margin: "1.75rem auto 0",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 14,
        padding: "1.25rem 1.5rem",
        background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <div style={{ flex: "1 1 320px" }}>
        <p
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: "0.35rem",
          }}
        >
          {score} — here&apos;s what&apos;s costing you points
        </p>
        <p style={{ fontSize: "0.82rem", color: "#A3A3A3", lineHeight: 1.5 }}>
          Full breakdown of {topIssues.slice(0, 3).join(", ")}
          {topIssues.length > 3 ? ", and more" : ""} is in the complete report.
        </p>
      </div>
      <Link
        href="/pricing"
        style={{
          flexShrink: 0,
          background: "#FFFFFF",
          color: "#000000",
          fontWeight: 800,
          fontSize: "0.85rem",
          borderRadius: 10,
          padding: "0.75rem 1.25rem",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        Unlock Full Report →
      </Link>
    </div>
  );
}
