import { escapeXml as esc, JOURNAL, parseAuthors, stripHtml } from "./jats.ts";

// deno-lint-ignore no-explicit-any
type Row = Record<string, any>;

const BASE_CSS = `
@page { size: A4; margin: 22mm 18mm; }
* { box-sizing: border-box; }
body { font-family: "Times New Roman", Georgia, serif; color: #1a1a1a; margin: 0 auto; padding: 24px; max-width: 780px; line-height: 1.65; }
.masthead { display:flex; justify-content:space-between; align-items:flex-end; gap:16px; border-bottom:3px solid #1a365d; padding-bottom:10px; }
.masthead .j { font-size:13px; font-weight:700; color:#1a365d; text-transform:uppercase; letter-spacing:.06em; }
.masthead .m { font-size:10.5px; color:#666; text-align:right; }
h1 { font-size:22px; line-height:1.3; color:#12233d; margin:20px 0 10px; }
.authors { font-size:13.5px; color:#333; margin:0 0 4px; }
.affil, .dates { font-size:11px; color:#666; margin:2px 0; }
.abstract { background:#f5f7fa; border-left:3px solid #1a365d; padding:14px 16px; margin:18px 0; }
.abstract h2 { font-size:13px; text-transform:uppercase; letter-spacing:.08em; color:#1a365d; margin:0 0 6px; }
.abstract p { font-size:12.5px; margin:0 0 6px; }
.kw { font-size:11.5px; color:#444; margin-top:8px; }
h2.sec { font-size:15.5px; color:#12233d; margin:22px 0 8px; border-bottom:1px solid #e4e7ec; padding-bottom:4px; }
.body-text { font-size:13px; text-align:justify; }
.refs { font-size:11.5px; }
.refs ol { padding-left:18px; }
.refs li { margin-bottom:5px; }
footer { margin-top:28px; border-top:1px solid #ddd; padding-top:8px; font-size:10px; color:#888; text-align:center; }
.license { font-size:10.5px; color:#555; margin-top:14px; border:1px solid #e4e7ec; padding:8px 10px; }
`;

function masthead(article: Row, volume?: string | null, number?: string | null) {
  const pub = article.published_at ? new Date(article.published_at) : null;
  return `<div class="masthead">
  <div class="j">${JOURNAL.abbrev}</div>
  <div class="m">
    eISSN ${JOURNAL.eissn}${volume ? ` &middot; Vol. ${esc(volume)}${number ? `, No. ${esc(number)}` : ""}` : ""}${article.pages ? ` &middot; pp. ${esc(article.pages)}` : ""}<br/>
    ${article.doi ? `DOI: ${esc(article.doi)}` : ""}${pub ? ` &middot; ${pub.toISOString().slice(0, 10)}` : ""}
  </div>
</div>`;
}

function headBlock(article: Row) {
  const authors = parseAuthors(article.authors)
    .map((a) => `${a.given} ${a.surname}`.trim())
    .join(", ");
  const pub = article.published_at ? new Date(article.published_at) : null;
  const kws: string[] = article.keywords || [];
  return `<h1>${esc(article.title)}</h1>
${authors ? `<p class="authors">${esc(authors)}</p>` : ""}
${article.category ? `<p class="affil">${esc(article.category)}</p>` : ""}
${pub ? `<p class="dates">Published ${pub.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</p>` : ""}
${
    article.abstract
      ? `<div class="abstract"><h2>Abstract</h2>${
        stripHtml(article.abstract)
          .split(/\n+/)
          .filter(Boolean)
          .map((p) => `<p>${esc(p)}</p>`)
          .join("")
      }${kws.length ? `<div class="kw"><strong>Keywords:</strong> ${kws.map((k) => esc(k)).join("; ")}</div>` : ""}</div>`
      : ""
  }`;
}

const LICENSE = `<div class="license">Open access. &copy; ${new Date().getUTCFullYear()} ${JOURNAL.publisher}. Distributed under CC BY 4.0.</div>`;
const FOOT = `<footer>${JOURNAL.title} &middot; eISSN ${JOURNAL.eissn}</footer>`;

/** Cover / first page only — masthead, title, authors, abstract, keywords, license. */
export function buildPageOneHtml(article: Row, issue: Row | null): string {
  const volume = issue?.volume ?? article.volume;
  const number = issue?.number ?? article.issue;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(article.title)} — page 1</title>
<style>${BASE_CSS}</style></head>
<body>${masthead(article, volume, number)}${headBlock(article)}${LICENSE}${FOOT}</body></html>`;
}

/** Full print-ready article (browser print-to-PDF produces the typeset PDF). */
export function buildPrintHtml(article: Row, issue: Row | null, autoPrint = false): string {
  const volume = issue?.volume ?? article.volume;
  const number = issue?.number ?? article.issue;
  const sections = [
    ["1.", "Introduction", article.introduction],
    ["2.", "Methods", article.methods],
    ["3.", "Results", article.results],
    ["4.", "Discussion", article.discussion],
  ] as Array<[string, string, string | null]>;

  const hasStructured = sections.some(([, , c]) => stripHtml(c));
  const bodyHtml = hasStructured
    ? sections
      .filter(([, , c]) => stripHtml(c))
      .map(([n, t, c]) => `<h2 class="sec">${n} ${t}</h2><div class="body-text">${c}</div>`)
      .join("")
    : `<div class="body-text">${article.content ?? ""}</div>`;

  const refs = stripHtml(article.references)
    .split(/\n+/)
    .map((r) => r.trim())
    .filter(Boolean);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(article.title)}</title>
<style>${BASE_CSS}</style></head>
<body>${masthead(article, volume, number)}${headBlock(article)}${bodyHtml}
${
    refs.length
      ? `<h2 class="sec">References</h2><div class="refs"><ol>${refs.map((r) => `<li>${esc(r)}</li>`).join("")}</ol></div>`
      : ""
  }
${LICENSE}${FOOT}
${autoPrint ? `<script>window.addEventListener("load",()=>window.print());</script>` : ""}
</body></html>`;
}