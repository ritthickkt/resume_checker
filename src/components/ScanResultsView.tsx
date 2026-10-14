"use client";

import type { RefObject } from "react";
import BoardingPass from "@/components/BoardingPass";
import DepartureBoard from "@/components/DepartureBoard";
import RunwayScore from "@/components/RunwayScore";
import ResultsCTA from "@/components/ResultsCTA";
import KeywordManifest from "@/components/KeywordManifest";
import UpgradeTeaser from "@/components/UpgradeTeaser";
import type { AnalysisResult } from "@/lib/analysis";

const FREE_CHECK_COUNT = 3;

function flightCode(role: string): string {
  const initials = role
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return `${initials || "RWY"}-${new Date().getFullYear()}`;
}

function seatFor(score: number): string {
  if (score >= 85) return "1A";
  if (score >= 70) return "7B";
  return "21C";
}

interface ScanResultsViewProps {
  result: AnalysisResult;
  bpRevealed: boolean;
  dbAnimate: boolean;
  scoreAnimate: boolean;
  ctaRevealed: boolean;
  savedToAccount: boolean;
  resultsRef: RefObject<HTMLElement | null>;
}

export default function ScanResultsView({
  result,
  bpRevealed,
  dbAnimate,
  scoreAnimate,
  ctaRevealed,
  savedToAccount,
  resultsRef,
}: ScanResultsViewProps) {
  return (
    <main
      ref={resultsRef}
      style={{
        background: "#000000",
        minHeight: "100vh",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A3A3A3",
              marginBottom: "0.4rem",
            }}
          >
            ✈ Gate {result.atsScore} — Boarding Pass Issued
          </p>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Your ATS Results
          </h2>
          <p
            style={{
              color: "#737373",
              fontSize: "0.9rem",
              marginTop: "0.6rem",
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            {result.summary}
          </p>
        </div>

        <BoardingPass
          passenger={result.passenger}
          flight={flightCode(result.role)}
          gate={result.atsScore}
          seat={seatFor(result.atsScore)}
          role={result.role}
          company={result.company}
          atsScore={result.atsScore}
          revealed={bpRevealed}
        />

        <div style={{ marginTop: "2.5rem" }}>
          <RunwayScore score={result.atsScore} animate={scoreAnimate} />
        </div>

        <UpgradeTeaser
          score={result.atsScore}
          topIssues={[...result.checks]
            .filter((c) => c.status !== "cleared")
            .sort((a, b) => Number(a.status === "pending") - Number(b.status === "pending"))
            .map((c) => c.name)}
          revealed={scoreAnimate}
        />

        <DepartureBoard
          checks={result.checks}
          animate={dbAnimate}
          locked
          freeCount={FREE_CHECK_COUNT}
        />

        <KeywordManifest
          matched={result.matchedKeywords}
          missing={result.missingKeywords}
          revealed={ctaRevealed}
          locked
        />

        <ResultsCTA score={result.atsScore} revealed={ctaRevealed} />

        {savedToAccount && (
          <p
            style={{
              textAlign: "center",
              color: "#737373",
              fontSize: "0.8rem",
              marginTop: "1.25rem",
            }}
          >
            ✓ Saved to your flight log —{" "}
            <a href="/dashboard" style={{ color: "#D4D4D4", textDecoration: "underline" }}>
              view in Dashboard
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
