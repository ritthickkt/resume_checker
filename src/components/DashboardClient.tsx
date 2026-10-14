"use client";

import { useEffect, useRef, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ScanResultsView from "@/components/ScanResultsView";
import ScanHistory from "@/components/ScanHistory";
import { useScanFlow } from "@/lib/useScanFlow";
import { createClient } from "@/lib/supabase/client";
import { listScans, type ScanRecord } from "@/lib/supabase/scans";
import {
  SENIORITY_LEVELS,
  SENIORITY_LABELS,
  EMPHASIS_AREAS,
  EMPHASIS_LABELS,
  type Seniority,
  type Emphasis,
} from "@/lib/analysis";

type Step = 1 | 2 | 3;
type Tab = "book" | "log";

const PILL_BASE: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 999,
  padding: "0.6rem 1.1rem",
  fontSize: "0.82rem",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.15s ease",
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 10,
  padding: "0.9rem 1rem",
  color: "#FFFFFF",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
};

const NEXT_BUTTON: React.CSSProperties = {
  background: "#FFFFFF",
  color: "#000000",
  border: "none",
  borderRadius: 10,
  padding: "0.85rem 1.75rem",
  fontWeight: 800,
  fontSize: "0.95rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

const BACK_BUTTON: React.CSSProperties = {
  background: "transparent",
  color: "#8A8A8A",
  border: "none",
  fontSize: "0.85rem",
  cursor: "pointer",
  fontFamily: "inherit",
  textDecoration: "underline",
};

const STAT_STYLE: React.CSSProperties = {
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: "1.25rem 1rem",
  flex: "1 1 140px",
};

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...PILL_BASE,
        background: active ? "#FFFFFF" : "transparent",
        color: active ? "#000000" : "#D4D4D4",
        borderColor: active ? "#FFFFFF" : "rgba(255,255,255,0.2)",
      }}
    >
      {children}
    </button>
  );
}

interface DashboardClientProps {
  displayName: string;
  initialScans: ScanRecord[];
}

