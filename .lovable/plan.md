
# Design Evaluation: YJPRBS Journal Website

## Overall Design Score: 7.5/10

The site has a professional, clean editorial aesthetic with a strong color system (deep navy + warm coral) and excellent typography pairing (Playfair Display + Source Sans 3). It looks like a credible academic journal. However, several design issues reduce polish and user experience compared to top-tier medical journal websites (NEJM, The Lancet, IJPS by Thieme).

---

## What Works Well

- **Color palette**: Navy + coral is distinctive, authoritative, and warm — perfect for a medical journal
- **Typography**: Playfair Display for headings with Source Sans 3 for body is an excellent serif/sans-serif pairing
- **Hero section**: Strong visual hierarchy, clear CTAs, the eISSN/review/OA stats strip is professional
- **Sticky header**: Clean, functional, good responsive behavior
- **Article page**: Full-width hero image with overlaid metadata is visually striking
- **Quick Links section**: Well-designed cards with hover elevation effects

---

## Design Issues to Fix

### 1. Hero Section — Right Side is Empty (HIGH)
The hero takes the full viewport width but all content is pushed to the left `max-w-4xl`. The right ~40% of the screen on desktop is empty dark navy space. Professional journals use this space for a cover image, abstract preview, or graphical abstract.

**Fix**: Add a journal cover image, featured article preview card, or a decorative medical illustration on the right side of the hero using a 2-column grid layout.

### 2. Homepage Feels Sparse Between Sections (HIGH)
Large vertical gaps between Featured Research, Recent Issues, and Quick Links create a disconnected feeling. The `py-16 md:py-24` padding is generous but makes the page feel stretched thin, especially when there are few articles.

**Fix**: Reduce section padding to `py-12 md:py-16`. Add a visible section divider or subtle background color alternation to create rhythm.

### 3. Article Cards Lack Visual Density (MEDIUM)
The compact view list items show title, author, DOI, and date but have no visual weight. Compared to IJPS or PubMed, they feel flat. The action buttons (Abstract, Cite, Share, Full Text) are the same muted color and blend together.

**Fix**: Add a thin left border accent color by category. Make the "Full Text" button more prominent (filled variant). Add article type badges (Original Article, Review, Case Report) with distinct colors.

### 4. No Visual Breadcrumb on Interior Pages (MEDIUM)
Pages like Articles, About, Author Guidelines have different header banner styles — some have a gradient header, some don't. There's no breadcrumb navigation for orientation.

**Fix**: Add a consistent breadcrumb component below the header on all interior pages (e.g., `Home > Articles > Otoplasty`).

### 5. Footer "For Authors" Column is Too Long (LOW)
The footer has 7 links in the "For Authors" column vs 3 in "Quick Links". This creates visual imbalance. The footer also lacks social media icons.

**Fix**: Split "For Authors" into two sub-groups or move some links to Quick Links. Add social media icons (Twitter/X, LinkedIn, ResearchGate).

### 6. Mobile Header Missing Logo Text (LOW)
On mobile, only the logo image shows — the "YJPRBS" text and eISSN are hidden (`hidden sm:block`). This is fine for space, but the logo image alone is small and hard to recognize.

**Fix**: Show the "YJPRBS" text on mobile too (just hide the eISSN). Change to `hidden xs:block` or always show the name.

### 7. Article Page — Action Bar Needs Better Hierarchy (MEDIUM)
The Like, Download PDF, and Share buttons sit in a horizontal row but "Download PDF" (the primary action for researchers) doesn't stand out. The "Cite this Article" button below is visually disconnected.

**Fix**: Create a unified action toolbar with "Download PDF" as the primary (filled) button and Cite, Share, Like as secondary actions in the same row.

### 8. No Dark Mode Toggle (LOW)
Dark mode CSS variables are fully defined but there's no user-facing toggle to switch themes. Academic researchers often prefer dark mode for extended reading.

**Fix**: Add a sun/moon toggle button in the header next to the search icon.

---

## Recommended Improvements

### Phase 1: Layout & Hierarchy Fixes

| Change | Files | Impact |
|--------|-------|--------|
| Add cover image/illustration to hero right side | `Hero.tsx` | Major — first impression |
| Add breadcrumb component to interior pages | New `Breadcrumb` usage in page layouts | Navigation clarity |
| Reduce section spacing on homepage | `FeaturedSection.tsx`, `RecentIssues.tsx`, `QuickLinks.tsx` | Visual cohesion |
| Improve article page action bar hierarchy | `Article.tsx` | Researcher usability |
| Add category color badges to article list items | `ArticleListItem.tsx` | Visual scanning |

### Phase 2: Polish & Delight

| Change | Files | Impact |
|--------|-------|--------|
| Add dark mode toggle | `Header.tsx` + new ThemeToggle component | User preference |
| Balance footer columns + add social icons | `Footer.tsx` | Professional completeness |
| Show "YJPRBS" text on mobile header | `Header.tsx` | Brand recognition |
| Add subtle section dividers on homepage | `Index.tsx` or section components | Visual rhythm |
| Improve "Recent Issues" cards with better cover placeholders | `IssueCard.tsx` | Visual appeal |

### Technical Details

| File | Change |
|------|--------|
| `Hero.tsx` | Convert to 2-column grid: content left, cover/visual right |
| `ArticleListItem.tsx` | Add `border-l-4` with category-based color mapping |
| `Article.tsx` | Merge cite/share/PDF into single toolbar with primary/secondary variants |
| `Header.tsx` | Remove `hidden sm:block` from YJPRBS text; add ThemeToggle |
| `Footer.tsx` | Restructure grid, add social icons row |
| New: `src/components/ThemeToggle.tsx` | Toggle between light/dark using `document.documentElement.classList` |
| `FeaturedSection.tsx`, `RecentIssues.tsx`, `QuickLinks.tsx` | Change `py-16 md:py-24` to `py-12 md:py-16` |
