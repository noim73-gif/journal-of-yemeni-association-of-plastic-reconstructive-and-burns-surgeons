

# Comprehensive Audit: YJPRBS Journal Platform (April 2026)

## Final Scores

| Area | Score | Assessment |
|------|-------|------------|
| **UX** | 7/10 | Core journeys work well; saved articles not clickable, no Google OAuth, 10+ field signup creates friction |
| **UI** | 7.5/10 | Professional, consistent design; Auth page uses generic "YJ" circle instead of actual journal logo |
| **Performance** | 6.5/10 | No route-level code splitting — all 30+ pages in one bundle; no image lazy loading |
| **Business Model** | 3/10 | Zero monetization, no APC workflow, no subscription, no analytics beyond view counts |
| **Technical Quality** | 6.5/10 | Well-structured code but DOI prefix is fake (`10.1234/jprs`), admin dashboard lacks operational metrics |

---

## Critical Issues

### 1. DOI Prefix is Still Fake
Every article displays `10.1234/jprs.2026.xxxxx` — a placeholder DOI that is invalid. This undermines academic credibility and indexing. The `generate_article_doi()` DB function needs updating once you register with CrossRef/DataCite, but the display should at least note it's provisional or hide it until a real prefix is configured.

### 2. No Google OAuth
The sign-up form requires 10+ fields (name, email, password, profession, specialty, country, city, phone, postal code, ID number). Adding Google sign-in would reduce friction dramatically and is natively supported.

### 3. Saved Articles Not Clickable
In `Dashboard.tsx`, saved articles and reading history items display title/author but have no `onClick` or `<Link>` to navigate to the article. Users see their saved articles but cannot click through to read them.

### 4. Admin Dashboard Only Shows Article Stats
`AdminDashboard.tsx` only queries the `articles` table. Missing: total users, total submissions, pending reviews, recent registrations, contact form messages. An admin running a journal needs operational metrics.

### 5. Reviewer Cannot Download Manuscripts
`ReviewerDashboard.tsx` line 115-118: `handleViewSubmission` only fetches `abstract, keywords, category` — not `manuscript_url`. Reviewers cannot access the actual manuscript PDF, which breaks the core review workflow.

### 6. No Code Splitting
`App.tsx` eagerly imports all 30+ page components. First load downloads everything including admin, reviewer, and static pages that most users never visit. Should use `React.lazy()`.

---

## High Priority Issues

### 7. Auth Page Uses Generic Circle Instead of Logo
Line 410: Shows a `"YJ"` text circle instead of the actual `journal-logo.png` that the Header and Footer already use. Inconsistent branding.

### 8. No Email Notification on Submission Status Change
When admin changes a submission status (accepted/rejected/revision), the author receives no email. They must manually check the dashboard.

### 9. No "Contact Messages" in Admin
The `contact_submissions` table was created but there's no admin page to view/manage incoming contact form messages.

### 10. No Dark Mode Toggle
Tailwind `dark:` classes exist throughout but there's no user-facing toggle to switch themes.

---

## Medium Priority Issues

- No bulk actions in admin tables (users, submissions, articles)
- No loading skeletons on Dashboard or Profile pages
- Archive page may duplicate Articles page functionality
- No cookie consent banner
- No "Back to Top" button on long pages
- No social media links in footer
- `editorial_board_members.email` column is still publicly readable (the RLS policy restricts to `is_active = true` but still exposes email — need a DB view or column-level exclusion)

---

## Improvement Plan

### Phase 1: Critical Fixes (implement now)

| Fix | Details |
|-----|---------|
| Make saved articles & history clickable | Wrap items in `Dashboard.tsx` with `<Link to={/article/${id}}>` |
| Use actual logo on Auth page | Replace `"YJ"` circle with `<img src={journalLogo}>` in `Auth.tsx` |
| Add Google OAuth | Configure Google provider + add "Sign in with Google" button on Auth page |
| Enrich Admin Dashboard | Add stats cards for total users, submissions, pending reviews, contact messages |
| Add Admin Contact Messages page | New `/admin/contact` route displaying `contact_submissions` table |
| Fix reviewer manuscript access | Include `manuscript_url` in `handleViewSubmission` query + add download button |
| Add route-level code splitting | Wrap admin, reviewer, profile, and static pages with `React.lazy()` + `Suspense` |

### Phase 2: UX & Engagement (mid-term)

| Feature | Impact |
|---------|--------|
| Email notification on submission status change | Author retention |
| Dark mode toggle in header | User preference |
| Bulk actions in admin tables | Operational efficiency |
| Hide/label DOI as provisional until real prefix | Academic credibility |
| Loading skeletons instead of spinners | Perceived performance |

### Phase 3: Scale & Monetization

| Feature | Impact |
|---------|--------|
| Register real DOI prefix | Academic legitimacy |
| APC (Article Processing Charge) workflow | Monetization |
| ORCID login integration | Academic identity |
| Multi-language support (Arabic/English) | Regional reach |
| Cookie consent + GDPR | Legal compliance |

---

## Technical Details

| Change | Files Affected |
|--------|---------------|
| Clickable saved articles | `Dashboard.tsx` — wrap article cards with `<Link>` |
| Auth logo | `Auth.tsx` line 410 — replace div with `<img src={journalLogo}>` |
| Google OAuth | Auth config tool + `Auth.tsx` — add Google button |
| Admin dashboard enrichment | `AdminDashboard.tsx` — add queries to `profiles`, `submissions`, `submission_reviews`, `contact_submissions` |
| Admin contact page | New `src/pages/admin/AdminContactMessages.tsx` + route in `App.tsx` + sidebar link |
| Reviewer manuscript download | `ReviewerDashboard.tsx` line 117 — add `manuscript_url` to select, add download button |
| Code splitting | `App.tsx` — convert static imports to `React.lazy()` with `<Suspense>` fallback |
| Editorial board email protection | DB migration — create a view excluding email column, or drop email from public SELECT policy |

