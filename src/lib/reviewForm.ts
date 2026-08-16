/**
 * Peer review report definition.
 *
 * Reviews are captured per round and per workflow stage, so the same reviewer
 * can file a first-round report during `peer_review` and a second-round report
 * during `re_review` on the revised manuscript.
 */

export type ReviewStage = "peer_review" | "re_review" | "decision_pending";

export const REVIEW_STAGES: { key: ReviewStage; label: string; description: string }[] = [
  {
    key: "peer_review",
    label: "First review",
    description: "Initial assessment of the submitted manuscript.",
  },
  {
    key: "re_review",
    label: "Re-review",
    description: "Assessment of the revised manuscript against your earlier report.",
  },
  {
    key: "decision_pending",
    label: "Advisory review",
    description: "Additional opinion requested while the editor prepares a decision.",
  },
];

export function reviewStageLabel(stage?: string | null) {
  return REVIEW_STAGES.find((s) => s.key === stage)?.label ?? "Review";
}

export interface RatingCriterion {
  key:
    | "rating_originality"
    | "rating_methodology"
    | "rating_clarity"
    | "rating_significance"
    | "rating_ethics";
  label: string;
  help: string;
}

export const RATING_CRITERIA: RatingCriterion[] = [
  {
    key: "rating_originality",
    label: "Originality",
    help: "Novelty of the research question and contribution to the field.",
  },
  {
    key: "rating_methodology",
    label: "Methodology & statistics",
    help: "Study design, sample, analysis and reporting rigour.",
  },
  {
    key: "rating_clarity",
    label: "Clarity of presentation",
    help: "Structure, language, figures, tables and references.",
  },
  {
    key: "rating_significance",
    label: "Clinical significance",
    help: "Relevance to plastic, reconstructive and burns practice.",
  },
  {
    key: "rating_ethics",
    label: "Ethics & integrity",
    help: "Ethics approval, consent, trial registration and disclosures.",
  },
];

export const RATING_SCALE = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very good" },
  { value: 5, label: "Excellent" },
];

export const CONFIDENCE_SCALE = [
  { value: 1, label: "Low — outside my main expertise" },
  { value: 2, label: "Limited familiarity with the topic" },
  { value: 3, label: "Moderate — comfortable with most aspects" },
  { value: 4, label: "High — the topic is within my expertise" },
  { value: 5, label: "Very high — I work directly in this area" },
];

export const RECOMMENDATIONS = [
  { value: "accept", label: "Accept", help: "Ready for publication as submitted." },
  { value: "minor_revisions", label: "Minor revisions", help: "Small changes needed; no re-review required." },
  { value: "major_revisions", label: "Major revisions", help: "Substantial changes required and re-review needed." },
  { value: "reject", label: "Reject", help: "Not suitable for publication in this journal." },
];

export function recommendationLabel(value?: string | null) {
  return RECOMMENDATIONS.find((r) => r.value === value)?.label ?? value ?? "—";
}

export interface ReviewReport {
  recommendation: string;
  feedback: string;
  comments_to_editor: string;
  private_notes: string;
  competing_interests: string;
  confidence: number | null;
  rating_originality: number | null;
  rating_methodology: number | null;
  rating_clarity: number | null;
  rating_significance: number | null;
  rating_ethics: number | null;
}

export const EMPTY_REPORT: ReviewReport = {
  recommendation: "",
  feedback: "",
  comments_to_editor: "",
  private_notes: "",
  competing_interests: "",
  confidence: null,
  rating_originality: null,
  rating_methodology: null,
  rating_clarity: null,
  rating_significance: null,
  rating_ethics: null,
};

/** Blocking checks before a report can be filed. */
export function validateReport(report: ReviewReport): string[] {
  const errors: string[] = [];
  if (!report.recommendation) errors.push("Select an overall recommendation.");
  const missing = RATING_CRITERIA.filter((c) => !report[c.key]);
  if (missing.length) errors.push(`Rate every criterion (${missing.map((m) => m.label).join(", ")}).`);
  if (!report.confidence) errors.push("Indicate your confidence in this assessment.");
  if (report.feedback.trim().length < 50) {
    errors.push("Comments to the author must be at least 50 characters.");
  }
  return errors;
}

/** Mean of the completed criterion ratings, or null when none are set. */
export function averageRating(row: Partial<ReviewReport>): number | null {
  const values = RATING_CRITERIA.map((c) => row[c.key]).filter(
    (v): v is number => typeof v === "number" && v > 0
  );
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}