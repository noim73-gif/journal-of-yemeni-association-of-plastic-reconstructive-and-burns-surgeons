

# Evaluation: Submission-to-Publication Flow, Article Structure, and PDF Download

## Current State Assessment

### A. Submission → Publication Flow

```text
Current Flow:
Author submits → Admin reviews status → (optional) Assign reviewers → Convert to article → Publish

OJS-Equivalent Flow (partially implemented):
Submission → Review → Copyediting → Production → Publication
```

**What works:**
- 5-stage editorial workflow exists (`useEditorialWorkflow.tsx`, `AdminWorkflow.tsx`)
- Submission form with file upload, category, cover letter
- Admin can change status, assign reviewers, advance stages
- ConvertToArticleDialog converts accepted submissions to articles
- Reviewer dashboard and submission review panel exist

**Issues found:**

1. **Conversion loses structured content** — `ConvertToArticleDialog` only maps `title`, `abstract`, `authors`, `category`. It does NOT populate `introduction`, `methods`, `results`, `discussion`, `references` fields. The published article ends up with just an abstract and no body sections.

2. **No galley upload during production** — There is no UI for admins to upload PDF/HTML/XML galleys to `article_galleys` during the production stage. Galleys are displayed on the article page but there's no way to create them.

3. **submission_id not linked** — `ConvertToArticleDialog` does not set `article.submission_id` when creating the article, breaking the audit trail from submission to published article.

4. **No author notification on stage changes** — When workflow advances or decisions are made, there's no email/notification to the author.

5. **File version management is weak** — `submission_files` table supports versioning but the UI doesn't expose file version history or revision uploads per stage.

### B. Article Structural View

**What works:**
- Academic sections (Abstract, Introduction, Methods, Results, Discussion, References) render with numbered headings
- Fallback for legacy single-content articles
- DOMPurify sanitization on rendered HTML

**Issues found:**

6. **No Table of Contents / sidebar navigation** — Long articles lack a sticky table of contents for jumping between sections. Standard for academic journals.

7. **Keywords not displayed** — The `articles.keywords` field exists (as array) but is not rendered on the article page.

8. **No page numbers / article number display** — `pages` and `article_number` fields exist in the DB but aren't shown.

9. **Citation meta tag uses placeholder ISSN** — Line 137: `citation_issn` is `"XXXX-XXXX"` — needs the real ISSN.

### C. PDF Download

**What works:**
- Galley download buttons appear when `article_galleys` has entries
- JATS XML export (admin only) via edge function

**Issues found:**

10. **No PDF generation from article content** — If no galley is uploaded, there is NO way for readers to download the article as PDF. Most journals provide an auto-generated PDF from the structured content.

11. **No galley management UI** — Admins cannot upload galleys (PDF/HTML/XML) to `article_galleys` from the admin panel.

12. **Galley links use raw `file_url`** — No signed URL generation for private storage; if stored in a private bucket, the links won't work.

---

## Recommended Fixes (Priority Order)

### Phase 1: Critical Flow Fixes

**1. Fix ConvertToArticleDialog to carry all data**
- Map `submission.manuscript_url`, `submission_id`, and `keywords` into the created article
- Add fields for `introduction`, `methods`, `results`, `discussion`, `references` in the customize step

**2. Add Galley Management to Admin**
- New component in admin: upload PDF/HTML/XML files to `article_galleys`
- Accessible from article edit page or production workflow stage
- Upload to `manuscripts` bucket with signed URL display

**3. Add auto-PDF generation for articles**
- Create an edge function `generate-article-pdf` that renders article structured sections into a downloadable PDF
- Add a "Download PDF" button on article pages when no galley exists
- Use a server-side PDF library (e.g., jsPDF via Deno) or HTML-to-PDF approach

### Phase 2: Structure Improvements

**4. Add Table of Contents sidebar**
- Sticky sidebar on desktop showing section links (Abstract, Introduction, Methods, etc.)
- Scroll-spy highlighting for current section

**5. Display keywords, page numbers, article number**
- Render `keywords` array as badges below the abstract
- Show `pages` and `article_number` in the article metadata header

**6. Fix ISSN placeholder**
- Replace `"XXXX-XXXX"` with the real ISSN or remove if not yet assigned

### Phase 3: Workflow Polish

**7. Link submission_id on article creation**
- Set `submission_id` in the article insert to maintain traceability

**8. Add file version UI to workflow**
- Show file version history per stage in `AdminWorkflow`
- Allow uploading revised files at each stage

---

## Technical Details

| Priority | Change | Files |
|----------|--------|-------|
| Critical | Fix ConvertToArticleDialog data mapping | `ConvertToArticleDialog.tsx` |
| Critical | Add galley upload UI for admins | New `AdminGalleyManager.tsx`, `AdminArticles.tsx` |
| Critical | Auto-PDF generation edge function | New `supabase/functions/generate-article-pdf/` |
| Critical | Add "Download PDF" button when no galleys | `Article.tsx` |
| High | Table of Contents sidebar | `Article.tsx` |
| High | Display keywords, pages, article_number | `Article.tsx` |
| High | Fix ISSN placeholder in citation meta | `Article.tsx` line 137 |
| Medium | Set submission_id in article creation | `ConvertToArticleDialog.tsx` |
| Medium | File version history UI | `AdminWorkflow.tsx` |

