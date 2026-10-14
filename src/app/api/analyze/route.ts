import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import mammoth from "mammoth";
import {
  CHECK_NAMES,
  computeScore,
  SENIORITY_LEVELS,
  EMPHASIS_AREAS,
  type AnalysisCheck,
  type AnalysisResult,
  type CheckName,
  type Seniority,
  type Emphasis,
} from "@/lib/analysis";

export const maxDuration = 120;

const MAX_FILE_BYTES = 4 * 1024 * 1024; // Vercel request body limit is ~4.5MB

type Tier = "free" | "full";

const TIER_MODEL: Record<Tier, string> = {
  free: "claude-haiku-4-5",
  full: "claude-opus-4-8",
};

const SENIORITY_ADDENDUM: Record<Seniority, string> = {
  entry: "",
  mid: `

The candidate is targeting a MID-LEVEL position (roughly 2-5 years of experience). Expect substantive full-time roles with measurable impact. For Work Experience: "cleared" requires demonstrated ownership and quantified outcomes, not just a task list — internships and coursework alone should not carry the same weight they would for an entry-level candidate.`,
  senior: `

The candidate is targeting a SENIOR-LEVEL position (5+ years, likely with leadership or technical ownership). For Work Experience: "cleared" requires evidence of leadership, mentorship, or significant scope/impact — internships and coursework should not meaningfully raise this checkpoint's status.`,
};

const EMPHASIS_ADDENDUM: Record<Emphasis, string> = {
  balanced: "",
  keywords: `

Give extra depth to the Keywords Match checkpoint's detail — name exactly which important keywords are present or missing, not just a general assessment.`,
  formatting: `

Give extra depth to the File Format and ATS-Friendly Formatting checkpoints' details — be specific about exactly what would or wouldn't break an ATS parser.`,
  experience: `

Give extra depth to the Work Experience and Skills Section checkpoints' details — be specific about what makes the experience compelling or where it falls short.`,
};

function buildDestinationAddendum(targetRole: string): string {
  if (!targetRole) return "";
  return `

The candidate has told us their target role (destination) is: "${targetRole}". Unless a job posting below says otherwise, use this as the destination role: set the \`role\` field from it (in UPPERCASE) and evaluate Keywords Match against what this role typically requires.`;
}

const CheckSchemaBase = z.object({
  name: z.enum(CHECK_NAMES),
  status: z.enum(["cleared", "pending", "flagged"]),
  detail: z
    .string()
    .describe(
      "Short, specific, evidence-based finding citing what was actually observed in this resume, e.g. 'Found email and phone; no LinkedIn URL'. Max ~12 words. Never generic advice.",
    ),
});

const CheckSchemaWithRewrite = CheckSchemaBase.extend({
  rewriteSuggestion: z
    .string()
    .nullable()
    .describe(
      "For 'pending' or 'flagged' checks, a concrete rewrite demonstrating the fix using this resume's actual content (e.g. a rewritten bullet, a suggested skills line, a corrected section header). Null for 'cleared' checks.",
    ),
});

function buildAnalysisSchema(tier: Tier) {
  return z.object({
  isResume: z
    .boolean()
    .describe(
      "true only if the document is genuinely a resume/CV with readable content. false for cover letters, blank/garbled documents, scans with no extractable text, or unrelated documents.",
    ),
  documentIssue: z
    .string()
    .nullable()
    .describe(
      "If isResume is false, a short user-facing explanation of what the document appears to be or why it can't be screened. null when isResume is true.",
    ),
  passenger: z
    .string()
    .describe("Candidate's full name in UPPERCASE, or 'APPLICANT' if not found"),
  role: z
    .string()
    .describe(
      "Target or most recent role in UPPERCASE, e.g. 'SOFTWARE ENGINEER'",
    ),
  company: z
    .string()
    .describe(
      "Most recent or target company in UPPERCASE, or 'YOUR NEXT CO.' if none found",
    ),
  summary: z
    .string()
    .describe(
      "One-sentence plain-English summary of the resume's ATS readiness. Never mention a numeric score.",
    ),
  checks: z
    .array(tier === "full" ? CheckSchemaWithRewrite : CheckSchemaBase)
    .describe("Exactly one entry for each of the 8 checkpoint names, in order"),
  matchedKeywords: z
    .array(z.string())
    .describe(
      "Only when a job posting is provided: hard skills/requirements from the posting that ARE present in the resume, max 12, most important first. Empty array when no posting.",
    ),
  missingKeywords: z
    .array(z.string())
    .describe(
      "Only when a job posting is provided: hard skills/requirements the posting asks for that are MISSING from the resume, max 12, most important first. Empty array when no posting.",
    ),
  });
}

