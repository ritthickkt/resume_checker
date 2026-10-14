"use client";

import { useState } from "react";
import DepartureBoard from "@/components/DepartureBoard";
import KeywordManifest from "@/components/KeywordManifest";
import type { ScanRecord } from "@/lib/supabase/scans";

interface ScanHistoryProps {
  scans: ScanRecord[];
}

function flightCode(role: string): string {
  const initials = role
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return `${initials || "RWY"}-${new Date().getFullYear()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ScanHistory({ scans }: ScanHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (scans.length === 0) {
    return (
      <div
        style={{
          border: "1px dashed rgba(255,255,255,0.2)",
          borderRadius: 14,
          padding: "3rem 1.5rem",
          textAlign: "center",
          color: "#737373",
        }}
      >
        <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>No flights logged yet.</p>
        <p style={{ fontSize: "0.85rem" }}>
          Run a scan from the home page and it&apos;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {scans.map((scan) => {
        const expanded = expandedId === scan.id;
        return (
          <div
            key={scan.id}
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              background: "rgba(255,255,255,0.02)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setExpandedId(expanded ? null : scan.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'Courier New', 'Roboto Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "#8A8A8A",
                    flexShrink: 0,
                  }}
                >
                  {flightCode(scan.role)}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {scan.role} · {scan.company}
                  </p>
                  <p style={{ color: "#737373", fontSize: "0.78rem", marginTop: 2 }}>
                    {formatDate(scan.created_at)}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    color: "#FFFFFF",
                  }}
                >
                  {scan.ats_score}
                  <span style={{ fontSize: "0.7rem", color: "#737373", fontWeight: 500 }}>/100</span>
                </span>
                <span style={{ color: "#737373", fontSize: "0.9rem" }}>{expanded ? "▲" : "▼"}</span>
              </div>
            </button>

            {expanded && (
              <div style={{ padding: "0 1.25rem 1.5rem" }}>
                <DepartureBoard checks={scan.checks} animate />
                <KeywordManifest
                  matched={scan.matched_keywords}
                  missing={scan.missing_keywords}
                  revealed
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
