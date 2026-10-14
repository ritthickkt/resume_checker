"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyRunway from "@/components/WhyRunway";
import LoadingScreen from "@/components/LoadingScreen";
import ScanResultsView from "@/components/ScanResultsView";
import { useScanFlow } from "@/lib/useScanFlow";

interface ScannerProps {
  /** Show the marketing sections (how it works, why runway) below the upload kiosk. */
  showMarketing?: boolean;
}

export default function Scanner({ showMarketing = true }: ScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const {
    phase,
    result,
    error,
    savedToAccount,
    bpRevealed,
    dbAnimate,
    scoreAnimate,
    ctaRevealed,
    resultsRef,
    runScan,
  } = useScanFlow();

  return (
    <>
      <Header />

      {phase === "input" && (
        <>
          <Hero
            onFileAccepted={setFile}
            onScan={(jobDescription) => {
              if (file) runScan(file, { jobDescription });
            }}
            initialFilename={file?.name}
            errorMessage={error}
          />
          {showMarketing && (
            <>
              <HowItWorks />
              <WhyRunway />
            </>
          )}
        </>
      )}

      {phase === "loading" && <LoadingScreen />}

      {phase === "results" && result && (
        <ScanResultsView
          result={result}
          bpRevealed={bpRevealed}
          dbAnimate={dbAnimate}
          scoreAnimate={scoreAnimate}
          ctaRevealed={ctaRevealed}
          savedToAccount={savedToAccount}
          resultsRef={resultsRef}
        />
      )}

      {phase !== "loading" && (
        <footer
          style={{
            background: "#000000",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1.5rem",
            textAlign: "center",
            color: "#525252",
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
          }}
        >
          RUNWAY · ATS Resume Checker · For early-career job seekers ·{" "}
          <a
            href="/privacy"
            style={{ color: "#8A8A8A", textDecoration: "underline" }}
          >
            Privacy Policy
          </a>
        </footer>
      )}
    </>
  );
}
