"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult, Seniority, Emphasis } from "@/lib/analysis";
import { createClient } from "@/lib/supabase/client";
import { saveScan } from "@/lib/supabase/scans";
import { useUser } from "@/lib/supabase/useUser";

export type ScanPhase = "input" | "loading" | "results";

const MIN_LOADING_MS = 3600;

export interface ScanExtras {
  jobDescription?: string;
  targetRole?: string;
  seniority?: Seniority;
  emphasis?: Emphasis;
}

export function useScanFlow() {
  const [phase, setPhase] = useState<ScanPhase>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [bpRevealed, setBpRevealed] = useState(false);
  const [dbAnimate, setDbAnimate] = useState(false);
  const [scoreAnimate, setScoreAnimate] = useState(false);
  const [ctaRevealed, setCtaRevealed] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const { user } = useUser();

  const runScan = async (file: File, extras: ScanExtras = {}) => {
    setError(null);
    setPhase("loading");
    const started = Date.now();

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (extras.jobDescription) formData.append("jobDescription", extras.jobDescription);
      if (extras.targetRole) formData.append("targetRole", extras.targetRole);
      if (extras.seniority) formData.append("seniority", extras.seniority);
      if (extras.emphasis) formData.append("emphasis", extras.emphasis);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      const analysis = data as AnalysisResult;
      const remaining = Math.max(0, MIN_LOADING_MS - (Date.now() - started));
      setTimeout(() => {
        setResult(analysis);
        setBpRevealed(false);
        setDbAnimate(false);
        setScoreAnimate(false);
        setCtaRevealed(false);
        setSavedToAccount(false);
        setPhase("results");
      }, remaining);

      if (user) {
        const supabase = createClient();
        saveScan(supabase, user.id, analysis)
          .then(({ error: saveError }) => {
            if (!saveError) setSavedToAccount(true);
          })
          .catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("input");
    }
  };

  useEffect(() => {
    if (phase !== "results") return;

    const t0 = setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    const t1 = setTimeout(() => setBpRevealed(true), 300);
    const t2 = setTimeout(() => setDbAnimate(true), 900);
    const t3 = setTimeout(() => setScoreAnimate(true), 1500);
    const t4 = setTimeout(() => setCtaRevealed(true), 2300);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [phase]);

  return {
    phase,
    result,
    error,
    savedToAccount,
    bpRevealed,
    dbAnimate,
    scoreAnimate,
    ctaRevealed,
    resultsRef,
    runScan,
  };
}
