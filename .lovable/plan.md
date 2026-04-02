

# Fix Broken Footer Links

## Changes to `src/components/Footer.tsx`

### Quick Links section (lines 34-39)
- **Current Issue** `#` → `/articles` (points to the articles listing)
- **Archive** `#` → `/archive`
- **CME Activities** — remove entirely (no CME page exists)

### Social media links (lines 18-28)
- Remove all three placeholder social links (Twitter, LinkedIn, YouTube) since there are no real social media URLs configured

### Bottom bar links (lines 83-87)
- Remove **Privacy Policy**, **Terms of Use**, and **Accessibility** placeholder links (no pages exist for these)
- Keep just the copyright text

### Brand name fix (line 14)
- Change `YJPRS` → `YJPRBS` to match the header branding

No other files need changes — the Hero buttons and QuickLinks component already point to real routes based on prior edits.

