

# Expert Evaluation: YJPRBS Journal Website (April 2026)

## Overall Assessment

The website has matured significantly — ISSN is correctly displayed, broken links are fixed, JSON-LD structured data exists, citation meta tags are injected, and the editorial workflow follows OJS conventions. However, several issues remain that affect professional credibility and indexing readiness.

---

## Critical Issues

### 1. index.html Still Shows Wrong Journal Name
`index.html` title says "Journal of Plastic & Reconstructive Surgery | JPRS" with description referencing "since 1946" and author "JPRS". OG tags also reference "JPRS". This is the wrong journal — it should say YJPRBS with the correct description. Every search engine sees this as the primary metadata.

**Files**: `index.html`

### 2. "Current Issue" Nav Links to Generic /articles
Both "Current Issue" and "Articles" in the header nav point to `/articles`. "Current Issue" should link to `/articles?issue=current` or filter to the latest published issue automatically.

**Files**: `Header.tsx`, potentially `Articles.tsx`

---

## High Priority

### 3. No favicon
The site uses no custom favicon — browsers show a generic icon, which hurts brand recognition in tabs, bookmarks, and search results.

**Files**: `index.html`, add favicon asset

### 4. Footer Uses `<a href>` Instead of React Router `<Link>`
All footer links use plain `<a>` tags which cause full page reloads. Should use React Router `<Link>` for internal routes.

**Files**: `Footer.tsx`

### 5. No "Article Not Found" Helpful Navigation
When visiting `/article/invalid-uuid`, the page shows a basic error but lacks a back button, search suggestion, or link to browse articles.

**Files**: `Article.tsx`

### 6. OG Image Is Generic Lovable Placeholder
`index.html` line 13 and 17 reference `https://lovable.dev/opengraph-image-p98pqg.png` — should use the journal's own logo or a branded OG image.

**Files**: `index.html`

---

## Medium Priority

### 7. Article View Count Not Displayed
The `view_count` column exists and is incremented, but the count is never shown to readers on the article page.

**Files**: `Article.tsx`

### 8. No "Received / Accepted / Published" Date Display
Academic articles should show submission received date, acceptance date, and publication date. Only `published_at` is displayed currently.

**Files**: `Article.tsx` (display), database (may need `received_at`, `accepted_at` columns on `articles` table)

### 9. No Email Notification on Submission
The `send-submission-notification` edge function exists but it's unclear if it's wired to the submission flow.

---

## Recommended Implementation Plan

### Phase 1: Credibility & SEO (Quick Wins)
| Change | File(s) |
|--------|---------|
| Fix index.html title, description, OG tags to YJPRBS | `index.html` |
| Fix "Current Issue" nav to filter latest issue | `Header.tsx`, `Articles.tsx` |
| Convert footer `<a>` to React Router `<Link>` | `Footer.tsx` |
| Add journal logo as favicon | `index.html`, add `public/favicon.png` |

### Phase 2: Article Page Polish
| Change | File(s) |
|--------|---------|
| Show view count on article page | `Article.tsx` |
| Improve "Article Not Found" with navigation links | `Article.tsx` |
| Replace generic OG image with journal branding | `index.html` |

### Phase 3: Data Completeness
| Change | File(s) |
|--------|---------|
| Add received/accepted dates to articles table & display | DB migration + `Article.tsx` |
| Verify submission notification edge function is wired | `Submit.tsx` |

