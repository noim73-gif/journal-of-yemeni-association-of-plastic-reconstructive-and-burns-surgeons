// JATS 1.2 builder for published articles.
export function escapeXml(text: unknown): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function stripHtml(html: unknown): string {
  if (!html) return "";
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export interface ParsedAuthor {
  given: string;
  surname: string;
  orcid?: string;
}

export function parseAuthors(authorsStr: string | null): ParsedAuthor[] {
  if (!authorsStr) return [];
  return authorsStr
    .split(/,| and /i)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const orcid = raw.match(/\[ORCID:\s*([0-9-]{19})\s*\]/i)?.[1];
      const parts = raw.replace(/\[ORCID:[^\]]+\]/i, "").trim().split(/\s+/);
      const surname = parts.pop() || "";
      return { given: parts.join(" "), surname, orcid };
    });
}

export const JOURNAL = {
  title: "Yemeni Journal of Plastic, Reconstructive and Burn Surgery",
  abbrev: "Yemeni J Plast Reconstr Burn Surg",
  publisherId: "YJPRBS",
  publisher: "Yemeni Association of Plastic, Reconstructive and Burns Surgeons",
  eissn: "3009-6316",
};

// deno-lint-ignore no-explicit-any
type Row = Record<string, any>;

export function buildJats(article: Row, issue: Row | null): string {
  const authors = parseAuthors(article.authors);
  const pub = article.published_at ? new Date(article.published_at) : new Date();
  const keywords: string[] = article.keywords || [];
  const volume = issue?.volume ?? article.volume;
  const number = issue?.number ?? article.issue;

  const sections = [
    { id: "intro", title: "Introduction", content: article.introduction },
    { id: "methods", title: "Methods", content: article.methods },
    { id: "results", title: "Results", content: article.results },
    { id: "discussion", title: "Discussion", content: article.discussion },
  ].filter((s) => stripHtml(s.content));

  const paras = (content: unknown) =>
    stripHtml(content)
      .split(/\n+/)
      .filter((p) => p.trim())
      .map((p) => `<p>${escapeXml(p.trim())}</p>`)
      .join("\n");

  const refs = stripHtml(article.references)
    .split(/\n+/)
    .map((r) => r.trim())
    .filter(Boolean);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.2 20190208//EN" "JATS-archivearticle1-mathml3.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML" article-type="research-article" dtd-version="1.2" xml:lang="en">
<front>
<journal-meta>
<journal-id journal-id-type="publisher-id">${JOURNAL.publisherId}</journal-id>
<journal-title-group>
<journal-title>${JOURNAL.title}</journal-title>
<abbrev-journal-title abbrev-type="publisher">${JOURNAL.abbrev}</abbrev-journal-title>
</journal-title-group>
<issn pub-type="epub">${JOURNAL.eissn}</issn>
<publisher><publisher-name>${JOURNAL.publisher}</publisher-name></publisher>
</journal-meta>
<article-meta>
${article.doi ? `<article-id pub-id-type="doi">${escapeXml(article.doi)}</article-id>` : ""}
<article-id pub-id-type="publisher-id">${escapeXml(article.id)}</article-id>
${article.category ? `<article-categories><subj-group subj-group-type="heading"><subject>${escapeXml(article.category)}</subject></subj-group></article-categories>` : ""}
<title-group><article-title>${escapeXml(article.title)}</article-title></title-group>
${
    authors.length
      ? `<contrib-group>
${authors
          .map(
            (a, i) => `<contrib contrib-type="author"${i === 0 ? ' corresp="yes"' : ""}>
${a.orcid ? `<contrib-id contrib-id-type="orcid">https://orcid.org/${escapeXml(a.orcid)}</contrib-id>` : ""}
<name><surname>${escapeXml(a.surname)}</surname><given-names>${escapeXml(a.given)}</given-names></name>
</contrib>`,
          )
          .join("\n")}
</contrib-group>`
      : ""
  }
<pub-date pub-type="epub" iso-8601-date="${pub.toISOString().slice(0, 10)}">
<day>${String(pub.getUTCDate()).padStart(2, "0")}</day>
<month>${String(pub.getUTCMonth() + 1).padStart(2, "0")}</month>
<year>${pub.getUTCFullYear()}</year>
</pub-date>
${volume ? `<volume>${escapeXml(volume)}</volume>` : ""}
${number ? `<issue>${escapeXml(number)}</issue>` : ""}
${article.pages ? `<fpage>${escapeXml(String(article.pages).split("-")[0])}</fpage>${String(article.pages).includes("-") ? `<lpage>${escapeXml(String(article.pages).split("-")[1])}</lpage>` : ""}` : ""}
<permissions>
<copyright-year>${pub.getUTCFullYear()}</copyright-year>
<copyright-holder>${JOURNAL.publisher}</copyright-holder>
<license license-type="open-access" xlink:href="https://creativecommons.org/licenses/by/4.0/">
<license-p>This is an open access article distributed under the terms of the Creative Commons Attribution 4.0 International License.</license-p>
</license>
</permissions>
${article.abstract ? `<abstract>\n${paras(article.abstract)}\n</abstract>` : ""}
${keywords.length ? `<kwd-group kwd-group-type="author">\n${keywords.map((k) => `<kwd>${escapeXml(k)}</kwd>`).join("\n")}\n</kwd-group>` : ""}
</article-meta>
</front>
<body>
${
    sections.length
      ? sections
        .map((s) => `<sec id="${s.id}" sec-type="${s.id}">\n<title>${s.title}</title>\n${paras(s.content)}\n</sec>`)
        .join("\n")
      : `<sec>\n${paras(article.content)}\n</sec>`
  }
</body>
${
    refs.length
      ? `<back>
<ref-list>
<title>References</title>
${refs.map((r, i) => `<ref id="ref${i + 1}"><mixed-citation>${escapeXml(r)}</mixed-citation></ref>`).join("\n")}
</ref-list>
</back>`
      : ""
  }
</article>`;
}