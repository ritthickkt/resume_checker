"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/styles/animations.module.css";
import { useUser } from "@/lib/supabase/useUser";

interface HeroProps {
  onFileAccepted: (file: File) => void;
  onScan: (jobDescription: string) => void;
  initialFilename?: string;
  errorMessage?: string | null;
}

export default function Hero({ onFileAccepted, onScan, initialFilename, errorMessage }: HeroProps) {
  const [filename, setFilename] = useState<string>(initialFilename ?? "");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lightsLeftRef = useRef<HTMLDivElement>(null);
  const lightsRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [lightsLeftRef, lightsRightRef].forEach((ref) => {
      if (!ref.current) return;
      ref.current.innerHTML = "";
      for (let i = 0; i < 14; i++) {
        const span = document.createElement("span");
        span.className = styles.light;
        span.style.animationDelay = `${i * 0.09}s`;
        ref.current.appendChild(span);
      }
    });
  }, []);

  const handleFile = (file: File) => {
    setFilename(file.name);
    onFileAccepted(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "#000000",
        overflow: "hidden",
        padding: "6rem 1.5rem 11rem",
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Badge chips */}
      <div
        className={styles.fadeUp}
        style={{
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        {["Built On Real ATS Signals", "By Early Job Seekers, For Early Job Seekers", "Free · No Sign-Up"].map((chip) => (
          <span
            key={chip}
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "0.35rem 0.9rem",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#A3A3A3",
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Headline */}
      <h1
        className={`${styles.fadeUp} ${styles.fadeUpDelay1}`}
        style={{
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #FFFFFF 0%, #8A8A8A 80%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "1rem",
        }}
      >
        Check in. Clear the scan.
        <br />
        Board your career.
      </h1>

      <p
        className={`${styles.fadeUp} ${styles.fadeUpDelay1}`}
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "#A3A3A3",
          textAlign: "center",
          marginBottom: "2.5rem",
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        RUNWAY is built on the same signals real ATS systems use to get
        early-career resumes past the bots — built by job seekers who&apos;ve
        been in your seat.
      </p>

      {/* Error banner */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            width: "min(500px, 100%)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 12,
            padding: "0.75rem 1.25rem",
            marginBottom: "1.25rem",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#FFFFFF",
            background: "rgba(255,255,255,0.06)",
            letterSpacing: "0.05em",
          }}
        >
          ⚠ Departure delayed — {errorMessage}
        </div>
      )}

      {/* Upload kiosk */}
      <div
        className={`${styles.fadeUp} ${styles.fadeUpDelay2}`}
        style={{
          width: "min(500px, 100%)",
          background: isDragging
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.04)",
          border: `2px dashed ${isDragging ? "#FFFFFF" : "rgba(255,255,255,0.3)"}`,
          borderRadius: 20,
          padding: "2.5rem 2rem",
          textAlign: "center",
          cursor: "pointer",
          transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: isDragging ? "0 0 24px rgba(255,255,255,0.2)" : "none",
        }}
        onClick={() => !filename && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!filename ? (
          <>
            {/* Kiosk icon */}
            <div style={{ marginBottom: "1rem" }}>
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                style={{ margin: "0 auto", display: "block" }}
              >
                <rect
                  x="4" y="14" width="44" height="28"
                  rx="4" stroke="#FFFFFF" strokeWidth="2"
                />
                <line
                  x1="32" y1="14" x2="32" y2="42"
                  stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 3"
                />
                <rect x="10" y="20" width="14" height="3" rx="1.5" fill="#FFFFFF" opacity="0.6" />
                <rect x="10" y="26" width="10" height="3" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                <rect x="10" y="32" width="12" height="3" rx="1.5" fill="#FFFFFF" opacity="0.4" />
                <circle cx="40" cy="28" r="5" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="37.5" y="32" fontSize="7" fill="#FFFFFF" fontWeight="bold">87</text>
              </svg>
            </div>

            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                color: "#FFFFFF",
                marginBottom: "0.5rem",
              }}
            >
              Check In Your Resume
            </p>
            <p style={{ color: "#737373", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Drag & drop or{" "}
              <label
                htmlFor="file-input"
                style={{ color: "#FFFFFF", textDecoration: "underline", cursor: "pointer" }}
                onClick={(e) => e.stopPropagation()}
              >
                browse files
              </label>
            </p>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#525252",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              PDF · DOCX · TXT
            </p>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>📄</span>
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  maxWidth: 280,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {filename}
              </span>
            </div>
            <div style={{ width: "100%", textAlign: "left" }} onClick={(e) => e.stopPropagation()}>
              <label
                htmlFor="job-desc"
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#737373",
                  marginBottom: "0.4rem",
                }}
              >
                Destination — paste the job posting (optional)
              </label>
              <textarea
                id="job-desc"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here and we'll screen your resume against this exact posting…"
                rows={4}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  padding: "0.75rem 0.9rem",
                  color: "#FFFFFF",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onScan(jobDesc.trim()); }}
              style={{
                background: "#FFFFFF",
                color: "#000000",
                border: "none",
                borderRadius: 12,
                padding: "0.875rem 2rem",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "0.03em",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#E5E5E5";
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "#FFFFFF";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {jobDesc.trim() ? "Scan for This Job →" : "Scan Resume →"}
            </button>
            <p
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "0.7rem",
                color: "#525252",
                lineHeight: 1.5,
                maxWidth: 340,
                margin: 0,
              }}
            >
              By scanning, you agree to our{" "}
              <Link
                href="/privacy"
                style={{ color: "#8A8A8A", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>
              . Your resume is analyzed by AI and never stored.
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setFilename(""); fileInputRef.current && (fileInputRef.current.value = ""); }}
              style={{
                background: "transparent",
                border: "none",
                color: "#737373",
                fontSize: "0.8rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Choose a different file
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept=".pdf,.docx,.txt"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Sign-up CTA */}
      {!user && (
        <div
          className={`${styles.fadeUp} ${styles.fadeUpDelay2}`}
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Link
            href="/signup"
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#FFFFFF",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "0.55rem 1.25rem",
            }}
          >
            ✈ Join Frequent Flyer — It&apos;s Free
          </Link>
          <p style={{ fontSize: "0.75rem", color: "#525252" }}>
            Save your scans and track your score over time.
          </p>
        </div>
      )}

      {/* Departures ticker */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 72,
          left: 0,
          right: 0,
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0.55rem 0",
          pointerEvents: "none",
          maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <span
              key={copy}
              style={{
                fontFamily: "'Courier New', 'Roboto Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#737373",
                paddingRight: "3rem",
              }}
            >
              Now boarding · SWE-2026 Software Engineer — Gate A1 · PM-2026
              Product Manager — Gate B4 · DS-2026 Data Scientist — Gate C2 ·
              UX-2026 Product Designer — Gate D7 · FIN-2026 Analyst — Gate E3 ·
              All early careers — Gates open ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Runway lights strip */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0.75rem 1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {/* Centerline dashes */}
        <div
          style={{
            height: 2,
            background: "repeating-linear-gradient(to right, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 20px, transparent 20px, transparent 36px)",
            margin: "0 2rem",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div ref={lightsLeftRef} style={{ display: "flex", gap: "calc((100% - 14px) / 13 - 14px + 4px)", alignItems: "center", flex: 1, justifyContent: "space-between" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div ref={lightsRightRef} style={{ display: "flex", gap: "calc((100% - 14px) / 13 - 14px + 4px)", alignItems: "center", flex: 1, justifyContent: "space-between" }} />
        </div>
      </div>
    </section>
  );
}
