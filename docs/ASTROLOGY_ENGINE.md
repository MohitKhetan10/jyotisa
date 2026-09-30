# Astrology Engine

## Ephemeris

| | |
|---|---|
| Package | [`swisseph-wasm`](https://www.npmjs.com/package/swisseph-wasm) `0.1.0` |
| Underlying library | Swiss Ephemeris 2.10.03 (Astrodienst AG) |
| Wrapper license | GPL-3.0-or-later |
| **Swiss Ephemeris license** | **AGPL-3.0**, or paid commercial license from Astrodienst AG (<swisseph@astro.com>) |
| Data | Bundled `.se1` files: `sepl_18` (planets), `semo_18` (Moon), `seas_18` (asteroids) |
| Coverage | ~1800–2400 AD |
| Precision | Full Swiss Ephemeris precision (arc-second), **not** the lower-precision Moshier fallback |
| Assets | `swisseph.wasm` (~562 KB) + `swisseph.data` (~2.1 MB), loaded once and cached |

### Why `.se1` (full) over Moshier

The `.se1` build matches the results of a reference Swiss Ephemeris server
implementation that was independently validated. Choosing it honours the rule
that calculations must be real and reproducible, never approximated silently.

### Browser asset loading

`swisseph-wasm` locates its assets via `new URL('../wasm/' + file, import.meta.url)`.
Because that path is dynamic, Vite cannot statically emit `swisseph.data`. The
built JS chunk lives in `/assets/`, so `../wasm/` resolves to `/wasm/` at the site
root. `scripts/copy-wasm.mjs` (run by `predev`/`prebuild`) copies the two assets
into `public/wasm/` so those URLs resolve in both dev and production.

## Configuration

- **Zodiac:** sidereal (`SEFLG_SIDEREAL`)
- **Ayanāṁśa:** Lahiri default (`SE_SIDM_LAHIRI`); Raman, Krishnamurti and
  Fagan–Bradley are wired in `AYANAMSHA_MODE`.
- **Houses:** whole-sign — the ascendant's sign becomes house 1; each subsequent
  sign is the next house. Computed from `houses_ex(..., 'W')`; only the ascendant
  longitude is needed for whole-sign assignment.
- **Speed flag** (`SEFLG_SPEED`) is used so retrograde motion (negative longitude
  speed) is detected.
- **Rahu** uses the true node (`SE_TRUE_NODE`); **Ketu** is derived as Rahu + 180°.

## Derived properties

- **Nakshatra / pada:** longitude ÷ (360/27); pada = quarter within the nakshatra.
- **Dignity:** exaltation / debilitation / own-sign by classical Parashari tables
  (`src/data/dignities.ts`).
- **Combustion:** angular separation from the Sun within classical orbs
  (Moon 12°, Mars 17°, Mercury 14°, Jupiter 11°, Venus 10°, Saturn 15°).

## Reliability

Birth-time accuracy drives the ascendant, houses, divisional charts and dashā
balance. When the user marks the time unknown, the chart is computed at local
noon and flagged `reliability: 'low'`; the UI warns that timing-dependent results
are unreliable.

## Extending / swapping the engine

Only `src/engine/ephemeris/swiss.ts` imports `swisseph-wasm`. It emits a plain
`RawChart` (`src/types/chart.ts`). To swap astronomy backends, reimplement that
one module to produce the same `RawChart`; nothing else changes.
