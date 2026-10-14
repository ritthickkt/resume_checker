import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import DashboardClient from "@/components/DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { listScans } from "@/lib/supabase/scans";

export const metadata: Metadata = {
  title: "Dashboard — RUNWAY",
  description: "Your flight log — every resume scan and score, tracked over time.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let scans: Awaited<ReturnType<typeof listScans>> = [];
  try {
    scans = await listScans(supabase);
  } catch {
    scans = [];
  }

  const displayName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
    user.email ||
    "Flyer";

  return (
    <>
      <Header />
      <DashboardClient displayName={displayName} initialScans={scans} />
    </>
  );
}
