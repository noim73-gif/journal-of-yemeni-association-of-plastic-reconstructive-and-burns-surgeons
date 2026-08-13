/** CRediT (Contributor Roles Taxonomy) — 14 standard contributor roles. */
export const CREDIT_ROLES = [
  "Conceptualization",
  "Data curation",
  "Formal analysis",
  "Funding acquisition",
  "Investigation",
  "Methodology",
  "Project administration",
  "Resources",
  "Software",
  "Supervision",
  "Validation",
  "Visualization",
  "Writing – original draft",
  "Writing – review & editing",
] as const;

export const AUTHOR_ROLES = [
  "Author",
  "Corresponding author",
  "Senior author",
  "Collaborator",
  "Statistician",
  "Group author representative",
] as const;

export const MANUSCRIPT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];
