export const CHECK_NAMES = [
  "Keywords Match",
  "Contact Info",
  "File Format",
  "Section Headers",
  "Work Experience",
  "Education",
  "Skills Section",
  "ATS-Friendly Formatting",
] as const;

export type CheckName = (typeof CHECK_NAMES)[number];
export type CheckStatus = "cleared" | "pending" | "flagged";

// Score is computed deterministically from check statuses — the model never
// picks the number, so identical findings always produce identical scores.
export const CHECK_WEIGHTS: Record<CheckName, number> = {
  "Keywords Match": 20,
  "Contact Info": 10,
  "File Format": 10,
  "Section Headers": 10,
  "Work Experience": 20,
  "Education": 10,
  "Skills Section": 10,
  "ATS-Friendly Formatting": 10,
};

export const STATUS_CREDIT: Record<CheckStatus, number> = {
  cleared: 1,
  pending: 0.5,
  flagged: 0,
};

export function computeScore(
  checks: { name: CheckName; status: CheckStatus }[],
): number {
  let score = 0;
  for (const check of checks) {
    score += CHECK_WEIGHTS[check.name] * STATUS_CREDIT[check.status];
  }
  return Math.round(score);
}

export interface AnalysisCheck {
  name: CheckName;
  status: CheckStatus;
  detail: string;
  /** Concrete rewrite suggestion for this checkpoint. Only populated on the full (paid) report. */
  rewriteSuggestion?: string | null;
}

export interface AnalysisResult {
  passenger: string;
  role: string;
  company: string;
  atsScore: number;
  summary: string;
  checks: AnalysisCheck[];
  /** Keywords from the job posting found in the resume. Empty when no posting was provided. */
  matchedKeywords: string[];
  /** Keywords the job posting asks for that the resume is missing. Empty when no posting was provided. */
  missingKeywords: string[];
}

export const SENIORITY_LEVELS = ["entry", "mid", "senior"] as const;
export type Seniority = (typeof SENIORITY_LEVELS)[number];

export const SENIORITY_LABELS: Record<Seniority, string> = {
  entry: "Entry-Level",
  mid: "Mid-Level",
  senior: "Senior",
};

export const EMPHASIS_AREAS = ["balanced", "keywords", "formatting", "experience"] as const;
export type Emphasis = (typeof EMPHASIS_AREAS)[number];

export const EMPHASIS_LABELS: Record<Emphasis, string> = {
  balanced: "Balanced",
  keywords: "Keyword Optimization",
  formatting: "Formatting & Parseability",
  experience: "Experience Storytelling",
};
