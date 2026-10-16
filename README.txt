SHELTER RELIEF PROJECTION — STANDALONE UI DEMO
================================================

FILES
  index.html           Open this page in a browser
  styles.css           Original mockup layout and behavior styles
  evactech-theme.css   Visual alignment to the actual EvacTech design system
  app.js               Fabricated records, projections, rules, CSV export

HOW TO RUN
  1. Extract the ZIP archive.
  2. Open index.html in Chrome, Edge, or Firefox.
  3. No XAMPP, Laravel, PHP, MySQL, npm, or build step is required.
  4. Keep all four files together in the same folder.

VISUAL DESIGN
  - Light-theme palette, buttons, borders, spacing, sidebar styling and
    typography scale are based on the EvacTech source ZIP dated 2026-10-14.
  - EvacTech uses Public Sans (interface) and IBM Plex Mono (numeric display).
  - When online, the theme loads these font families from Google Fonts.
    When offline, the app remains fully functional, but uses installed or
    system fallback fonts if the exact families are not available locally.
    The ZIP contains no font files.
  - Mobile city-wide shelter rows are stacked for readable details/actions.
    Wide household breakdown tables can scroll horizontally.

FEATURES
  - Six fictional Cabuyao shelters with 213 synthetic households.
  - Interactive city stats, shelter search and barangay filter.
  - Per-shelter FFP projections with per-household calculation explanations.
  - Counting options: include all members (default), or exclude infants
    aged 0-6 months from the standard family-food-pack calculation.
  - Select 2, 3, 4, 6, 7, or 14 days, using conservative 2-day pack periods.
  - Household-profile special-relief suggestions by item or by household.
  - Session-only editable item rates, enable/disable and reset rules.
  - Export city or shelter projected results as CSV.

IMPORTANT
  This is a demonstration, NOT an EvacTech code change.
  The page does not connect to EvacTech or any actual records.
  Names, membership, household profiles, and quantities are synthetic.
  No data are persisted; there are no requests, approvals, deductions, or
  stock updates. The demo works offline (with font fallback).
  Suggestion rules are NOT official DSWD quantity standards.
  Actual special assistance requires assessment by relevant officials.
  The listed FFP contents are an illustrative DSWD reference and may vary.
  FFPs are counted as sealed wholes; no ingredient-level accounting occurs.
  Bottled water is treated separately from the reference sealed FFP.

END
