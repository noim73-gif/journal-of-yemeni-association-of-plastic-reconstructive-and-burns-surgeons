# Site-wide Design Review — and Phase 3: the Back Office

## Score: 8.4 / 10 (public site 9.0, signed-in surfaces 6.5)

The public reading experience is now genuinely journal-grade: editorial band rhythm on the homepage, a real type scale, ORCID author chips, metrics, lightbox, related articles, DOI linkification, breadcrumbs and a mobile submit FAB. The gap has moved decisively behind the login wall.

## What still drags the score down

**1. The signed-in surfaces never got the design system.**
`StatsCard` still hardcodes `bg-green-100 / text-blue-600 / bg-amber-100 / text-red-700` instead of the `--status-success / warning / info / neutral` tokens that already exist in `index.css`. Trend chips, status badges and dashboard tiles therefore drift from the navy/coral identity and look like a different product.

**2. No type scale in admin, author dashboard, or reviewer dashboard.**
The scale (`text-h1`–`h5`, `meta`, `caption`, `stat`, `overline`) is applied on public pages only. Admin pages and the two dashboards still use ad-hoc `text-3xl font-bold`, `text-sm text-muted-foreground`. Headings differ page to page.

**3. Status vocabulary is invented per file.**
`pending / under_review / revision_requested / accepted / rejected` are mapped to shadcn badge variants locally in `Dashboard.tsx`, and again — differently — in AdminSubmissions, AdminReviews, ReviewerDashboard. `accepted` and `under_review` both render as `default` (navy), so an author cannot tell good news from neutral news at a glance. Editorial status is the single most meaning-dense element in an OJS system and it currently carries no consistent color meaning.

**4. Dashboards have no page furniture.**
Public pages get `PageHeader` + `Breadcrumbs`; `Dashboard`, `ReviewerDashboard` and every `/admin/*` page start cold with a bare heading. No empty-state design either — empty tabs show a bare sentence.

**5. Remaining hardcoded colors.** `hover:bg-black/10` (AdminUsers), `text-white` in IssueCard/Article hero (acceptable over imagery but should be `text-primary-foreground`), ORCID `bg-[#A6CE39]` (brand color — legitimate, keep).

**6. Loading states.** Public pages have shimmer skeletons; the dashboards still spin a centered `Loader2` for the whole page, which reads as "broken" on slow connections.

---

# Phase 3 — Back-office design parity

Presentation-only. No schema, no query, no business-logic changes.

## New shared pieces

| File | Purpose |
|---|---|
| `src/components/EditorialStatusBadge.tsx` | NEW — single source of truth for every editorial status. Maps each status to a token-based color (`--status-success` accepted/published, `--status-info` under_review, `--status-warning` revision_requested/pending, `--destructive` rejected, `--status-neutral` draft/withdrawn) plus a human label and an optional icon. Replaces the local `getStatusBadge` helpers. |
| `src/components/DashboardHeader.tsx` | NEW — signed-in equivalent of `PageHeader`: title in `text-h1`, optional `text-lead` subtitle, right-slot for primary action, thin bottom border. Used by Dashboard, ReviewerDashboard and admin pages. |
| `src/components/EmptyState.tsx` | NEW — icon + `text-h4` title + `text-body-sm` copy + optional CTA. Used for empty saved-articles, history, submissions, reviews, issues. |
| `src/components/skeletons/TableSkeleton.tsx` | NEW — shimmer rows matching table/list shape, replaces full-page spinners on dashboards. |

## Changed files

| File | Change |
|---|---|
| `src/components/admin/StatsCard.tsx` | Swap all green/amber/blue/red literals for `hsl(var(--status-*))` variants; value uses `text-stat`, title `text-overline`, description `text-caption`. |
| `src/pages/Dashboard.tsx` | `DashboardHeader`, remove local `getStatusBadge` in favour of `EditorialStatusBadge`, type scale on tab content, `EmptyState` for the three empty tabs, `TableSkeleton` instead of the full-page spinner (keep the auth-gate spinner). |
| `src/pages/ReviewerDashboard.tsx` | Same treatment: header, status badges, type scale, empty states, skeletons. Keep the existing urgency/deadline logic untouched. |
| `src/pages/admin/AdminDashboard.tsx` | `DashboardHeader` + type scale on section headings and stat labels. |
| `src/pages/admin/AdminSubmissions.tsx`, `AdminReviews.tsx`, `AdminArticles.tsx`, `AdminUsers.tsx`, `AdminIssues.tsx`, `AdminWorkflow.tsx`, `AdminReviewerApplications.tsx`, `AdminEditorialBoard.tsx`, `AdminAnalytics.tsx`, `AdminSettings.tsx` | `DashboardHeader` at the top, `EditorialStatusBadge` wherever a status is rendered, type-scale classes on headings/meta/captions, `EmptyState` for empty tables. |
| `src/components/admin/ArticleTable.tsx`, `BoardMemberTable.tsx`, `ReviewProgressDashboard.tsx`, `ReviewerApplicationCard.tsx`, `SubmissionReviewPanel.tsx`, `ConvertToArticleDialog.tsx`, `AdminGalleyManager.tsx` | Type scale + shared status badge; no logic touched. |
| `src/pages/admin/AdminUsers.tsx` | Replace `hover:bg-black/10` with `hover:bg-foreground/10`. |
| `src/components/IssueCard.tsx`, `src/pages/Article.tsx` | `text-white` → `text-primary-foreground` on the image-overlay text so dark mode stays correct. |
| `src/components/admin/AdminSidebar.tsx` | Active-item treatment via `--sidebar-*` tokens, `text-overline` group labels, tighter density. |

## Out of scope (later phases)

- Crossref deposit / ORCID login (Phase 6)
- Framer-motion transitions
- Any change to submission, review, or workflow business logic
- New admin features (issue cover upload UI, bulk actions)
