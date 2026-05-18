/**
 * Wraps DOIs, PMIDs, and bare http(s) URLs inside reference HTML with
 * clickable anchors pointing to doi.org / pubmed / the URL itself.
 * Pure string transform — runs before DOMPurify so the resulting <a>
 * tags are validated by the existing sanitize allow-list.
 */
const DOI_RE = /\b(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)\b/gi;
const PMID_RE = /\bPMID:\s*(\d{4,9})\b/gi;
const URL_RE = /(?<!["'>])\b(https?:\/\/[^\s<"']+)/gi;

export function linkifyReferences(html: string): string {
  if (!html) return html;
  let out = html;

  // Skip linkification inside existing <a> tags by splitting on them
  const parts = out.split(/(<a\b[^>]*>.*?<\/a>)/gis);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith("<a")) continue;
    parts[i] = parts[i]
      .replace(DOI_RE, (_m, doi) =>
        `<a href="https://doi.org/${doi}" target="_blank" rel="noopener noreferrer">${doi}</a>`
      )
      .replace(PMID_RE, (_m, pmid) =>
        `PMID: <a href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener noreferrer">${pmid}</a>`
      )
      .replace(URL_RE, (m) =>
        `<a href="${m}" target="_blank" rel="noopener noreferrer">${m}</a>`
      );
  }
  return parts.join("");
}