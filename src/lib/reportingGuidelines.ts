export interface ReportingGuideline {
  code: string;
  name: string;
  scope: string;
  url: string;
}

export const REPORTING_GUIDELINES: Record<string, ReportingGuideline> = {
  "PRISMA 2020": {
    code: "PRISMA 2020",
    name: "PRISMA 2020",
    scope: "Systematic reviews and meta-analyses",
    url: "https://www.prisma-statement.org/",
  },
  CONSORT: {
    code: "CONSORT",
    name: "CONSORT 2010",
    scope: "Randomised controlled trials",
    url: "https://www.equator-network.org/reporting-guidelines/consort/",
  },
  STROBE: {
    code: "STROBE",
    name: "STROBE",
    scope: "Observational studies (cohort, case-control, cross-sectional)",
    url: "https://www.strobe-statement.org/",
  },
  STARD: {
    code: "STARD",
    name: "STARD 2015",
    scope: "Diagnostic accuracy studies",
    url: "https://www.equator-network.org/reporting-guidelines/stard/",
  },
  CARE: {
    code: "CARE",
    name: "CARE",
    scope: "Case reports and case series",
    url: "https://www.care-statement.org/",
  },
  RIGHT: {
    code: "RIGHT",
    name: "RIGHT",
    scope: "Clinical practice guidelines",
    url: "https://www.equator-network.org/reporting-guidelines/right-statement/",
  },
  COREQ: {
    code: "COREQ",
    name: "COREQ",
    scope: "Qualitative research (interviews and focus groups)",
    url: "https://www.equator-network.org/reporting-guidelines/coreq/",
  },
  "TRIPOD+AI": {
    code: "TRIPOD+AI",
    name: "TRIPOD+AI",
    scope: "Prediction model and AI studies",
    url: "https://www.equator-network.org/reporting-guidelines/tripod-statement/",
  },
  NONE: {
    code: "NONE",
    name: "No specific guideline",
    scope: "Editorials, letters and narrative articles",
    url: "https://www.equator-network.org/",
  },
};

/** Study designs offered for article types where the guideline depends on design. */
export const STUDY_DESIGNS: { value: string; label: string; guideline: string }[] = [
  { value: "rct", label: "Randomised controlled trial", guideline: "CONSORT" },
  { value: "observational", label: "Observational study (cohort / case-control / cross-sectional)", guideline: "STROBE" },
  { value: "diagnostic", label: "Diagnostic accuracy study", guideline: "STARD" },
  { value: "qualitative", label: "Qualitative study", guideline: "COREQ" },
  { value: "prediction", label: "Prediction model / AI study", guideline: "TRIPOD+AI" },
  { value: "basic_science", label: "Laboratory / basic science study", guideline: "NONE" },
  { value: "other", label: "Other design", guideline: "NONE" },
];

/**
 * Recommend a reporting guideline from the article type and (where relevant)
 * the declared study design.
 */
export function recommendGuideline(
  articleTypeCode: string | null,
  studyDesign?: string | null
): ReportingGuideline {
  switch (articleTypeCode) {
    case "systematic_review":
    case "meta_analysis":
      return REPORTING_GUIDELINES["PRISMA 2020"];
    case "case_report":
    case "case_series":
      return REPORTING_GUIDELINES.CARE;
    case "clinical_guideline":
      return REPORTING_GUIDELINES.RIGHT;
    case "original_research":
    case "short_communication": {
      const design = STUDY_DESIGNS.find((d) => d.value === studyDesign);
      return REPORTING_GUIDELINES[design?.guideline ?? "STROBE"] ?? REPORTING_GUIDELINES.STROBE;
    }
    default:
      return REPORTING_GUIDELINES.NONE;
  }
}

export function designRequiresTrialRegistration(studyDesign?: string | null) {
  return studyDesign === "rct";
}
