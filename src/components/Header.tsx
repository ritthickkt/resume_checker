"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/supabase/useUser";

export default function Header() {
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>✈</span>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              letterSpacing: "0.15em",
              color: "#FFFFFF",
              textTransform: "uppercase",
            }}
          >
            RUNWAY
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <Link
            href="/pricing"
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#D4D4D4",
              textDecoration: "none",
            }}
          >
            {user ? "Upgrade" : "Pricing"}
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#D4D4D4",
                  textDecoration: "none",
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#D4D4D4",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  padding: "0.4rem 0.9rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#000000",
                background: "#FFFFFF",
                borderRadius: 999,
                padding: "0.4rem 0.9rem",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
