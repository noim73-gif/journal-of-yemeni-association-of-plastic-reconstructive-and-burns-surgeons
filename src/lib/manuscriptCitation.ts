/**
 * Citation builders for manuscripts that already carry a DOI but are not yet
 * published in an issue. Pre-publication records are cited as "in review /
 * ahead of publication" with the journal as the institution.
 */
export const JOURNAL_NAME = "Yemeni Journal of Plastic, Reconstructive and Burn Surgery";
export const DOI_RESOLVER = "https://doi.org/";

export interface CitableManuscript {
  title: string;
  authors: string | null;
  submission_doi: string | null;
  permalink_slug: string | null;
  submitted_at: string | null;
  doi_assigned_at?: string | null;
  status?: string | null;
  article_type?: string | null;
}

export function manuscriptPermalink(slug: string | null): string {
  if (!slug) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/ms/${slug}`;
}

export function manuscriptDoiUrl(doi: string | null): string {
  return doi ? `${DOI_RESOLVER}${doi}` : "";
}

function names(authors: string | null): string[] {
  if (!authors) return ["Unknown"];
  return authors
    .split(/,| and /i)
    .map((a) => a.replace(/\[ORCID:[^\]]+\]/i, "").trim())
    .filter(Boolean);
}

function year(m: CitableManuscript): string {
  const d = m.submitted_at || m.doi_assigned_at;
  return d ? String(new Date(d).getFullYear()) : "n.d.";
}

const apaName = (name: string) => {
  const p = name.trim().split(/\s+/);
  if (p.length === 1) return p[0];
  const last = p.pop()!;
  return `${last}, ${p.map((x) => `${x[0].toUpperCase()}.`).join(" ")}`;
};

const vancouverName = (name: string) => {
  const p = name.trim().split(/\s+/);
  if (p.length === 1) return p[0];
  const last = p.pop()!;
  return `${last} ${p.map((x) => x[0].toUpperCase()).join("")}`;
};

/** Human label for the pre-publication state used inside citations. */
export function citationStateLabel(status?: string | null): string {
  switch (status) {
    case "accepted":
      return "accepted manuscript, ahead of publication";
    case "revision_requested":
    case "revisions_requested":
      return "manuscript under revision";
    case "published":
      return "published";
    default:
      return "manuscript under peer review";
  }
}

export function manuscriptAPA(m: CitableManuscript): string {
  const a = names(m.authors);
  const authorStr =
    a.length > 7
      ? `${a.slice(0, 6).map(apaName).join(", ")}, ... ${apaName(a[a.length - 1])}`
      : a.map(apaName).join(", ");
  let out = `${authorStr} (${year(m)}). ${m.title} [${citationStateLabel(m.status)}]. ${JOURNAL_NAME}.`;
  if (m.submission_doi) out += ` ${manuscriptDoiUrl(m.submission_doi)}`;
  return out;
}

export function manuscriptVancouver(m: CitableManuscript): string {
  const a = names(m.authors);
  const authorStr =
    a.length > 6 ? `${a.slice(0, 6).map(vancouverName).join(", ")}, et al` : a.map(vancouverName).join(", ");
  let out = `${authorStr}. ${m.title}. ${JOURNAL_NAME}. ${year(m)} (${citationStateLabel(m.status)}).`;
  if (m.submission_doi) out += ` doi:${m.submission_doi}`;
  return out;
}

export function manuscriptHarvard(m: CitableManuscript): string {
  const a = names(m.authors);
  const authorStr = a.length > 3 ? `${apaName(a[0])} et al.` : a.map(apaName).join(", ");
  let out = `${authorStr} (${year(m)}) '${m.title}', ${JOURNAL_NAME}, ${citationStateLabel(m.status)}.`;
  if (m.submission_doi) out += ` doi: ${m.submission_doi}.`;
  return out;
}

export function manuscriptBibTeX(m: CitableManuscript): string {
  const a = names(m.authors);
  const key = `${a[0]?.split(/\s+/).pop()?.toLowerCase() || "unknown"}${year(m)}ms`;
  let bib = `@unpublished{${key},\n`;
  bib += `  title     = {${m.title}},\n`;
  bib += `  author    = {${a.join(" and ")}},\n`;
  bib += `  institution = {${JOURNAL_NAME}},\n`;
  bib += `  year      = {${year(m)}},\n`;
  bib += `  note      = {${citationStateLabel(m.status)}},\n`;
  if (m.submission_doi) bib += `  doi       = {${m.submission_doi}},\n`;
  if (m.permalink_slug) bib += `  url       = {${manuscriptPermalink(m.permalink_slug)}},\n`;
  bib += `}`;
  return bib;
}

export const MANUSCRIPT_CITATION_FORMATS = [
  { label: "APA", generate: manuscriptAPA },
  { label: "Vancouver", generate: manuscriptVancouver },
  { label: "Harvard", generate: manuscriptHarvard },
  { label: "BibTeX", generate: manuscriptBibTeX },
] as const;