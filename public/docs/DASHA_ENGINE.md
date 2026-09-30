# Daśā Engine

Implemented in `src/engine/dasha/vimshottari.ts`.

## Vimśottarī (implemented)

- **Driver:** the Moon's nakṣatra at birth.
- **Lord order & years:** Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rāhu 18,
  Jupiter 16, Saturn 19, Mercury 17 (total **120**).
- **Year length:** 1 year = **365.2425 days** (mean Gregorian). Documented choice;
  schools also use 365.25 or 360 — the difference is small.
- **Balance at birth:** the first mahā-daśā is shown from birth with its
  *unelapsed* portion = `fullYears × (1 − fractionTraversed)`, where
  `fractionTraversed` is how far the Moon has moved through its nakṣatra.
- **Sub-periods:** antar and pratyantar are proportional — a sub-period's length =
  `parentYears × subLordYears / 120`, starting from the parent lord and cycling.
- **`currentDasha(periods, at?)`** returns the active maha / antar / pratyantar.

Because the first period is shown from birth with its balance, the visible
timeline from birth spans `120 − elapsed` years — the standard presentation.

## Other systems (architecture, not yet computed)

Yoginī, Aṣṭottarī, Chara and Nārāyaṇa daśās are recognised in the roadmap but are
**not implemented** and are not faked. They will be marked *experimental* in the UI
when added, per the project rule never to produce fabricated calculations.
