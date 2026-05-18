
# YJPRBS — Site-wide Design Review (Information Architecture + Visual Design)

## Overall Design Score: 7.6 / 10

The platform now reads as a credible academic journal: navy + coral palette, Playfair × Source Sans 3 pairing, sticky header, dark-mode tokens, OJS-aligned workflow. The remaining gaps are the difference between "good Lovable site" and "peer of NEJM / Lancet / Thieme IJPS": **information density on the homepage, page-template inconsistency across 20+ routes, a weak Article reading experience, and an admin/reviewer UI that looks like a different product than the public site.**

---

## What's working

- **Brand system**: navy (`215 50% 23%`) + coral accent (`12 76% 61%`) is distinctive and medical-appropriate. eISSN strip in hero signals legitimacy.
- **Typography pairing**: Playfair Display for headings + Source Sans 3 for body — correct register for a scholarly journal.
- **Header**: sticky, accessible (skip link, aria), now with theme toggle and reviewer/admin role menus.
- **Article list**: category-coded left borders + badges give scannable hierarchy.
- **Hero**: 2-column with cover image + credibility strip is now competitive with mid-tier journal sites.
- **Footer**: balanced, social icons, complete legal/policy links.

---

## Issues, grouped by surface

### A. Homepage (`Index.tsx`)
1. **Empty/skeleton mid-section on first paint** — the FeaturedSection renders a large dark void before data resolves (visible in current screenshot). No skeleton loaders that match the final layout = perceived broken page.
2. **No section rhythm** — Hero → Featured → Recent Issues → Quick Links all use the same `bg` and `py-16`. There's no alternating surface color, no divider, no editorial "shelf" feel.
3. **Missing "Editor's Pick" / "Most Read" / "Trending"** — top journals lead with multiple curated rails, not one Featured block.
4. **No "Aims & Scope" snippet, no Impact metrics strip** — first-time visitors can't tell what the journal covers or how it's indexed without clicking into About.

### B. Article reading page (`Article.tsx`)
1. **No persistent left/right sticky rail** on desktop — the Table of Contents and Cite/Share/Download exist but don't anchor as a sidebar like NEJM/Lancet. Long reads lose orientation.
2. **Author block is weak** — needs affiliation, ORCID badges, corresponding-author star, and "all articles by this author" links inline.
3. **No figure/table captions toolbar** — figures should be zoomable (lightbox) with caption + "Download figure" + figure number jumps.
4. **References list lacks CrossRef linking, PubMed IDs, and a "cited by" count.**
5. **Article metrics (views, downloads, citations, Altmetric donut) are absent** even though the data model could carry them.
6. **No "Related articles" / "From the same issue" rails at bottom.**

### C. Article listing (`Articles.tsx`) + Archive
1. **Filter UX**: filters are functional but visually flat — no active-filter chips, no result count animation, no saved-search.
2. **Archive page** likely lacks visual issue covers in a calendar grid — journals are expected to show "Volume 14 · Issue 3 · Mar 2026" with a cover thumbnail per issue.
3. **Pagination styling** is generic shadcn — no "Showing 11–20 of 47" copy.

### D. Auth, Submit, Profile flows
1. **Submit.tsx** — multi-step submission is the most-used author flow but likely renders as one long form. Needs a stepper (1·Authors → 2·Files → 3·Metadata → 4·Cover Letter → 5·Review) with progress persistence.
2. **Profile / PublicProfile** — academic profiles should foreground: photo, title, affiliation, ORCID, h-index/citation count, recent publications list. Currently looks like a generic SaaS profile.
3. **Auth.tsx** — Google OAuth is in but the page still uses the default centered card; could feel more journal-branded (split-screen with hero quote from the editor-in-chief).

### E. Admin + Reviewer dashboards
1. **Visual mismatch** — admin uses shadcn defaults; doesn't carry the navy/coral identity. Looks like a different product.
2. **No data viz hierarchy** — stat cards are uniform; the most important KPI (pending decisions) should dominate.
3. **Reviewer dashboard** lacks deadline urgency cues (red/amber/green pill by days remaining).
4. **Tables** are dense rows without zebra striping, hover state, or row-level quick actions.

### F. Static/informational pages (About, Author Guidelines, Peer Review, Ethics, Open Access, FAQ, Privacy, Terms)
1. **Inconsistent page chrome** — some have gradient banners, some don't, headings sized differently across pages.
2. **Walls of text** — Author Guidelines and Ethics are unbroken prose. Need: sectioned accordions, downloadable PDF checklist, sticky in-page ToC, "estimated read time."
3. **No breadcrumbs on any interior page** despite the `Breadcrumb` component existing in `src/components/ui/`.
4. **FAQ** likely uses one big accordion — should be categorized (Authors / Reviewers / Readers).

