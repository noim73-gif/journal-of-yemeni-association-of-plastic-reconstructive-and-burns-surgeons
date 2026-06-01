
# Phase 3.1 — Submission Wizard with Draft Auto-Save

Convert the single long submission form into a 5-step wizard with progress tracking, per-step validation, COPE declarations, and dual-tier auto-save (localStorage instantly, database every ~8s and on step change).

## Wizard structure

```text
[1] Authors & Title  →  [2] Files  →  [3] Metadata  →  [4] Cover Letter & Declarations  →  [5] Review & Submit
```

| Step | Fields | Required to advance |
|---|---|---|
| 1. Authors & Title | `title`, `authors` (multi-row: name, affiliation, email, ORCID, corresponding flag) | Title + ≥1 author with name |
| 2. Files | manuscript file, supplementary file (optional), file-type & size validation | Manuscript present |
| 3. Metadata | `category`, `keywords`, `abstract` (with live word count, max 300) | Category + abstract |
| 4. Cover Letter & Declarations | `cover_letter` + COPE checkboxes: conflict-of-interest, ethics approval, patient consent, authorship contributions, not-published-elsewhere | All 5 declarations checked |
| 5. Review & Submit | Read-only summary of all fields + final Submit button | — |

Header shows a `<Stepper>` (1·2·3·4·5) with completed checkmarks; clicking a previously visited step jumps back.

## Auto-save behavior

- **localStorage** (`yjprbs:submission-draft:<userId>`) — debounced 800ms on any field change. Survives reload/closed tab.
- **Database** — `submissions` row with `status='draft'`. Written:
  - First write when user enters Step 2 (so we have an ID for file uploads)
  - Debounced 8s during editing
  - Immediately on step change and on `beforeunload`
- **Resume**: on mount, fetch latest `status='draft'` row for user; if newer than localStorage, hydrate from DB, else from localStorage.
- **"Draft saved Xs ago"** indicator next to the stepper.
- **Discard draft** button on Step 1.

## Final submit

- Sets `status='pending'`, writes `metadata.declarations = {...}` and `metadata.authors = [...]` (structured authors array), clears localStorage key, fires existing `send-submission-notification`.

## Files to add / change

| File | Change |
|---|---|
| `src/pages/Submit.tsx` | Replace body with `<SubmissionWizard />` shell + auth/sign-in guard |
| `src/components/submit/SubmissionWizard.tsx` | NEW — orchestrator: state, autosave hooks, stepper, footer nav (Back / Save & Exit / Continue / Submit) |
| `src/components/submit/Stepper.tsx` | NEW — visual stepper with completed/active/locked states |
| `src/components/submit/StepAuthors.tsx` | NEW — title + dynamic authors array (add/remove rows, ORCID + corresponding) |
| `src/components/submit/StepFiles.tsx` | NEW — reuses current dropzone UI, adds per-file validation messages |
| `src/components/submit/StepMetadata.tsx` | NEW — category, keywords (chip input), abstract with word counter |
| `src/components/submit/StepDeclarations.tsx` | NEW — cover letter + COPE checkboxes |
| `src/components/submit/StepReview.tsx` | NEW — read-only summary cards |
| `src/hooks/useSubmissionDraft.tsx` | NEW — manages localStorage + DB draft, debounce, resume, `saveNow()`, `discard()` |
| `src/hooks/useSubmissions.tsx` | Add `saveDraft(input, draftId?)` (insert/update with `status='draft'`) and `submitDraft(draftId, input)` (update with `status='pending'`) |

## Database migration (one migration)

- Update RLS policy `Users can update pending submissions` → `Users can update own draft or pending submissions` so `status IN ('draft','pending')` is updatable by author. (UPDATE-only; no schema columns added — declarations and structured authors live in existing `metadata jsonb`.)
- Add index `idx_submissions_user_draft` on `(user_id, status, updated_at desc)` to speed draft lookup.

## Out of scope (later phases)

- Admin/reviewer dashboard reskin (Phase 3.2)
- Notifications center (Phase 3.3)
- Multi-file figure uploads as separate rows (current single supplementary file kept)

## Technical notes

- Author rows stored as React state array; serialized to `metadata.authors` JSON; legacy `authors` text column kept as `"Name1; Name2; ..."` for backward compatibility with article rendering.
- Word count uses `text.trim().split(/\s+/).filter(Boolean).length`.
- Debounce via a small `useDebouncedCallback` inline (no new dep).
- Validation per step prevents `Continue` button enablement; failed validation shows inline field errors.
- Mobile: stepper collapses to "Step 2 of 5 · Files" with progress bar.
