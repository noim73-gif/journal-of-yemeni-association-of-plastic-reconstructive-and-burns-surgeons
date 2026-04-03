

# Improvement Plan — Priority Implementation

## Overview
Address the most impactful issues: fix misleading content, broken navigation, missing search, and PDF downloads. These are the changes that most affect credibility and usability.

## Phase 1: Critical Fixes (Immediate)

### 1. Fix Hero Statistics & Buttons
**File**: `src/components/Hero.tsx`
- Replace fake stats (12.5 IF, 78+ years, 50K+ subs) with real or conservative numbers (e.g., "Est. 2011", article count from DB, or remove stats entirely)
- Wire "Read Current Issue" button → `/articles`
- Wire "Submit Your Research" button → `/submit`

### 2. Fix "Current Issue" Nav Link
**File**: `src/components/Header.tsx`
- Change `#current-issue` → `/articles` (route, not anchor)
- Mark it as `isRoute: true`

### 3. Add Working Search
**Files**: New `src/components/SearchDialog.tsx`, update `src/components/Header.tsx`
- Create a command-palette style search dialog (Cmd+K / click)
- Search articles by title, authors, keywords from the `articles` table
- Show results with links to article pages

### 4. Wire Hero Buttons with Navigation
**File**: `src/components/Hero.tsx`
- Import `useNavigate` and add click handlers to both hero buttons

## Phase 2: Indexing & SEO

### 5. Per-Page Document Titles
**Files**: All page components
- Add `useEffect` to set `document.title` on each page (e.g., "Submit Manuscript | YJPRBS")

### 6. Open Graph Tags on Article Pages
**File**: `src/pages/Article.tsx`
- Add `og:title`, `og:description`, `og:image` meta tags alongside existing citation tags

## Phase 3: Academic Features

### 7. Surface PDF Galley Downloads
**File**: `src/pages/Article.tsx`
- Query `article_galleys` for the current article
- Show download buttons for available galleys (PDF, HTML, XML)

### 8. Add Article Search & Filtering to Articles Page
**File**: `src/pages/Articles.tsx`
- Add search input, category filter, and volume/issue filter
- Client-side or server-side filtering of the articles list

### 9. Add File Size Validation to Submissions
**File**: `src/pages/Submit.tsx`
- Check `file.size` before upload, reject files > 20MB with a toast error

## Technical Details

| Priority | Change | Files |
|----------|--------|-------|
| Critical | Fix fake stats / remove them | `Hero.tsx` |
| Critical | Fix nav "Current Issue" link | `Header.tsx` |
| Critical | Wire hero buttons | `Hero.tsx` |
| Critical | Add search functionality | New `SearchDialog.tsx`, `Header.tsx` |
| High | Per-page `<title>` tags | All page components |
| High | OG meta tags on articles | `Article.tsx` |
| High | PDF galley download buttons | `Article.tsx` |
| Medium | Article search/filter | `Articles.tsx` |
| Medium | File size validation | `Submit.tsx` |