### G. Cross-cutting design-system gaps
1. **Only one accent color** — coral does both CTAs and category markers. Need a small semantic palette: success (review accepted), warning (revision requested), info (in review), neutral (published). Currently using raw Tailwind `blue-500`/`emerald-500` in `ArticleListItem` — violates the project rule to use only semantic tokens.
2. **No spacing scale documented** — sections drift between `py-12 / py-16 / py-20 / py-24`.
3. **Shadow tokens exist (`shadow-soft/elegant/elegant-lg`) but are used inconsistently.**
4. **Dark mode** — toggle ships but several pages weren't built dark-first (e.g. admin tables, Auth card, white-only hero images on certain views).
5. **No focus-visible ring customization** — relies on browser default in places.
6. **Motion** — no entrance animations, no scroll-reveal on Featured, no skeleton shimmer. The site feels static for a 2026 product.
7. **Imagery** — generic placeholder covers on Recent Issues; needs real issue artwork or a programmatic cover template.

### H. Mobile (current viewport 411px)
1. Hero cover image stacks below content — adds ~600px of scroll before "Recent Issues". Consider hiding cover on mobile or making it a thin banner.
2. Stat strip (eISSN / Double Blind / OA) wraps awkwardly at narrow widths.
3. Bottom nav / floating "Submit" CTA missing — mobile authors lose the primary action below the fold.

---

## Recommended Improvement Roadmap

### Phase 1 — Quick wins (1 pass, high impact)
| # | Change | File(s) |
|---|---|---|
| 1 | Add matching skeleton loaders to FeaturedSection, RecentIssues (kills first-paint void) | `FeaturedSection.tsx`, `RecentIssues.tsx` |
| 2 | Alternate section backgrounds (`bg-background` → `bg-secondary/40` → `bg-background`) for rhythm | `Index.tsx` |
| 3 | Add `<Breadcrumb>` to all interior pages via a shared `<PageHeader>` component | new `src/components/PageHeader.tsx`, apply to ~12 pages |
| 4 | Replace raw `blue-500/emerald-500/purple-500` in `ArticleListItem` with semantic tokens (`--category-original`, etc.) added to `index.css` | `index.css`, `tailwind.config.ts`, `ArticleListItem.tsx` |
| 5 | Add "Showing X–Y of Z" + result-count chips to Articles/Archive | `Articles.tsx`, `Archive.tsx` |
| 6 | Mobile sticky "Submit Manuscript" FAB | `Header.tsx` or new `MobileSubmitFab.tsx` |
| 7 | Hero stat strip → grid with min-width to stop awkward mobile wrap | `Hero.tsx` |

### Phase 2 — Article reading experience (mid-term)
| # | Change |
|---|---|
| 1 | Sticky right rail on `Article.tsx` ≥ lg: ToC + Cite/Share/Download/Like, hides on scroll-past-references |
| 2 | Author block redesign: avatar + ORCID + affiliation + "View all articles" chip |
| 3 | Figure lightbox (use existing dialog) with caption + download |
| 4 | Article metrics widget (views, downloads, citations) — even if values seeded to 0 initially |
| 5 | "Related articles" + "From this issue" rails at the bottom |
| 6 | References → render with CrossRef DOI links + PubMed IDs when present |

### Phase 3 — Submission & editorial flow
| # | Change |
|---|---|
| 1 | Convert `Submit.tsx` into a 5-step wizard with draft auto-save |
| 2 | Reviewer dashboard: deadline urgency pills, accept/decline inline, conflict-of-interest declaration step |
| 3 | Admin: redesign with KPI hero ("3 manuscripts awaiting decision"), recharts for submissions-over-time, zebra tables, themed to navy/coral |
| 4 | Notifications center icon in header with badge count |

### Phase 4 — Identity & polish
| # | Change |
|---|---|
| 1 | Programmatic issue-cover generator (volume/issue/month over a templated background) |
| 2 | Motion: framer-motion fade-up on Featured, shimmer skeletons, animated stat counters |
| 3 | Editorial board page: hierarchical cards with photo, role chip, ORCID/email/LinkedIn |
| 4 | About page: timeline of the journal + "Indexed in" logo wall (DOAJ, Crossref, future PubMed) |
| 5 | Author Guidelines / Ethics: split into sectioned accordions + downloadable PDF checklist |

### Phase 5 — Advanced (scale)
- Full Arabic/English bilingual with RTL flip of the entire shell
- Altmetric donut + dimensions badge per article
- Personalized "For You" home rail once a user has reading history
- Editorial decision letter templates with merge-fields, sent via Resend

---

## Final scorecard

| Surface | Score | Top fix |
|---|---|---|
| Visual identity (color/type/logo) | 8.5 | Add semantic status/category tokens |
| Homepage | 6.5 | Skeletons + section rhythm + more rails |
| Article page | 6.5 | Sticky rail, metrics, related articles |
| Listings/Archive | 7 | Result counts, real issue covers |
| Auth/Submit/Profile | 6 | Wizard, ORCID, branded auth |
| Admin/Reviewer | 5.5 | Re-skin in journal identity, KPI hierarchy |
| Static pages | 6 | Breadcrumbs + shared PageHeader + accordions |
| Mobile | 7 | FAB, hero stack fix |
| Dark mode | 7 | Audit each page dark-first |
| Motion/polish | 4 | Skeletons + scroll reveals |

---

## What I propose to build next (if approved)
Start with **Phase 1 (Quick wins)** — 7 changes, mostly token + layout, no schema work. Highest perceived-quality lift per hour. After that I'll come back with screenshots and we pick between Phase 2 (reading experience) or Phase 3 (editorial flow).
