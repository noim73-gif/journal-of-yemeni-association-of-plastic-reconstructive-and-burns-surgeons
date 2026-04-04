

# Plan: Add Journal Logo to Header and Footer

## Overview
Replace the text-only logo placeholders in the header and footer with the uploaded journal logo image.

## Steps

### 1. Copy the logo to the project
- Copy `user-uploads://Untitled_design_20260301_205121_0000.png` to `src/assets/journal-logo.png`

### 2. Update Header (`src/components/Header.tsx`)
- Replace the circular `div` with "YJ" text (lines 80-82) with an `<img>` tag using the imported logo
- Size: ~40px height, auto width
- Keep the ISSN text below

### 3. Update Footer (`src/components/Footer.tsx`)
- Replace the circular `div` with "J" text (lines 11-13) with an `<img>` tag using the same logo
- Add a white/light filter or use a smaller version appropriate for the dark footer background

### Technical Details

| File | Change |
|------|--------|
| `src/assets/journal-logo.png` | Logo image (copied from upload) |
| `src/components/Header.tsx` | Import logo, replace text placeholder with `<img>` |
| `src/components/Footer.tsx` | Import logo, replace text placeholder with `<img>`, add brightness filter for dark bg |

