"use client";

const cards = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="6" width="26" height="24" rx="3" />
        <line x1="5" y1="13" x2="31" y2="13" />
        <line x1="10" y1="19" x2="22" y2="19" />
        <line x1="10" y1="24" x2="18" y2="24" />
        <circle cx="26" cy="21.5" r="2" fill="#FFFFFF" stroke="none" />
      </svg>
    ),
    title: "We've been in your seat",
    description:
      "RUNWAY was built by early job seekers who got ghosted by resume bots one time too many. This is the screener we wished existed when we were applying.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 4v6M18 26v6M4 18h6M26 18h6" />
        <circle cx="18" cy="18" r="8" />
        <path d="M14 18l3 3 5-6" />
      </svg>
    ),
    title: "Built on real ATS signals",
    description:
      "Our engine checks resumes on the same signals real applicant tracking systems use — so you see exactly what the bots see, before a recruiter ever does.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 26h28" />
        <path d="M18 22L12 8l4-2 8 8 7-3 1 3-14 6z" />
      </svg>
    ),
    title: "For avgeeks, by avgeeks",
    description:
      "Boarding passes, gate calls, departure boards. Job hunting is stressful — your tools don't have to be. Every scan is a departure worth watching.",
  },
];

const stats = [
  { value: "8", label: "ATS Checkpoints" },
  { value: "<60s", label: "Scan Time" },
  { value: "0", label: "Sign-Ups Required" },
];

export default function WhyRunway() {
  return (
    <section
      style={{
        background: "#000000",
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
          Why Fly Runway
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
          By early job seekers, for early job seekers.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "4rem",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "2rem 1.75rem",
                background: "rgba(255,255,255,0.03)",
                transition: "border-color 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: "1.1rem" }}>{card.icon}</div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: "0.6rem",
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "#A3A3A3", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(2rem, 8vw, 5rem)",
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "2.5rem",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#737373",
                  marginTop: "0.4rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
