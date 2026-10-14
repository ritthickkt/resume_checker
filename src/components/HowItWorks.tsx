"use client";

const steps = [
  {
    number: "01",
    title: "Check In",
    description:
      "Upload your resume — PDF, DOCX, or plain text. Our system reads every line, just like a real ATS.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="28" height="20" rx="3" />
        <line x1="22" y1="8" x2="22" y2="28" strokeDasharray="3 3" />
        <line x1="9" y1="15" x2="17" y2="15" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <circle cx="27" cy="18" r="4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Security Screening",
    description:
      "Your resume passes through our ATS scanner, built on the same signals real applicant tracking systems check — keyword matching, parse-ability, section structure, and formatting.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="13" />
        <circle cx="18" cy="18" r="8" />
        <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
        <line x1="18" y1="5" x2="18" y2="10" />
        <line x1="18" y1="26" x2="18" y2="31" />
        <line x1="5" y1="18" x2="10" y2="18" />
        <line x1="26" y1="18" x2="31" y2="18" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Board",
    description:
      "Get your ATS score, a boarding pass with your results, and a clear departure board of issues to fix.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 26h28" />
        <path d="M18 22L12 8l4-2 8 8 7-3 1 3-14 6z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      style={{
        background: "#050505",
        color: "#FFFFFF",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "5rem 1.5rem 6rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#737373",
            marginBottom: "0.75rem",
          }}
        >
          Your Flight Plan
        </p>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 900,
            color: "#FFFFFF",
            marginBottom: "3.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          From check-in to boarding in three steps.
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0",
            position: "relative",
          }}
          className="waypoints-container"
        >
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "0 1.5rem",
                position: "relative",
                maxWidth: 280,
              }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 40,
                    left: "calc(50% + 40px)",
                    right: "calc(-50% + 40px)",
                    height: 2,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 100%)",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Icon circle */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#000000",
                  border: "1.5px solid rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  zIndex: 1,
                  position: "relative",
                  boxShadow: "0 4px 16px rgba(255,255,255,0.08)",
                }}
              >
                {step.icon}
              </div>

              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#737373",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                {step.number}
              </span>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: "0.6rem",
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: "#A3A3A3", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .waypoints-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
