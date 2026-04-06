

# Comparison: IJPS (Screenshot) vs YJPRBS — Gap Analysis & Improvement Plan

## What the Screenshot Shows

The screenshot is from the **Indian Journal of Plastic Surgery (IJPS)** — a well-established, Thieme-hosted academic journal. Key features visible:

1. **Volume/Issue header** prominently displayed at the top ("Volume 57, Issue 6")
2. **Articles grouped by type** (Original Articles, Review Articles, Case Reports, etc.) with section headings
3. **Inline expandable abstracts** — each article shows a clickable "Abstract" toggle without leaving the page
4. **Author affiliations** shown below author names
5. **Action icons per article**: PDF download, HTML view, citation export, share — all inline
6. **"How to Cite" section** visible per article
7. **Clean text-based layout** — no large images per article in the listing; compact, information-dense
8. **DOI displayed** as a clickable link per article
9. **Page numbers** shown per article (e.g., "pp. 456-462")

---

## Key Gaps in YJPRBS

| Feature | IJPS (Screenshot) | YJPRBS (Current) |
|---------|-------------------|-------------------|
| Articles grouped by category/type | Yes, clear section headings | No — flat list with category badges |
| Inline abstract expand/collapse | Yes, toggle per article | No — abstract is truncated 2-line clamp, must click into article |
| Per-article action buttons (PDF, cite, share) | Yes, icon row per article | No — actions only on article detail page |
| Author affiliations | Shown per article | Not stored or displayed |
| "How to Cite" inline | Yes | No — only on article detail page |
| Compact text-only listing | Yes — no images in list | Image-heavy cards take lots of space |
| Current issue header banner | Clear "Volume X, Issue Y" banner | Generic "Browse Articles" heading |
| Article type section grouping | "Original Articles", "Review Articles", etc. | No grouping |

---

## Recommended Improvements

### 1. Group Articles by Category on the Articles Page
In `Articles.tsx`, when filtering by a specific volume/issue, group articles under headings like "Original Articles", "Review Articles", "Case Reports" instead of a flat list.

### 2. Add Inline Abstract Expand/Collapse
Each article card in the listing should have a small "Abstract" toggle button that expands the full abstract without navigating away. Uses a simple `useState` toggle per card.

### 3. Add Per-Article Quick Action Buttons
Add small icon buttons to each article card: PDF download, Share, Cite — similar to the IJPS layout. These appear below the abstract in the listing.

### 4. Show Current Issue Banner
When viewing `?issue=current` or a specific volume/issue, display a prominent header showing "Volume X, Issue Y" with the issue date, instead of the generic "Browse Articles" title.

### 5. Compact Text-Only Listing Option
Add a toggle between the current image-card view and a compact text-only view (like IJPS). The compact view removes images and shows a denser, more academic listing format.

### 6. Show Pages and DOI More Prominently
Display page numbers (already in DB as `pages`) and DOI as clickable links in the article listing, not just inside the detail page.

---

## Technical Details

| Change | File(s) | Approach |
|--------|---------|----------|
| Group articles by category | `Articles.tsx` | `useMemo` to group `filteredArticles` by `category`, render with section headings |
| Inline abstract toggle | `Articles.tsx` | Add `expandedAbstracts` state (Set of IDs), toggle button per card |
| Per-article action buttons | `Articles.tsx` | Add PDF/Share/Cite icon buttons below abstract in each card |
| Current issue banner | `Articles.tsx` | Detect `selectedVolume !== "all"` and show styled banner with volume/issue info |
| Compact view toggle | `Articles.tsx` | Add `viewMode` state ("cards" / "compact"), render different layouts |
| Show pages/DOI in listing | `Articles.tsx` | Already available in data, just display in article card |

No database changes needed. All improvements are frontend-only in `Articles.tsx`.

