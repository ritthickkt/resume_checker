import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalysisResult, AnalysisCheck } from "@/lib/analysis";

export interface ScanRecord {
  id: string;
  user_id: string;
  passenger: string;
  role: string;
  company: string;
  ats_score: number;
  summary: string;
  checks: AnalysisCheck[];
  matched_keywords: string[];
  missing_keywords: string[];
  created_at: string;
}

export async function saveScan(
  supabase: SupabaseClient,
  userId: string,
  result: AnalysisResult,
) {
  return supabase.from("scans").insert({
    user_id: userId,
    passenger: result.passenger,
    role: result.role,
    company: result.company,
    ats_score: result.atsScore,
    summary: result.summary,
    checks: result.checks,
    matched_keywords: result.matchedKeywords,
    missing_keywords: result.missingKeywords,
  });
}

export async function listScans(supabase: SupabaseClient, limit = 50): Promise<ScanRecord[]> {
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ScanRecord[];
}
