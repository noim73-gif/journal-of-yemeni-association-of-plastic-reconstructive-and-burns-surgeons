import type { DraftState } from "@/hooks/useSubmissionDraft";
import { FILE_SLOTS } from "@/lib/submissionFiles";
import { designRequiresTrialRegistration, recommendGuideline } from "@/lib/reportingGuidelines";

export interface ChecklistItem {
  key: string;
  label: string;
  required: boolean;
  passed: boolean;
  hint?: string;
  step: number;
}

export function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).filter(Boolean).length : 0;
}

export function requiresEthics(code: string | null) {
  return [
    "original_research",
    "case_report",
    "case_series",
    "short_communication",
  ].includes(code ?? "");
}

export function requiresTrialRegistration(d: DraftState) {
  return designRequiresTrialRegistration(d.studyDesign);
}

/** Full compliance checklist — the single source of truth for step 7 and submit. */
export function buildChecklist(d: DraftState): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const decl = d.declarations;
  const guideline = d.reportingGuideline ?? recommendGuideline(d.articleTypeCode, d.studyDesign).code;

  items.push({
    key: "article_type",
    label: "Article type selected",
    required: true,
    passed: !!d.articleTypeId,
    step: 1,
  });
  items.push({
    key: "title",
    label: "Manuscript title provided",
    required: true,
    passed: d.title.trim().length > 4,
    step: 2,
  });
  items.push({
    key: "abstract",
    label: "Abstract provided",
    required: true,
    passed: wordCount(d.abstract) > 0 || d.articleTypeCode === "editorial" || d.articleTypeCode === "letter_to_editor",
    step: 2,
  });
  items.push({
    key: "keywords",
    label: "At least three keywords provided",
    required: true,
    passed: d.keywords.split(",").map((k) => k.trim()).filter(Boolean).length >= 3,
    hint: "Separate keywords with commas.",
    step: 2,
  });
  items.push({
    key: "word_count",
    label: "Manuscript word count entered",
    required: true,
    passed: !!d.wordCount && Number(d.wordCount) > 0,
    step: 2,
  });
  items.push({
    key: "language",
    label: "Manuscript language selected",
    required: true,
    passed: !!d.language,
    step: 2,
  });
  items.push({
    key: "authors_complete",
    label: "Author information complete (name, affiliation, country, email)",
    required: true,
    passed:
      d.authors.length > 0 &&
      d.authors.every(
        (a) =>
          a.name?.trim() &&
          (a.institution ?? a.affiliation ?? "").trim() &&
          (a.country ?? "").trim() &&
          (a.email ?? "").trim()
      ),
    step: 3,
  });
  items.push({
    key: "corresponding_author",
    label: "Corresponding author identified with an email address",
    required: true,
    passed: d.authors.some((a) => a.corresponding && (a.email ?? "").trim().length > 3),
    step: 3,
  });
  items.push({
    key: "credit_roles",
    label: "CRediT contribution roles assigned to every author",
    required: true,
    passed: d.authors.every((a) => (a.creditRoles?.length ?? 0) > 0),
    step: 3,
  });

  for (const slot of FILE_SLOTS.filter((s) => s.required)) {
    items.push({
      key: `file_${slot.slot}`,
      label: `${slot.label} uploaded`,
      required: true,
      passed: (d.files[slot.slot]?.length ?? 0) > 0,
      step: 4,
    });
  }

  if (requiresEthics(d.articleTypeCode)) {
    items.push({
      key: "ethics",
      label: "Ethics approval confirmed or explicitly not applicable",
      required: true,
      passed: decl.ethicsApproval || decl.ethicsNotApplicable,
      step: 5,
    });
    items.push({
      key: "consent",
      label: "Informed consent confirmed or explicitly not applicable",
      required: true,
      passed: decl.informedConsent || decl.consentNotApplicable,
      step: 5,
    });
  }

  items.push({
    key: "coi",
    label: "Conflict of interest declared",
    required: true,
    passed: decl.conflictOfInterest && d.conflictOfInterestStatement.trim().length > 0,
    step: 5,
  });
  items.push({
    key: "funding",
    label: "Funding declared",
    required: true,
    passed: decl.fundingDisclosed && d.fundingStatement.trim().length > 0,
    step: 5,
  });
  items.push({
    key: "data_availability",
    label: "Data availability statement provided",
    required: true,
    passed: decl.dataAvailability && d.dataAvailabilityStatement.trim().length > 0,
    step: 5,
  });
  items.push({
    key: "contributions",
    label: "Author contributions confirmed (ICMJE criteria)",
    required: true,
    passed: decl.authorContributions,
    step: 5,
  });
  items.push({
    key: "originality",
    label: "Not published or under review elsewhere",
    required: true,
    passed: decl.notPublishedElsewhere,
    step: 5,
  });
  items.push({
    key: "plagiarism",
    label: "Originality and no plagiarism confirmed",
    required: true,
    passed: decl.noPlagiarism,
    step: 5,
  });
  items.push({
    key: "ai_disclosure",
    label: "AI-assisted writing declared",
    required: true,
    passed: !decl.aiAssistanceUsed || (decl.aiAssistanceDeclared && d.aiDisclosure.trim().length > 0),
    hint: "If any generative AI tool was used, describe how in the declaration field.",
    step: 5,
  });

  if (requiresTrialRegistration(d)) {
    items.push({
      key: "trial_registration",
      label: "Clinical trial registration number provided",
      required: true,
      passed: d.trialRegistrationId.trim().length > 0 && d.trialRegistry.trim().length > 0,
      step: 2,
    });
  }

  items.push({
    key: "reporting_guideline",
    label:
      guideline === "NONE"
        ? "Reporting guideline reviewed (none required for this article type)"
        : `${guideline} reporting guideline acknowledged`,
    required: true,
    passed: d.guidelineAcknowledged,
    step: 6,
  });
  if (guideline !== "NONE") {
    items.push({
      key: "checklist_upload",
      label: `${guideline} checklist uploaded`,
      required: false,
      passed: (d.files.reporting_checklist?.length ?? 0) > 0,
      hint: "Strongly recommended — editors may request it during technical check.",
      step: 4,
    });
  }
  items.push({
    key: "references",
    label: "Reference list included in the manuscript",
    required: true,
    passed: !!d.finalConfirmations.references,
    step: 7,
  });
  items.push({
    key: "format",
    label: "Manuscript follows the journal formatting requirements",
    required: true,
    passed: !!d.finalConfirmations.format,
    step: 7,
  });
  items.push({
    key: "blinding",
    label: "Author-identifying information removed from the main manuscript",
    required: true,
    passed: !!d.finalConfirmations.blinding,
    step: 7,
  });

  return items;
}

export function checklistBlockers(d: DraftState) {
  return buildChecklist(d).filter((i) => i.required && !i.passed);
}

/** Per-step gate used by the wizard's Continue button. */
export function validateStep(step: number, d: DraftState): string | null {
  const items = buildChecklist(d).filter((i) => i.step === step && i.required && !i.passed);
  if (step === 7) return null;
  if (items.length) return items[0].label + " is still required.";
  return null;
}