const SYSTEM_PROMPT = `You are RUNWAY, an ATS (Applicant Tracking System) resume screener built for early-career job seekers. You analyze resumes the way real applicant tracking systems parse them and report exactly what a recruiter's software would see.

First, verify the document is actually a readable resume. If it is a cover letter, an unrelated document, blank, or so garbled/image-based that its text cannot be read, set isResume to false with a short explanation in documentIssue, and mark every check "flagged" with detail "Document could not be screened".

For genuine resumes, evaluate all 8 checkpoints. You do NOT assign a score — the score is computed from your statuses, so status accuracy is everything. Apply these exact criteria:

1. Keywords Match
   WITHOUT a job posting:
   - cleared: resume contains a solid set of skills/keywords clearly relevant to the candidate's apparent target role
   - pending: some relevant keywords, but notable gaps for the target role
   - flagged: few or no role-relevant keywords detectable
   WITH a job posting (screen against THAT posting specifically):
   - cleared: resume covers nearly all required hard skills/qualifications the posting names
   - pending: covers the core requirements but misses several named skills or preferred qualifications
   - flagged: misses most of the posting's required hard skills
2. Contact Info
   - cleared: email AND phone present and well-formed (LinkedIn/portfolio is a bonus, not required)
   - pending: email or phone present, the other missing or malformed
   - flagged: no reliable way to contact the candidate
3. File Format
   - cleared: text is cleanly machine-readable throughout
   - pending: mostly readable with small garbled or oddly-encoded regions
   - flagged: substantial unreadable, image-only, or garbled regions
4. Section Headers
   - cleared: standard labels ATS parsers key on (Experience/Work Experience, Education, Skills)
   - pending: sections exist but use nonstandard labels (e.g. "My Journey")
   - flagged: no recognizable section structure
5. Work Experience
   - cleared: roles with titles, organizations, and dates; bullets describing what was done (internships, research, and substantial projects count fully for early-career candidates)
   - pending: experience present but missing dates, titles, or has thin one-line descriptions
   - flagged: no identifiable experience or project section
6. Education
   - cleared: institution and degree/program present with dates
   - pending: education present but missing dates or degree detail
   - flagged: no education section
7. Skills Section
   - cleared: a dedicated skills section listing concrete, parseable hard skills (tools, technologies, languages, certifications, techniques)
   - pending: hard skills exist but are scattered in prose rather than a dedicated section, or a section mixes a few hard skills among soft traits
   - flagged: no hard skills identifiable anywhere — including a section that lists ONLY soft traits/adjectives like "hardworking" or "team player" (those are invisible to ATS keyword matching)
8. ATS-Friendly Formatting
   - cleared: single-column, no tables, text boxes, or graphics carrying content
   - pending: minor risks (two columns, decorative elements, content in header/footer)
   - flagged: heavy use of tables/text boxes/graphics that real ATS parsers mangle

When a job posting is provided:
- Screen the resume against THAT posting: set role and company from the posting (the destination the candidate is flying to), and make Keywords Match and its detail specific to the posting's named requirements.
- Fill matchedKeywords and missingKeywords with the posting's concrete hard skills/qualifications (tools, technologies, certifications, years-of-experience requirements). A keyword is "matched" only if the resume genuinely evidences it — synonyms and clear equivalents count (e.g. "React.js" matches "React"), buzzword-stuffing does not.
- Ignore soft-skill fluff in the posting ("team player", "fast-paced environment") — only track requirements an ATS keyword filter would realistically screen on.
When NO job posting is provided, matchedKeywords and missingKeywords must be empty arrays.

Rules for reliability:
- Judge only what is actually in the document. Every detail must cite concrete evidence from THIS resume (what you found or what is missing) — never generic advice.
- When genuinely uncertain between two statuses, choose the more lenient one, but only if evidence supports it.
- Judge against realistic early-career expectations: internships, coursework, and projects count as experience.
- The summary must be specific to this resume, encouraging in tone, and must never state a numeric score.`;

const REWRITE_ADDENDUM = `

For every checkpoint marked "pending" or "flagged", also fill rewriteSuggestion with a concrete rewrite grounded in this resume's actual content — e.g. an improved version of a real bullet, a suggested skills line built from technologies already mentioned elsewhere in the resume, or a corrected section header. Never a generic template. Set rewriteSuggestion to null for "cleared" checkpoints.`;

interface PromptContext {
  targetRole: string;
  seniority: Seniority;
  emphasis: Emphasis;
}

function buildSystemPrompt(tier: Tier, context: PromptContext): string {
  let prompt = SYSTEM_PROMPT;
  prompt += buildDestinationAddendum(context.targetRole);
  prompt += SENIORITY_ADDENDUM[context.seniority];
  prompt += EMPHASIS_ADDENDUM[context.emphasis];
  if (tier === "full") prompt += REWRITE_ADDENDUM;
  return prompt;
}

