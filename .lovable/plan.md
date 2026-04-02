

# Plan: ISSN Display, Google Scholar Meta Tags, and Sitemap

## Overview
Three improvements for SEO and academic indexing compliance: display ISSN in header/footer, add citation meta tags to article pages, and generate a static sitemap.xml.

---

## 1. Add ISSN Display to Header and Footer

**Header** (`src/components/Header.tsx`):
- Add a small ISSN badge/text below the logo area: `ISSN: XXXX-XXXX` (placeholder until the real ISSN is assigned)

**Footer** (`src/components/Footer.tsx`):
- Add ISSN display in the brand column, below the journal description

> Note: A placeholder ISSN like `XXXX-XXXX` will be used. You can update it once you receive your real ISSN from the ISSN International Centre.

## 2. Google Scholar Citation Meta Tags on Article Pages

**File**: `src/pages/Article.tsx`

Use `react-helmet-async` (or a `useEffect` with direct DOM manipulation to avoid adding a dependency) to inject `<meta>` tags into `<head>` when an article is loaded:

- `citation_title` — article title
- `citation_author` — each author (split by comma, one tag per author)
- `citation_publication_date` — published_at date
- `citation_journal_title` — "Yemeni Journal of Plastic, Reconstructive and Burn Surgery"
- `citation_volume` — volume
- `citation_issue` — issue
- `citation_doi` — DOI
- `citation_issn` — ISSN
- `citation_abstract` — abstract

Tags will be added on mount and cleaned up on unmount via `useEffect`.

## 3. Generate Static sitemap.xml

**File**: `public/sitemap.xml`

Create a static sitemap covering all known routes:
- `/` (home)
- `/articles`, `/archive`, `/about`, `/contact`
- `/submit`, `/author-guidelines`, `/peer-review`
- `/publication-ethics`, `/open-access`, `/faq`
- `/editorial-board`, `/become-reviewer`, `/auth`

Dynamic article URLs cannot be included in a static file. A comment will note that for full dynamic sitemap generation, an edge function would be needed.

Also update `public/robots.txt` to reference the sitemap.

---

## Technical Details

| Change | File(s) | Approach |
|--------|---------|----------|
| ISSN in header | `src/components/Header.tsx` | Small text under logo |
| ISSN in footer | `src/components/Footer.tsx` | Text in brand column |
| Citation meta tags | `src/pages/Article.tsx` | `useEffect` with DOM manipulation (no new dependency) |
| Sitemap | `public/sitemap.xml` | Static XML file with known routes |
| Robots.txt update | `public/robots.txt` | Add `Sitemap:` directive |

