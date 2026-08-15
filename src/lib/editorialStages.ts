/**
 * Editorial stage machine.
 *
 * `submissions.workflow_stage` keeps the five OJS top-level stages, while
 * `submissions.status` carries the fine-grained editorial state below.
 * Every transition is validated here and written to the audit trail.
 */
export type WorkflowStage =
  | "submission"
  | "review"
  | "copyediting"
  | "production"
  | "publication";

export type EditorialState =
  | "submitted"
  | "technical_check"
  | "editorial_assessment"
  | "editor_assigned"
  | "reviewer_invitation"
  | "peer_review"
  | "revision_requested"
  | "re_review"
  | "decision_pending"
  | "accepted"
  | "rejected"
  | "copyediting"
  | "production"
  | "proof"
  | "published";

export interface StateDef {
  key: EditorialState;
  label: string;
  stage: WorkflowStage;
  /** Author-facing plain-language description. */
  description: string;
  next: EditorialState[];
}

export const EDITORIAL_STATES: StateDef[] = [
  {
    key: "submitted",
    label: "Submitted",
    stage: "submission",
    description: "Manuscript received and queued for technical screening.",
    next: ["technical_check", "rejected"],
  },
  {
    key: "technical_check",
    label: "Technical Check",
    stage: "submission",
    description: "Files, formatting and declarations are being screened.",
    next: ["editorial_assessment", "revision_requested", "rejected"],
  },
  {
    key: "editorial_assessment",
    label: "Editorial Assessment",
    stage: "submission",
    description: "Scope and quality assessment by the editorial office.",
    next: ["editor_assigned", "rejected"],
  },
  {
    key: "editor_assigned",
    label: "Editor Assigned",
    stage: "submission",
    description: "A handling editor is responsible for the manuscript.",
    next: ["reviewer_invitation", "rejected"],
  },
  {
    key: "reviewer_invitation",
    label: "Reviewer Invitation",
    stage: "review",
    description: "Reviewers are being invited to assess the manuscript.",
    next: ["peer_review", "rejected"],
  },
  {
    key: "peer_review",
    label: "Peer Review",
    stage: "review",
    description: "Reviewers are evaluating the manuscript.",
    next: ["decision_pending", "revision_requested"],
  },
  {
    key: "revision_requested",
    label: "Revision Requested",
    stage: "review",
    description: "Authors have been asked to revise and resubmit.",
    next: ["re_review", "decision_pending", "rejected"],
  },
  {
    key: "re_review",
    label: "Re-review",
    stage: "review",
    description: "The revised manuscript is being re-assessed.",
    next: ["decision_pending", "revision_requested"],
  },
  {
    key: "decision_pending",
    label: "Decision Pending",
    stage: "review",
    description: "The editor is preparing a final decision.",
    next: ["accepted", "rejected", "revision_requested"],
  },
  {
    key: "accepted",
    label: "Accepted",
    stage: "review",
    description: "The manuscript has been accepted for publication.",
    next: ["copyediting"],
  },
  {
    key: "rejected",
    label: "Rejected",
    stage: "review",
    description: "The manuscript was not accepted.",
    next: [],
  },
  {
    key: "copyediting",
    label: "Copyediting",
    stage: "copyediting",
    description: "Language and reference editing in progress.",
    next: ["production"],
  },
  {
    key: "production",
    label: "Production",
    stage: "production",
    description: "Typesetting and galley preparation.",
    next: ["proof"],
  },
  {
    key: "proof",
    label: "Proof",
    stage: "production",
    description: "Author proof review before publication.",
    next: ["published"],
  },
  {
    key: "published",
    label: "Published",
    stage: "publication",
    description: "The article is published in an issue.",
    next: [],
  },
];

const byKey = new Map(EDITORIAL_STATES.map((s) => [s.key, s]));

/** Legacy / loose status strings mapped onto the machine. */
const ALIASES: Record<string, EditorialState> = {
  pending: "submitted",
  pending_review: "technical_check",
  under_review: "peer_review",
  in_review: "peer_review",
  revisions_requested: "revision_requested",
  resubmitted: "re_review",
  declined: "rejected",
  draft: "submitted",
};

export function resolveState(status?: string | null): EditorialState {
  const key = (status ?? "").toLowerCase();
  if (byKey.has(key as EditorialState)) return key as EditorialState;
  return ALIASES[key] ?? "submitted";
}

export function getStateDef(status?: string | null): StateDef {
  return byKey.get(resolveState(status))!;
}

export function nextStates(status?: string | null): StateDef[] {
  return getStateDef(status).next.map((k) => byKey.get(k)!);
}

export function canTransition(from: string | null | undefined, to: EditorialState) {
  return getStateDef(from).next.includes(to);
}

/** Ordered states used for author-facing timelines (happy path). */
export const HAPPY_PATH: EditorialState[] = [
  "submitted",
  "technical_check",
  "editorial_assessment",
  "editor_assigned",
  "reviewer_invitation",
  "peer_review",
  "decision_pending",
  "accepted",
  "copyediting",
  "production",
  "proof",
  "published",
];

export const DECISIONS = [
  { key: "accept", label: "Accept", to: "accepted" as EditorialState },
  { key: "minor_revisions", label: "Minor Revision", to: "revision_requested" as EditorialState },
  { key: "major_revisions", label: "Major Revision", to: "revision_requested" as EditorialState },
  { key: "reject", label: "Reject", to: "rejected" as EditorialState },
];

export function auditActionLabel(action: string) {
  const map: Record<string, string> = {
    submission_created: "Submission created",
    submission_submitted: "Manuscript submitted",
    state_changed: "Editorial state changed",
    stage_changed: "Workflow stage changed",
    decision_recorded: "Editorial decision recorded",
    editor_assigned: "Editorial role assigned",
    review_type_changed: "Review model changed",
    file_uploaded: "File uploaded",
    reviewer_assigned: "Reviewer assigned",
    review_submitted: "Review submitted",
  };
  return map[action] ?? action.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}