type FileContent =
  | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } }
  | { type: "text"; text: string };

async function fileToContentBlock(file: File): Promise<FileContent> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return {
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: buffer.toString("base64"),
      },
    };
  }

  if (name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return { type: "text", text: `Resume (extracted from DOCX):\n\n${value}` };
  }

  return { type: "text", text: `Resume (plain text):\n\n${buffer.toString("utf-8")}` };
}

// Guarantee exactly one entry per checkpoint, in canonical order, regardless
// of what the model returned. A missing checkpoint becomes "pending".
function normalizeChecks(
  raw: {
    name: CheckName;
    status: AnalysisCheck["status"];
    detail: string;
    rewriteSuggestion?: string | null;
  }[],
): AnalysisCheck[] {
  const byName = new Map(raw.map((c) => [c.name, c]));
  return CHECK_NAMES.map((name) => {
    const found = byName.get(name);
    if (!found) {
      return {
        name,
        status: "pending" as const,
        detail: "Could not be evaluated — review manually",
      };
    }
    return {
      name: found.name,
      status: found.status,
      detail: found.detail,
      rewriteSuggestion: found.rewriteSuggestion ?? null,
    };
  });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY" },
      { status: 500 },
    );
  }

  let file: File;
  let jobDescription = "";
  let tier: Tier = "free";
  let targetRole = "";
  let seniority: Seniority = "entry";
  let emphasis: Emphasis = "balanced";
  try {
    const formData = await request.formData();
    const entry = formData.get("file");
    if (!(entry instanceof File) || entry.size === 0) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (entry.size > MAX_FILE_BYTES) {
      return Response.json(
        { error: "File too large — maximum is 4MB" },
        { status: 413 },
      );
    }
    file = entry;
    const jd = formData.get("jobDescription");
    if (typeof jd === "string") jobDescription = jd.trim().slice(0, 20000);
    if (formData.get("tier") === "full") tier = "full";

    const roleField = formData.get("targetRole");
    if (typeof roleField === "string") targetRole = roleField.trim().slice(0, 200);

    const seniorityField = formData.get("seniority");
    if (
      typeof seniorityField === "string" &&
      (SENIORITY_LEVELS as readonly string[]).includes(seniorityField)
    ) {
      seniority = seniorityField as Seniority;
    }

    const emphasisField = formData.get("emphasis");
    if (
      typeof emphasisField === "string" &&
      (EMPHASIS_AREAS as readonly string[]).includes(emphasisField)
    ) {
      emphasis = emphasisField as Emphasis;
    }
  } catch {
    return Response.json({ error: "Invalid upload" }, { status: 400 });
  }

  try {
    const contentBlock = await fileToContentBlock(file);
    const client = new Anthropic();

    const response = await client.messages.parse({
      model: TIER_MODEL[tier],
      max_tokens: 8192,
      ...(tier === "full"
        ? { thinking: { type: "adaptive" as const }, output_config: { effort: "high" as const, format: zodOutputFormat(buildAnalysisSchema(tier)) } }
        : { output_config: { format: zodOutputFormat(buildAnalysisSchema(tier)) } }),
      system: buildSystemPrompt(tier, { targetRole, seniority, emphasis }),
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            ...(jobDescription
              ? [
                  {
                    type: "text" as const,
                    text: `Job posting the candidate is applying to:\n\n${jobDescription}`,
                  },
                ]
              : []),
            {
              type: "text",
              text: jobDescription
                ? "Run the full ATS screening on this resume against the job posting above, applying the checkpoint criteria exactly and citing evidence in every detail."
                : "Run the full ATS screening on this resume, applying the checkpoint criteria exactly and citing evidence in every detail.",
            },
          ],
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json(
        { error: "The screener could not analyze this document" },
        { status: 502 },
      );
    }

    const parsed = response.parsed_output;

    if (!parsed.isResume) {
      return Response.json(
        {
          error:
            parsed.documentIssue ??
            "This doesn't appear to be a readable resume",
        },
        { status: 422 },
      );
    }

    const checks = normalizeChecks(parsed.checks);
    const result: AnalysisResult = {
      passenger: parsed.passenger,
      role: parsed.role,
      company: parsed.company,
      summary: parsed.summary,
      checks,
      atsScore: computeScore(checks),
      matchedKeywords: jobDescription ? parsed.matchedKeywords.slice(0, 12) : [],
      missingKeywords: jobDescription ? parsed.missingKeywords.slice(0, 12) : [],
    };

    return Response.json(result);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Invalid API key" }, { status: 500 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Screener is at capacity — try again in a minute" },
        { status: 429 },
      );
    }
    console.error("Analysis failed:", err);
    return Response.json(
      { error: "Analysis failed — please try again" },
      { status: 500 },
    );
  }
}
