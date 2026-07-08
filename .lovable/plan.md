
# Phase 4 — Homepage Density & Visual Polish

Transform the homepage from a sparse 3-section landing into a rich, editorial journal homepage that competes visually with NEJM, The Lancet, and JAMA. Focus is presentation-only — no schema changes, no new business logic beyond read-side queries.

## Current state (why it scores 6.5/10)

Homepage today = `Hero` → single `FeaturedSection` rail → `RecentIssues` → `QuickLinks`. Loading states are blank, backgrounds are uniform, there is no social-proof strip, no "Most Read", no "Editor's Pick", no indexer wall, and issue covers are placeholder-only. First-time visitors cannot gauge scientific weight or freshness at a glance.

## What ships in Phase 4

```text
Hero
 ↓
Impact Strip           (NEW — 4 KPIs: articles, authors, countries, avg. review days)
 ↓
Featured Section       (existing — add skeleton loader)
 ↓
Editor's Pick          (NEW — single large card, curated by is_main_featured fallback)
 ↓
Most Read (30 days)    (NEW — 3-column grid, ordered by view_count desc, alt bg)
 ↓
Recent Issues          (existing — add issue-cover thumbnails + skeleton)
 ↓
Indexed In             (NEW — logo wall: Crossref, DOAJ, Google Scholar, ROAD, WorldCat)
 ↓
QuickLinks             (existing — alt background)
```

Alternating section backgrounds (`bg-background` ↔ `bg-secondary/30`) create vertical rhythm so the page reads as distinct editorial bands instead of one flat scroll.

## New / changed files

| File | Change |
|---|---|
| `src/components/home/ImpactStrip.tsx` | NEW — 4 stat tiles with count-up animation. Numbers pulled from a single Supabase RPC-less query batch (articles count, distinct authors from `articles.authors`, hard-coded country count, avg review days from `submissions` timestamps). Skeleton on load. |
| `src/components/home/EditorsPick.tsx` | NEW — one hero-sized card: cover image left, title + abstract snippet + author + category badge right. Query: latest `is_main_featured=true` article, fallback to newest featured. |
| `src/components/home/MostRead.tsx` | NEW — 3-column card grid (1-col mobile). Query: top 3 articles by `view_count` in last 30 days (or all-time if column missing). "Trending" flame icon on rank #1. |
| `src/components/home/IndexedIn.tsx` | NEW — grayscale SVG/text logo wall of indexing bodies: Crossref, DOAJ, Google Scholar, ROAD, WorldCat, ORCID. Hover → color. Links open in new tab. |
| `src/components/home/SectionBand.tsx` | NEW — wrapper that applies alternating background + consistent vertical padding + optional eyebrow heading (small caps serif label above the H2). Replaces ad-hoc `<section>` markup across new components. |
| `src/components/skeletons/ArticleCardSkeleton.tsx` | NEW — shimmer skeleton matching FeaturedArticle card shape. |
| `src/components/skeletons/IssueCardSkeleton.tsx` | NEW — shimmer skeleton matching IssueCard shape. |
| `src/components/FeaturedSection.tsx` | Wrap in `SectionBand`, render 3 `ArticleCardSkeleton` while `loading`. |
| `src/components/RecentIssues.tsx` | Wrap in `SectionBand` (alt bg), render skeletons while loading. Add cover thumbnail slot: use `issue.cover_image_url` if present, else programmatic gradient tile with volume/issue number in serif type. |
| `src/pages/Index.tsx` | New section order (see diagram above). Add JSON-LD `WebSite` + `SearchAction` block for site-wide search box in Google results. |
| `src/index.css` | Add `@keyframes shimmer` + `.animate-shimmer` utility for skeleton loaders. Add `--gradient-cover-1..4` tokens for programmatic issue covers. |

## Data queries (read-only, no schema changes)

- `MostRead`: `select id,title,slug,authors,category,cover_image_url,view_count from articles where published_at is not null order by view_count desc nulls last limit 3`. If `view_count` column doesn't exist, fall back to newest 3 by `published_at`.
- `EditorsPick`: `select ... from articles where is_main_featured = true order by published_at desc limit 1`.
- `ImpactStrip`: parallel `head:true, count:'exact'` queries on `articles`, `profiles`, and a `submissions` derived stat.
- All three wrapped in `useQuery` with 5-min `staleTime` (already global default).

## Design tokens used

Existing navy `--primary` + coral `--accent`. No new color tokens. `Playfair Display` for section eyebrows and stat numbers, `Source Sans 3` for body — already loaded.

## Out of scope (deferred to later phases)

- CrossRef "cited-by" API integration (Phase 6)
- Framer-motion page transitions (Phase 4.2)
- Dark-mode audit of new components (verified visually only, no separate audit pass)
- Real ORCID/Crossref badges (Phase 6)
- Issue cover uploads UI in admin (Phase 4.2) — covers use `cover_image_url` if already set, else programmatic gradient tile
