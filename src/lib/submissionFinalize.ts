import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import type { DraftState } from "@/hooks/useSubmissionDraft";
import { buildChecklist } from "@/lib/submissionValidation";

/** Append an entry to the immutable submission audit trail. */
export async function logAudit(params: {
  submissionId: string;
  actorId: string;
  action: string;
  from?: string | null;
  to?: string | null;
  details?: Record<string, unknown>;
  actorRole?: string;
}) {
  const { error } = await supabase.from("submission_audit_log").insert({
    submission_id: params.submissionId,
    actor_id: params.actorId,
    actor_role: params.actorRole ?? null,
    action: params.action,
    from_value: params.from ?? null,
    to_value: params.to ?? null,
    details: params.details ? JSON.parse(JSON.stringify(params.details)) : null,
  });
  if (error) logger.error("Failed to write audit entry", error);
}

/**
 * Normalise a wizard draft into the relational submission tables:
 * authors, declarations, checklist, typed files. Safe to call repeatedly.
 */
export async function normalizeSubmission(
  submissionId: string,
  draft: DraftState,
  userId: string
) {
  // --- Authors ---
  await supabase.from("submission_authors").delete().eq("submission_id", submissionId);
  const authorRows = draft.authors
    .filter((a) => a.name?.trim())
    .map((a, i) => ({
      submission_id: submissionId,
      full_name: a.name.trim(),
      degree: a.degree || null,
      orcid_id: a.orcid || null,
      department: a.department || null,
      institution: a.institution || a.affiliation || null,
      country: a.country || null,
      email: a.email || null,
      author_role: a.role || "Author",
      credit_roles: a.creditRoles ?? [],
      is_corresponding: !!a.corresponding,
      display_order: i,
    }));
  if (authorRows.length) {
    const { error } = await supabase.from("submission_authors").insert(authorRows);
    if (error) logger.error("Failed to save submission authors", error);
  }

  // --- Declarations ---
  const d = draft.declarations;
  const { error: declError } = await supabase.from("submission_declarations").upsert(
    {
      submission_id: submissionId,
      ethics_approval: d.ethicsApproval,
      ethics_not_applicable: d.ethicsNotApplicable,
      informed_consent: d.informedConsent,
      consent_not_applicable: d.consentNotApplicable,
      conflict_of_interest: d.conflictOfInterest,
      funding_disclosed: d.fundingDisclosed,
      data_availability: d.dataAvailability,
      author_contributions: d.authorContributions,
      acknowledgments_confirmed: d.acknowledgmentsConfirmed,
      ai_assistance_used: d.aiAssistanceUsed,
      ai_assistance_declared: d.aiAssistanceDeclared,
      trial_registration_confirmed: d.trialRegistrationConfirmed,
      not_published_elsewhere: d.notPublishedElsewhere,
      no_plagiarism: d.noPlagiarism,
    },
    { onConflict: "submission_id" }
  );
  if (declError) logger.error("Failed to save declarations", declError);

  // --- Checklist snapshot ---
  const checklist = buildChecklist(draft).map((i) => ({
    submission_id: submissionId,
    item_key: i.key,
    label: i.label,
    is_required: i.required,
    passed: i.passed,
    confirmed_at: i.passed ? new Date().toISOString() : null,
  }));
  if (checklist.length) {
    const { error } = await supabase
      .from("submission_checklist_items")
      .upsert(checklist, { onConflict: "submission_id,item_key" });
    if (error) logger.error("Failed to save checklist", error);
  }

  // --- Typed files ---
  const { data: existing } = await supabase
    .from("submission_files")
    .select("file_url")
    .eq("submission_id", submissionId);
  const known = new Set((existing ?? []).map((f) => f.file_url));
  const fileRows = Object.entries(draft.files).flatMap(([slot, refs]) =>
    (refs ?? [])
      .filter((r) => !known.has(r.path))
      .map((r) => ({
        submission_id: submissionId,
        file_url: r.path,
        file_name: r.name,
        file_type: slot,
        version: 1,
        stage: "submission",
        uploaded_by: userId,
      }))
  );
  if (fileRows.length) {
    const { error } = await supabase.from("submission_files").insert(fileRows);
    if (error) logger.error("Failed to save submission files", error);
  }
}
