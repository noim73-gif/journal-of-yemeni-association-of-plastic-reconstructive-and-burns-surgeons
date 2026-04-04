

# Expert Evaluation: YJPRBS Journal Website

## Overall Assessment

The website has a solid foundation with OJS-aligned architecture, structured academic content, editorial workflow, and reviewer management. However, several issues remain that affect credibility, usability, and indexing readiness.

---

## Critical Issues (Must Fix)

### 1. Placeholder ISSN Still Present in Multiple Locations
The real eISSN is `3009-6316`, but **three locations** still show `XXXX-XXXX`:
- **Header** (line 84): `eISSN: XXXX-XXXX`
- **Footer** (line 16): `eISSN: XXXX-XXXX`
- **Hero** (line 44): `XXXX-XXXX`

This destroys credibility instantly for any visitor or indexing crawler.

### 2. QuickLinks Section Has All Broken `#` Links
`src/components/QuickLinks.tsx` — all four cards point to `href: "#"` instead of real routes:
- Submit Manuscript → should be `/submit`
- Author Guidelines → `/author-guidelines`
- Peer Review → `/peer-review`
- Editorial Board → `/editorial-board`

### 3. FeaturedSection "View All Articles" Links Are Broken
`src/components/FeaturedSection.tsx` lines 98 and 117 both use `href="#"` instead of `/articles`.

### 4. Fallback Articles Show Fake Research
When no articles are published, the FeaturedSection displays fabricated article titles with fake author names and stock images. This is misleading for a real journal. Should show an empty state message or hide the section entirely.

---

## High Priority Improvements

### 5. "Current Issue" and "Articles" Nav Items Point to Same Route
Both link to `/articles`. "Current Issue" should filter to the latest issue or link to a dedicated current-issue view.

### 6. No Structured Data (JSON-LD)
Article pages inject citation meta tags but lack `schema.org/ScholarlyArticle` JSON-LD, which Google Scholar and other indexers increasingly rely on.

### 7. No Accessibility (a11y) Basics
- No skip-to-content link
- Mobile menu lacks `aria-expanded` attributes
- Search dialog trigger has no `aria-label`

### 8. Article Comments Visible Only to Authenticated Users
The RLS policy on `article_comments` requires `auth.uid() IS NOT NULL` for SELECT. Comments should be publicly readable for an open-access journal.

---

## Medium Priority

### 9. No Privacy Policy or Terms of Service Pages
These were removed from the footer as placeholder links, but real pages are needed for GDPR compliance and journal credibility.

### 10. No 404 Handling for Invalid Article IDs
Visiting `/article/nonexistent-uuid` shows "Article not found" but doesn't set HTTP status or provide helpful navigation.

### 11. Copyright Year Hardcoded
Footer line 69: `© 2026` — should be dynamic.

### 12. No Analytics / View Counter on Articles
No article view count tracking, which is standard for academic journals and useful for indexing metrics.

---

## Recommended Implementation Plan

### Phase 1: Credibility Fixes (30 min)
| Change | File(s) |
|--------|---------|
| Replace all `XXXX-XXXX` with `3009-6316` | `Header.tsx`, `Footer.tsx`, `Hero.tsx` |
| Fix QuickLinks broken `#` hrefs | `QuickLinks.tsx` |
| Fix FeaturedSection "View All" links | `FeaturedSection.tsx` |
| Remove fake fallback articles, show empty state | `FeaturedSection.tsx` |

### Phase 2: SEO & Indexing (45 min)
| Change | File(s) |
|--------|---------|
| Add JSON-LD `ScholarlyArticle` structured data | `Article.tsx` |
| Make "Current Issue" link filter to latest issue | `Header.tsx` or new route |
| Dynamic copyright year | `Footer.tsx` |

### Phase 3: Compliance & Polish (1 hr)
| Change | File(s) |
|--------|---------|
| Add skip-to-content link, aria attributes | `Header.tsx` |
| Create Privacy Policy and Terms pages | New `PrivacyPolicy.tsx`, `Terms.tsx` |
| Add article view counter | New DB column + tracking in `Article.tsx` |
| Make article comments publicly readable | RLS policy migration |

