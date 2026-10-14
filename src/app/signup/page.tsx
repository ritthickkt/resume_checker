"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 10,
  padding: "0.85rem 1rem",
  color: "#FFFFFF",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#8A8A8A",
  marginBottom: "0.5rem",
  display: "block",
};

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setCheckEmail(true);
  };

  return (
    <main
      style={{
        background: "#000000",
        minHeight: "100vh",
        padding: "4rem 1.5rem 6rem",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%" }}>
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

        <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2.5rem" }}>
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
            ✈ Frequent Flyer Enrollment
          </p>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "#737373", fontSize: "0.9rem", marginTop: "0.6rem" }}>
            Save your scans and track your score over time.
          </p>
        </div>

        {checkEmail ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 14,
              padding: "1.5rem",
              textAlign: "center",
              color: "#D4D4D4",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            ✈ Confirmation email sent — check <strong style={{ color: "#FFFFFF" }}>{email}</strong> to
            confirm your account before signing in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div>
              <label style={LABEL_STYLE} htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={INPUT_STYLE}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label style={LABEL_STYLE} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={INPUT_STYLE}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={LABEL_STYLE} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={INPUT_STYLE}
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p style={{ color: "#FFFFFF", background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "0.7rem 0.9rem", fontSize: "0.82rem" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#FFFFFF",
                color: "#000000",
                border: "none",
                borderRadius: 10,
                padding: "0.9rem",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "inherit",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "Creating account…" : "✈ Join Frequent Flyer"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "#737373", fontSize: "0.85rem", marginTop: "1.75rem" }}>
          Already flying with us?{" "}
          <Link href="/login" style={{ color: "#FFFFFF", textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
