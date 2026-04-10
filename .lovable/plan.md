

# Comprehensive Audit: YJPRBS Journal Platform

## Final Scores

| Area | Score | Assessment |
|------|-------|------------|
| **UX** | 6.5/10 | Solid flows for core journeys but significant friction in onboarding, no Google OAuth, contact form is fake |
| **UI** | 7/10 | Clean, professional design with good typography; inconsistencies on Auth page (still shows "J" circle, wrong journal name) |
| **Performance** | 7/10 | Good architecture (React Query caching, lazy data fetching); no code-splitting, no image optimization |
| **Business Model** | 3/10 | No monetization, no subscription system, no APC workflow, no analytics beyond basic view counts |
| **Technical Quality** | 6/10 | Well-structured codebase but 4 active security vulnerabilities, contact form is a no-op, DOI prefix is placeholder |

---

## 1. Critical Issues (Must Fix Immediately)

### HIGH: Auth Page Shows Wrong Branding (Lines 410-415)
The Auth page still shows a circle with "J" and says "Journal of Plastic & Reconstructive Surgery" instead of the YJPRBS logo and correct name. This is the first impression for every new user.
**File**: `src/pages/Auth.tsx` lines 410-415

### HIGH: Contact Form Does Nothing
`Contact.tsx` line 77: `await new Promise(resolve => setTimeout(resolve, 1000))` -- the form simulates sending but actually discards all messages. No database storage, no email notification.
**File**: `src/pages/Contact.tsx`

### HIGH: Security Vulnerabilities (4 Findings)
1. **Editorial board member emails publicly exposed** -- the `email` column is readable by anyone via the `is_active = true` SELECT policy
2. **Reviewer applications insertable without authentication** -- the INSERT policy is `WITH CHECK (true)`, allowing spam flooding
3. **Leaked password protection disabled** -- passwords are not checked against the HIBP database
4. **Potential privilege escalation on user_roles** -- needs explicit restrictive policy for non-admin inserts

### HIGH: DOI Prefix is Placeholder
`generate_article_doi()` function uses `10.1234/jprs` -- this is a fake DOI prefix. Every generated DOI is invalid. The journal needs to register with CrossRef/DataCite for a real prefix.

### HIGH: Department Contact Emails Are Fake
`Contact.tsx` lists `submissions@jyms.edu.ye`, `editor@jyms.edu.ye`, `support@jyms.edu.ye`, `ethics@jyms.edu.ye` -- these appear to be placeholder domains. The real email is `YemeniAPRBSurgeons@gmail.com`.

---

## 2. High Priority Issues

### Privacy Policy Links to Wrong Page
Auth page line 632: "Privacy Policy" checkbox links to `/publication-ethics` instead of `/privacy-policy`.

### EULA Links to Wrong Page
Auth page line 621: "End User License Agreement" also links to `/publication-ethics`. There is no actual EULA page.

### No Google OAuth
The sign-up form requires 10+ fields. Adding Google sign-in would drastically reduce friction and increase registrations. The platform supports it natively.

### Hero "Read Current Issue" Links to Generic `/articles`
Hero button at line 31 navigates to `/articles` instead of `/articles?issue=current`, missing the current-issue filter that was specifically built.

### OG Image Uses favicon.png (Tiny Logo)
`index.html` line 14: `og:image` points to `/favicon.png` which is a tiny icon. Social shares will look unprofessional. Need a proper 1200x630px OG image.

### View Count Increments on Every Page Load
`Article.tsx` line 179: `increment_article_views` fires on every render with no session/cookie debounce. Refreshing the page inflates counts.

---

## 3. Medium Priority Issues

### No Route-Level Code Splitting
All 30+ pages are bundled together. First load downloads everything. Should use `React.lazy()` for admin, reviewer, profile, and static pages.

### Admin Dashboard Only Shows Article Stats
`AdminDashboard.tsx` only queries `articles`. Missing: user count, submission count, pending reviews count, recent registrations. An admin dashboard should show operational metrics.

### No Bulk Actions in Admin
Admin tables (Users, Submissions, Articles) have no bulk select/action capability. Managing 100+ items requires clicking one by one.

### Reviewer Cannot Access Manuscript Files
Reviewer dashboard shows submission abstract but the reviewer cannot download the actual manuscript PDF. The `handleViewSubmission` function only fetches `abstract, keywords, category` -- not the manuscript file URL.

### No Email Notification to Authors on Status Change
When admin changes submission status, no notification is sent to the author. Authors must manually check the dashboard.

### Saved Articles Link to Article by ID but Don't Navigate
Dashboard saved articles show article info but clicking doesn't navigate to the article page. Missing `onClick` or `Link` wrapper.

### No Dark Mode Toggle
The app uses Tailwind's `dark:` classes but there's no toggle for users to switch themes.

---

## 4. Low Priority / Polish

- No loading skeleton on Profile page (shows spinner)
- Archive page exists but may duplicate Articles page functionality
- No article print stylesheet
- No cookie consent banner
- PublicProfile page exists but doctor profiles aren't publicly viewable due to RLS
- No social media links in footer
- `SearchDialog` exists but scope/effectiveness unclear
- No "Back to Top" button on long pages

---

## 5. Improvement Roadmap

### Phase 1: Quick Wins (Can implement now)

| Fix | Files | Effort |
|-----|-------|--------|
| Fix Auth page branding (logo + correct name) | `Auth.tsx` | 5 min |
| Fix Privacy Policy/EULA links on Auth page | `Auth.tsx` lines 621, 632 | 2 min |
| Fix Hero button to use `?issue=current` | `Hero.tsx` line 31 | 1 min |
| Remove fake department emails from Contact page | `Contact.tsx` | 5 min |
| Wire contact form to database + email notification | `Contact.tsx` + DB migration | 30 min |
| Enable leaked password protection | Auth config tool | 1 min |
| Fix reviewer_applications INSERT policy | DB migration | 5 min |
| Remove email column from editorial board public view | DB migration | 5 min |
| Add restrictive policy to user_roles | DB migration | 5 min |
| Debounce article view counter (session-based) | `Article.tsx` | 10 min |

### Phase 2: Mid-Term (1-2 weeks)

| Feature | Impact |
|---------|--------|
| Add Google OAuth to Auth page | Major UX improvement, higher registration rate |
| Real contact form with database + email | Professional credibility |
| Add code splitting with React.lazy | Faster initial load |
| Enrich Admin Dashboard with user/submission/review metrics | Better operational visibility |
| Allow reviewers to download manuscripts | Core workflow completion |
| Send email on submission status change | Author retention |
| Create proper OG image (1200x630) | Social sharing quality |
| Make saved articles clickable in Dashboard | Basic UX fix |

### Phase 3: Advanced (Scale Features)

| Feature | Impact |
|---------|--------|
| Register real DOI prefix with CrossRef | Academic legitimacy |
| APC (Article Processing Charge) workflow | Monetization |
| Automated reviewer matching by specialty | Editorial efficiency |
| Altmetrics integration | Research impact visibility |
| ORCID login integration | Academic identity standard |
| Multi-language support (Arabic/English) | Audience reach |
| Article version history/preprint support | Academic workflow |
| Email newsletter for new issues | Engagement/retention |
| Cookie consent + GDPR compliance | Legal requirement |

