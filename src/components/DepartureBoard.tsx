"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "@/styles/animations.module.css";

export type CheckStatus = "cleared" | "pending" | "flagged";

export interface AtsCheck {
  name: string;
  status: CheckStatus;
  detail?: string;
  rewriteSuggestion?: string | null;
}

interface DepartureBoardProps {
  checks: AtsCheck[];
  animate: boolean;
  /** When true, only the top issues are shown in full; the rest are blurred behind an upsell CTA. */
  locked?: boolean;
  /** How many checkpoints to leave unlocked when `locked` is true. */
  freeCount?: number;
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; color: string; bg: string }> = {
  cleared: { label: "CLEARED", color: "#FFFFFF", bg: "rgba(255,255,255,0.1)" },
  pending: { label: "PENDING", color: "#8A8A8A", bg: "rgba(255,255,255,0.05)" },
  flagged: { label: "FLAGGED", color: "#000000", bg: "#FFFFFF" },
};

const STATUS_PRIORITY: Record<CheckStatus, number> = { flagged: 0, pending: 1, cleared: 2 };

export default function DepartureBoard({ checks, animate, locked = false, freeCount = 3 }: DepartureBoardProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!animate) return;
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      setTimeout(() => {
        row.classList.add(styles.dbRowVisible);
      }, i * 220);
    });
  }, [animate]);

  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const orderedByPriority = locked
    ? [...checks].sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status])
    : checks;
  const visibleChecks = locked ? orderedByPriority.slice(0, freeCount) : checks;
  const hiddenChecks = locked ? orderedByPriority.slice(freeCount) : [];

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "2rem auto 0",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "'Courier New', 'Roboto Mono', monospace",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Board header */}
      <div
        style={{
          background: "#111",
          padding: "0.875rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          ✈ Departures — ATS Report
        </span>
        <span style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
          {now} LOCAL
        </span>
      </div>

      {/* Column headers */}
      <div
        style={{
          background: "#0a0a0a",
          padding: "0.4rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <span style={{ color: "#333", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Check
        </span>
        <span style={{ color: "#333", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Status
        </span>
      </div>

      {/* Rows */}
      {visibleChecks.map((check, i) => {
        const config = STATUS_CONFIG[check.status];
        return (
          <div
            key={check.name}
            ref={(el) => { rowRefs.current[i] = el; }}
            className={styles.dbRow}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.8rem 1.5rem",
              borderBottom: i < visibleChecks.length - 1 || hiddenChecks.length > 0 ? "1px solid #111" : "none",
              background: i % 2 === 0 ? "#0D0D0D" : "#0a0a0a",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#D4D4D4",
                }}
              >
                {check.name}
              </span>
              {check.detail && (
                <span style={{ fontSize: "0.7rem", color: "#737373", letterSpacing: "0.05em" }}>
                  {check.detail}
                </span>
              )}
              {check.rewriteSuggestion && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#D4D4D4",
                    letterSpacing: "0.02em",
                    marginTop: 2,
                    fontStyle: "italic",
                  }}
                >
                  ✎ {check.rewriteSuggestion}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                padding: "0.25rem 0.75rem",
                borderRadius: 4,
                color: config.color,
                background: config.bg,
                flexShrink: 0,
                border: `1px solid ${config.color === "#000000" ? "#FFFFFF" : `${config.color}33`}`,
              }}
            >
              {config.label}
            </span>
          </div>
        );
      })}

      {/* Locked rows */}
      {hiddenChecks.length > 0 && (
        <div style={{ position: "relative" }}>
          <div style={{ filter: "blur(4px)", opacity: 0.6, pointerEvents: "none", userSelect: "none" }}>
            {hiddenChecks.map((check, i) => {
              const config = STATUS_CONFIG[check.status];
              return (
                <div
                  key={check.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.8rem 1.5rem",
                    borderBottom: i < hiddenChecks.length - 1 ? "1px solid #111" : "none",
                    background: i % 2 === 0 ? "#0D0D0D" : "#0a0a0a",
                    gap: "1rem",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4D4D4" }}>
                    {check.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      padding: "0.25rem 0.75rem",
                      borderRadius: 4,
                      color: config.color,
                      background: config.bg,
                      flexShrink: 0,
                    }}
                  >
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 40%)",
              padding: "1rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#D4D4D4", textAlign: "center" }}>
              🔒 {hiddenChecks.length} more checkpoint{hiddenChecks.length > 1 ? "s" : ""} in the full report
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
              }}
            >
              Unlock Full Breakdown →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
