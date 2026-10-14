"use client";

import styles from "@/styles/animations.module.css";

interface ResultsCTAProps {
  score: number;
  revealed: boolean;
}

export default function ResultsCTA({ score, revealed }: ResultsCTAProps) {
  const isCleared = score >= 70;

  return (
    <div
      className={`${styles.ctaReveal} ${revealed ? styles.ctaRevealed : ""}`}
      style={{
        textAlign: "center",
        marginTop: "3rem",
        paddingBottom: "4rem",
      }}
    >
      <button
        style={{
          background: "#FFFFFF",
          color: "#000000",
          border: "none",
          borderRadius: 14,
          padding: "1.1rem 2.5rem",
          fontWeight: 800,
          fontSize: "1.1rem",
          letterSpacing: "0.03em",
          cursor: "pointer",
          transition: "all 0.15s ease",
          boxShadow: "0 8px 24px rgba(255,255,255,0.2)",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget;
          btn.style.transform = "translateY(-3px)";
          btn.style.boxShadow = "0 12px 32px rgba(255,255,255,0.35)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget;
          btn.style.transform = "translateY(0)";
          btn.style.boxShadow = "0 8px 24px rgba(255,255,255,0.2)";
        }}
      >
        {isCleared ? "Ready for Boarding ✈" : "Fix Issues & Clear for Takeoff"}
      </button>

      <p style={{ color: "#737373", fontSize: "0.85rem", marginTop: "0.875rem" }}>
        {isCleared
          ? "Download your full ATS report to share with recruiters."
          : "Your report highlights what to fix before applying."}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "2rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: "🖨️", label: "Print Boarding Pass" },
          { icon: "📋", label: "Copy Report" },
          { icon: "↺", label: "Scan Again" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#8A8A8A",
              borderRadius: 8,
              padding: "0.5rem 1.1rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FFFFFF";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "#8A8A8A";
            }}
            onClick={() => {
              if (label === "Print Boarding Pass") window.print();
              if (label === "Scan Again") window.location.reload();
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );
}
