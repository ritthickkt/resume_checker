import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — RUNWAY",
  description:
    "How RUNWAY handles your resume, job postings, and personal data.",
};

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 700,
  color: "#FFFFFF",
  marginTop: "2.5rem",
  marginBottom: "0.75rem",
  letterSpacing: "0.01em",
};

const BODY_STYLE: React.CSSProperties = {
  color: "#A3A3A3",
  fontSize: "0.95rem",
  lineHeight: 1.75,
  marginBottom: "0.75rem",
};

export default function PrivacyPage() {
  return (
    <main
      style={{
        background: "#000000",
        minHeight: "100vh",
        padding: "4rem 1.5rem 6rem",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
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

        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginTop: "1.5rem",
            marginBottom: "0.5rem",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "#525252", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Effective July 2, 2026
        </p>

        <p style={{ ...BODY_STYLE, marginTop: "2rem" }}>
          RUNWAY is an ATS resume checker built for early-career job seekers.
          This policy explains what happens to your data when you use it. The
          short version: your resume is analyzed and returned to you — we do
          not keep it, sell it, or use it for advertising.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>What we collect</h2>
        <p style={BODY_STYLE}>
          When you scan a resume, we receive the resume file you upload
          (PDF, DOCX, or TXT) and, if you provide one, the job posting text
          you paste. Resumes typically contain personal information such as
          your name, contact details, education, and work history. Our hosting
          provider also records standard technical logs (such as IP address
          and request time) for security and reliability.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>How your resume is used</h2>
        <p style={BODY_STYLE}>
          Your resume and job posting are used for exactly one purpose:
          generating your ATS analysis. They are transmitted securely to our
          AI provider, Anthropic, whose Claude model performs the screening
          and returns the results you see. We do not use your resume for
          advertising, and we do not sell or share it with data brokers.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Storage and retention</h2>
        <p style={BODY_STYLE}>
          RUNWAY does not store your resume. Once your analysis is generated
          and returned to your browser, the file is discarded from our
          server. Your results exist only in your browser session — refresh
          the page and they are gone.
        </p>
        <p style={BODY_STYLE}>
          Anthropic, our AI provider, may retain API inputs for a limited
          period (currently up to 30 days) for trust and safety purposes,
          after which they are deleted. Anthropic does not train its models
          on this data. See{" "}
          <a
            href="https://www.anthropic.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FFFFFF", textDecoration: "underline" }}
          >
            Anthropic&apos;s privacy policy
          </a>{" "}
          for details.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Third-party services</h2>
        <p style={BODY_STYLE}>
          We rely on two service providers: <strong style={{ color: "#D4D4D4" }}>Vercel</strong>{" "}
          (website hosting and request logs) and{" "}
          <strong style={{ color: "#D4D4D4" }}>Anthropic</strong> (AI analysis
          of your resume). Both process your data only to provide their
          services to us.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Cookies</h2>
        <p style={BODY_STYLE}>
          RUNWAY does not use advertising or tracking cookies. We do not run
          third-party analytics that profile you.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Your rights</h2>
        <p style={BODY_STYLE}>
          Because we don&apos;t store your resume, there is usually nothing
          for us to delete — but you can always contact us with questions
          about your data, including requests under privacy laws that apply
          to you (such as GDPR or CCPA), and we will respond.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Children</h2>
        <p style={BODY_STYLE}>
          RUNWAY is intended for job seekers and is not directed at children
          under 16.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Changes to this policy</h2>
        <p style={BODY_STYLE}>
          If we change how data is handled — for example, if we add an
          opt-in option to let us keep resumes to improve the screener — we
          will update this page and its effective date before the change
          takes effect.
        </p>

        <h2 style={SECTION_TITLE_STYLE}>Contact</h2>
        <p style={BODY_STYLE}>
          Questions about this policy or your data:{" "}
          <a
            href="mailto:ritthick@gmail.com"
            style={{ color: "#FFFFFF", textDecoration: "underline" }}
          >
            ritthick@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
