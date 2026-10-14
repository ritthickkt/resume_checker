import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — RUNWAY",
  description: "Simple pricing for early-career job seekers. Free ATS score, or upgrade for the full checkpoint breakdown.",
};

const CARD_BASE: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
  padding: "2rem",
  background: "rgba(255,255,255,0.02)",
  display: "flex",
  flexDirection: "column",
};

const TIER_LABEL: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#737373",
};

const PRICE_STYLE: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: 900,
  color: "#FFFFFF",
  letterSpacing: "-0.02em",
  marginTop: "0.5rem",
};

const PRICE_UNIT: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: 500,
  color: "#737373",
};

const FEATURE_LIST: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "1.75rem 0",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  flex: 1,
};

const FEATURE_ITEM: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.6rem",
  color: "#D4D4D4",
  fontSize: "0.9rem",
  lineHeight: 1.5,
};

function Check({ dim }: { dim?: boolean }) {
  return (
    <span style={{ color: dim ? "#525252" : "#FFFFFF", fontWeight: 700 }}>
      {dim ? "–" : "✓"}
    </span>
  );
}

export default function PricingPage() {
  return (
    <main
      style={{
        background: "#000000",
        minHeight: "100vh",
        padding: "4rem 1.5rem 6rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#737373",
            textDecoration: "none",
          }}
        >
          ✈ RUNWAY — Back to check-in
        </Link>

        <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Simple, honest pricing
          </h1>
          <p
            style={{
              color: "#737373",
              fontSize: "0.95rem",
              marginTop: "0.75rem",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Get your ATS score for free. Upgrade when you&apos;re ready to
            optimize for a specific role.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Free tier */}
          <div style={CARD_BASE}>
            <span style={TIER_LABEL}>Economy</span>
            <div style={PRICE_STYLE}>
              $0
            </div>
            <p style={{ color: "#737373", fontSize: "0.85rem", marginTop: "0.4rem" }}>
              For a quick gut check
            </p>
            <ul style={FEATURE_LIST}>
              <li style={FEATURE_ITEM}><Check /> Instant ATS score</li>
              <li style={FEATURE_ITEM}><Check /> Top 3 issues to fix</li>
              <li style={FEATURE_ITEM}><Check /> Boarding pass summary card</li>
              <li style={FEATURE_ITEM}><Check dim /> Full 8-checkpoint breakdown</li>
              <li style={FEATURE_ITEM}><Check dim /> Job description keyword match</li>
              <li style={FEATURE_ITEM}><Check dim /> Tailored bullet rewrites</li>
              <li style={FEATURE_ITEM}><Check dim /> Resume version history</li>
            </ul>
            <Link
              href="/"
              style={{
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                borderRadius: 10,
                padding: "0.85rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Scan for free
            </Link>
          </div>

          {/* Paid tier */}
          <div
            style={{
              ...CARD_BASE,
              border: "1px solid rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.05)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-0.75rem",
                right: "1.5rem",
                background: "#FFFFFF",
                color: "#000000",
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.3rem 0.7rem",
                borderRadius: 999,
              }}
            >
              Most popular
            </span>
            <span style={TIER_LABEL}>First Class</span>
            <div style={PRICE_STYLE}>
              $9 <span style={PRICE_UNIT}>one-time</span>
            </div>
            <p style={{ color: "#737373", fontSize: "0.85rem", marginTop: "0.4rem" }}>
              Full report for one resume + role
            </p>
            <ul style={FEATURE_LIST}>
              <li style={FEATURE_ITEM}><Check /> Everything in Economy</li>
              <li style={FEATURE_ITEM}><Check /> Full 8-checkpoint breakdown</li>
              <li style={FEATURE_ITEM}><Check /> Job description keyword match</li>
              <li style={FEATURE_ITEM}><Check /> Tailored bullet rewrites</li>
              <li style={FEATURE_ITEM}><Check /> Downloadable report</li>
              <li style={FEATURE_ITEM}><Check dim /> Resume version history</li>
            </ul>
            <button
              disabled
              style={{
                textAlign: "center",
                background: "#FFFFFF",
                color: "#000000",
                border: "none",
                borderRadius: 10,
                padding: "0.85rem",
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "not-allowed",
                opacity: 0.6,
                fontFamily: "inherit",
              }}
            >
              Coming soon
            </button>
          </div>

          {/* Subscription tier */}
          <div style={CARD_BASE}>
            <span style={TIER_LABEL}>Frequent Flyer</span>
            <div style={PRICE_STYLE}>
              $12 <span style={PRICE_UNIT}>/mo</span>
            </div>
            <p style={{ color: "#737373", fontSize: "0.85rem", marginTop: "0.4rem" }}>
              For an active job search
            </p>
            <ul style={FEATURE_LIST}>
              <li style={FEATURE_ITEM}><Check /> Everything in First Class</li>
              <li style={FEATURE_ITEM}><Check /> Unlimited resume + role scans</li>
              <li style={FEATURE_ITEM}><Check /> Resume version history</li>
              <li style={FEATURE_ITEM}><Check /> Track score improvement over time</li>
            </ul>
            <button
              disabled
              style={{
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "#FFFFFF",
                borderRadius: 10,
                padding: "0.85rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "not-allowed",
                opacity: 0.6,
                fontFamily: "inherit",
              }}
            >
              Coming soon
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#525252",
            fontSize: "0.8rem",
            marginTop: "3rem",
          }}
        >
          Questions about pricing?{" "}
          <a href="mailto:ritthick@gmail.com" style={{ color: "#8A8A8A", textDecoration: "underline" }}>
            ritthick@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
