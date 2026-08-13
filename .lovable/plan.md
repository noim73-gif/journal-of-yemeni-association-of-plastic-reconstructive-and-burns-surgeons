# Professional Submission & Editorial Platform Upgrade

A staged upgrade that takes the journal from a 5-step submission form to a submission and editorial system modelled on international medical-journal practice (COPE / ICMJE / EQUATOR / CRediT as reference frameworks — no compliance or indexing claims will be published on the site).

## What exists today (verified)

- 5-step wizard with dual autosave (localStorage + database drafts); authors, declarations and file names live inside a free-form `metadata` JSON field.
- Submissions carry `workflow_stage`, `review_type`, editor/section-editor/copyeditor/layout-editor assignments, plus `submission_files`, `submission_reviews`, `editorial_decisions` tables.
- Only two upload slots (manuscript + supplementary), 5 generic declarations, no article types, no reporting-guideline logic, no audit-trail table, no configurable article types/checklists/email templates, no reviewer invitation lifecycle (accept/decline/deadline/reminders), single English locale.

## Phase 1 — Submission data model + 7-step wizard (Critical)

New tables (additive only, no data loss): `article_types`, `submission_authors` (name, degree, ORCID, department, institution, country, email, role, CRediT roles, order, corresponding), `submission_declarations`, `submission_checklist_items`, `submission_audit_log`. Existing `metadata` drafts are migrated in place, and current submissions keep working.

Wizard becomes 7 steps:
1. Article type (Original Research → Editorial, driven by `article_types`)
2. Manuscript information (title, abstract, keywords, word count, language, funding, COI, data availability, ethics approval, trial registration, patient consent)
3. Authors (add/reorder, corresponding author, CRediT contribution matrix)
4. Files (typed slots: main manuscript, title page, figures, tables, supplementary, ethics approval, reporting checklist, cover letter; DOCX/PDF/XLSX/CSV/JPG/PNG/TIFF with per-slot validation)
5. Declarations (ethics, consent, COI, funding, data availability, contributions, acknowledgments, AI-use declaration, trial registration)
6. Reporting guideline — auto-recommended from article type (PRISMA / CONSORT / STROBE / STARD / CARE / RIGHT / COREQ) with checklist upload
7. Final compliance check — blocking checklist; submit disabled until mandatory items pass

## Phase 2 — Editorial workflow + audit trail (Critical)

Full stage machine: Submitted → Technical Check → Editorial Assessment → Editor Assigned → Reviewer Invitation → Peer Review → Revision → Re-review → Decision → Accepted → Copyediting → Production → Proof → Published, with decisions Reject / Major Revision / Minor Revision / Accept. Every stage change, assignment, decision, file upload and review action writes an immutable audit row (actor, action, before/after, timestamp) visible to editors only.

## Phase 3 — Peer review system (High)

Reviewer database view (expertise, ORCID, institution, specialties, past review history and turnaround). Invitation lifecycle: invite → accept/decline → deadline → automated reminders (scheduled function) → submitted review with recommendation, author-facing comments and confidential editor comments. Review model configurable per journal and per submission: single-blind, double-blind, open. Reviewer identities never exposed to authors in blinded models — enforced by row-level rules, not UI hiding.

## Phase 4 — Dashboards (High)

Editor dashboard: queues for new submissions, technical checks, awaiting assignment, under review, overdue reviews, revisions pending, accepted, rejected, published; metrics for average time to first decision, average review time, acceptance/rejection rate, submissions volume, active reviewers.

Author dashboard: drafts, submitted manuscripts with a stage timeline, revision requests, decisions, editor messages, revised-manuscript and response-to-reviewers upload, publication status and DOI.

## Phase 5 — Admin configuration + email templates (Medium)

Admin area to configure article types, required fields, submission checklist, review model, review deadlines, workflow stages, APC text, DOI prefix/settings and publication settings. Editable email templates (registration, submission, confirmation, editor assignment, reviewer invitation/reminder, revision request, decision, acceptance, rejection, proof, publication) rendered by the existing mail function.

## Phase 6 — Policies, metadata, security, UX (Medium)

- Policy pages: publication ethics, research ethics, human subjects, animal research, consent, COI, funding, data sharing, plagiarism, duplicate publication, fabrication, authorship, corrections, retractions, complaints/appeals, misconduct, copyright, licensing, open access, APC, archiving/preservation, AI policy, advertising, privacy — written as journal policy, with no accreditation or indexing claims.
- Article metadata completed for Crossref-ready output (ORCID, affiliations, license, funding, COI, data availability, article type) extending the existing JATS export.
- Security review: role-based access on every new table, private manuscript storage with signed URLs only, reviewer-identity protection, audit logs, session and upload hardening.
- Accessibility and mobile pass on the wizard and dashboards; validation messages made specific and inline.

## Phase 7 — Final audit report (Low)

An admin "Platform Audit" page listing current status, problems found, changes implemented, remaining gaps and future recommendations, each tagged Critical / High / Medium / Low.

## Technical notes

- All database changes are additive; no column or table is dropped. Existing draft `metadata` is copied into the new author/declaration tables by a one-time backfill inside the migration, and the wizard reads new tables with a fallback to `metadata`.
- Reminder emails and deadline checks run as a scheduled backend function.
- Arabic/RTL support is deferred: it needs a translation layer across every page and is best done after the workflow stabilises. I will note it as a recommended future improvement rather than half-implement it.

## Suggested execution order

Phase 1 and 2 first (they define the data model everything else reads), then 3, 4, 5, 6, 7. Each phase ships and is verifiable on its own.