export default function DashboardClient({ displayName, initialScans }: DashboardClientProps) {
  const [tab, setTab] = useState<Tab>("book");
  const [step, setStep] = useState<Step>(1);
  const [targetRole, setTargetRole] = useState("");
  const [showJobPosting, setShowJobPosting] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [seniority, setSeniority] = useState<Seniority>("entry");
  const [emphasis, setEmphasis] = useState<Emphasis>("balanced");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scans, setScans] = useState<ScanRecord[]>(initialScans);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Refresh the flight log once a new scan has been saved.
  useEffect(() => {
    if (!savedToAccount) return;
    const supabase = createClient();
    listScans(supabase).then(setScans).catch(() => {});
  }, [savedToAccount]);

  const handleFile = (f: File) => setFile(f);

  const handleBook = () => {
    if (!file) return;
    runScan(file, {
      jobDescription: jobDescription.trim(),
      targetRole: targetRole.trim(),
      seniority,
      emphasis,
    });
  };

  if (phase === "loading") return <LoadingScreen />;

  if (phase === "results" && result) {
    return (
      <ScanResultsView
        result={result}
        bpRevealed={bpRevealed}
        dbAnimate={dbAnimate}
        scoreAnimate={scoreAnimate}
        ctaRevealed={ctaRevealed}
        savedToAccount={savedToAccount}
        resultsRef={resultsRef}
      />
    );
  }

  const scoreCount = scans.length;
  const bestScore = scoreCount > 0 ? Math.max(...scans.map((s) => s.ats_score)) : null;
  const latestScore = scoreCount > 0 ? scans[0].ats_score : null;

  return (
    <main style={{ background: "#000000", minHeight: "100vh", padding: "3rem 1.5rem 6rem" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 999,
            padding: "0.3rem",
            width: "fit-content",
          }}
        >
          {(
            [
              { id: "book" as const, label: "✈ Book a Flight" },
              { id: "log" as const, label: "📋 Flight Log" },
            ]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "0.5rem 1.1rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                background: tab === t.id ? "#FFFFFF" : "transparent",
                color: tab === t.id ? "#000000" : "#8A8A8A",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 12,
              padding: "0.75rem 1.25rem",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "0.85rem",
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            ⚠ Departure delayed — {error}
          </div>
        )}

        {tab === "book" && (
          <>
        {/* Step 1: Destination */}
        {step === 1 && (
          <div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#A3A3A3",
                marginBottom: "0.5rem",
              }}
            >
              ✈ Welcome back, {displayName}
            </p>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #FFFFFF 0%, #8A8A8A 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.75rem",
              }}
            >
              Where do you want to fly to?
            </h1>
            <p style={{ color: "#737373", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Tell us your target role, and we&apos;ll screen your resume against it.
            </p>

            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager…"
              style={{ ...INPUT_STYLE, marginBottom: "1rem" }}
            />

            {!showJobPosting ? (
              <button
                type="button"
                onClick={() => setShowJobPosting(true)}
                style={{ ...BACK_BUTTON, marginBottom: "2rem" }}
              >
                + Have a specific job posting? Paste it in
              </button>
            ) : (
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting here…"
                rows={5}
                style={{ ...INPUT_STYLE, marginBottom: "2rem", resize: "vertical", lineHeight: 1.5 }}
              />
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                disabled={!targetRole.trim()}
                onClick={() => setStep(2)}
                style={{
                  ...NEXT_BUTTON,
                  opacity: targetRole.trim() ? 1 : 0.5,
                  cursor: targetRole.trim() ? "pointer" : "default",
                }}
              >
                Continue to Itinerary →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Itinerary */}
        {step === 2 && (
          <div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#A3A3A3",
                marginBottom: "0.5rem",
              }}
            >
              ✈ Step 2
            </p>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Build your itinerary
            </h1>
            <p style={{ color: "#737373", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Fine-tune how we screen your resume.
            </p>

            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#737373", marginBottom: "0.6rem" }}>
              Seniority
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.75rem" }}>
              {SENIORITY_LEVELS.map((level) => (
                <Pill key={level} active={seniority === level} onClick={() => setSeniority(level)}>
                  {SENIORITY_LABELS[level]}
                </Pill>
              ))}
            </div>

            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#737373", marginBottom: "0.6rem" }}>
              Emphasis
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.5rem" }}>
              {EMPHASIS_AREAS.map((area) => (
                <Pill key={area} active={emphasis === area} onClick={() => setEmphasis(area)}>
                  {EMPHASIS_LABELS[area]}
                </Pill>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" style={BACK_BUTTON} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" style={NEXT_BUTTON} onClick={() => setStep(3)}>
                Continue to Check-In →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Check-in & Book */}
        {step === 3 && (
          <div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#A3A3A3",
                marginBottom: "0.5rem",
              }}
            >
              ✈ Step 3
            </p>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Check in your resume
            </h1>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                fontFamily: "'Courier New', 'Roboto Mono', monospace",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", padding: "0.3rem 0" }}>
                <span style={{ color: "#737373" }}>DESTINATION</span>
                <span style={{ color: "#FFFFFF" }}>{targetRole || "Auto-detected"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", padding: "0.3rem 0" }}>
                <span style={{ color: "#737373" }}>SENIORITY</span>
                <span style={{ color: "#FFFFFF" }}>{SENIORITY_LABELS[seniority]}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", padding: "0.3rem 0" }}>
                <span style={{ color: "#737373" }}>EMPHASIS</span>
                <span style={{ color: "#FFFFFF" }}>{EMPHASIS_LABELS[emphasis]}</span>
              </div>
            </div>

            <div
              style={{
                background: isDragging ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                border: `2px dashed ${isDragging ? "#FFFFFF" : "rgba(255,255,255,0.3)"}`,
                borderRadius: 16,
                padding: "2rem 1.5rem",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: "2rem",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
            >
              {file ? (
                <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.95rem" }}>📄 {file.name}</p>
              ) : (
                <>
                  <p style={{ color: "#FFFFFF", fontWeight: 700, marginBottom: "0.4rem" }}>Drag & drop or browse files</p>
                  <p style={{ fontSize: "0.72rem", color: "#525252", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    PDF · DOCX · TXT
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" style={BACK_BUTTON} onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                type="button"
                disabled={!file}
                onClick={handleBook}
                style={{ ...NEXT_BUTTON, opacity: file ? 1 : 0.5, cursor: file ? "pointer" : "default" }}
              >
                ✈ Book Flight
              </button>
            </div>
          </div>
        )}
          </>
        )}

        {tab === "log" && (
          <>
        {/* Stats */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <div style={STAT_STYLE}>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#FFFFFF" }}>{scoreCount}</div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#737373", marginTop: "0.3rem" }}>
              Flights Logged
            </div>
          </div>
          <div style={STAT_STYLE}>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#FFFFFF" }}>{bestScore ?? "—"}</div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#737373", marginTop: "0.3rem" }}>
              Best Score
            </div>
          </div>
          <div style={STAT_STYLE}>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#FFFFFF" }}>{latestScore ?? "—"}</div>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#737373", marginTop: "0.3rem" }}>
              Latest Score
            </div>
          </div>
        </div>

        {/* Flight Log */}
        <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1rem" }}>Flight Log</h2>
        <ScanHistory scans={scans} />
          </>
        )}
      </div>
    </main>
  );
}
