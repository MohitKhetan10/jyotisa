# Jyotiṣa — Free, Private Vedic Astrology

A free, account-free, privacy-first Vedic astrology platform. Enter your birth
details and explore your complete chart — planetary positions, houses,
nakshatras, dashās, divisional charts, yogas, transits and traditional remedies —
computed entirely **in your browser**. No backend, no tracking, birth data never
leaves the device.

> **Honest, not scary.** Interpretations name both strengths and difficulties,
> always framed as workable. Calculations are presented as calculations;
> interpretations are labelled *traditional Vedic interpretation* — never
> scientific fact, never deterministic ("you will definitely…") claims.

---

## ⚖️ Licensing — read this first

This app computes with the **Swiss Ephemeris** (via
[`swisseph-wasm`](https://www.npmjs.com/package/swisseph-wasm)), which is licensed
under the **GNU AGPL-3.0**. This has real consequences:

- **This project is therefore AGPL-3.0.** See [`LICENSE`](./LICENSE).
- Under the AGPL, if you run a **modified** version as a network service, you
  must offer your users the **complete corresponding source code** of your
  version.
- If you want to ship a **closed-source / proprietary** derivative, you must buy
  a **commercial Swiss Ephemeris license** from Astrodienst AG
  (<swisseph@astro.com>) instead of relying on the AGPL grant.

Do **not** re-license this project or fold it into a closed-source product
without resolving the Swiss Ephemeris license first. See
[`docs/ASTROLOGY_ENGINE.md`](./docs/ASTROLOGY_ENGINE.md).

---

## Architecture

Strict separation of concerns — the astronomy engine is isolated so it can be
audited or swapped without touching interpretation:

```
src/
  engine/
    ephemeris/swiss.ts   ← the ONLY module that talks to Swiss Ephemeris
    zodiac/zodiac.ts      ← pure sign/degree/nakshatra math (no ephemeris)
    houses/ varga/ …      ← consume RawChart, never the raw engine
  data/                   ← dignities, (later) yogas, remedies, glossary
  types/chart.ts          ← engine-agnostic domain types
  lib/places.ts           ← inbuilt Nepal+India birthplace search (offline)
  store/chart.ts          ← Zustand + LocalStorage (inputs persisted, chart derived)
  components/ pages/       ← UI
```

The ephemeris layer produces a plain `RawChart`; every other layer (varga, dasha,
yoga, interpretation, UI) depends only on that. A future AI explanation layer
would receive the already-computed `RawChart` — it must never invent positions,
dates, yogas or astronomical facts.

## Calculation configuration (defaults)

| Setting | Default |
|---|---|
| Zodiac | Sidereal |
| Ayanāṁśa | **Lahiri** (configurable: Raman, Krishnamurti, Fagan–Bradley) |
| Houses | Whole-sign |
| Ephemeris | Swiss Ephemeris 2.10 `.se1` data (~1800–2400 AD), full precision |
| Nodes | True node (Rahu); Ketu = Rahu + 180° |

## Develop

```bash
npm install
npm run dev      # copies WASM assets to public/wasm, starts Vite
```

## Build & deploy (Netlify)

```bash
npm run build    # prebuild copies WASM; tsc + vite build → dist/
```

`netlify.toml` sets the SPA redirect, security headers and long-cache headers for
the WASM/ephemeris assets. Deploy `dist/` — no server required.

## Verify the engine

```bash
npm run verify:engine     # Node: prints Lahiri positions for a known birth
node scripts/smoke-browser.mjs   # drives the built app in Chrome end-to-end
```

## Privacy

Birth details are processed **locally in your browser**. Nothing is sent to a
server. No account, email, phone, payment or social login is required. The
birthplace database is bundled and searched offline.

## Status

All core phases implemented and browser-verified. See `docs/` for methodology.

**Implemented & working (computed, not faked):**
- Isolated Swiss Ephemeris engine; birth input; inbuilt Nepal+India locations.
- D1 rāśi chart (North Indian) + planetary positions (dignity/retrograde/combustion).
- The 12 houses framework with all classifications (`/houses`).
- All **16 vargas** (`/vargas`) — documented Parāśarī convention; vargottama.
- **Vimśottarī daśā** with antar + pratyantar and current-period detection (`/dashas`).
- **Yoga** engine (Mahāpuruṣa, Gaja-Kesari, Rāja, Dhana, lunar, Viparīta, exchange…)
  and **Dosha** engine (Maṅglik, Kāla Sarpa, Grahaṇa, Kemadruma) with cancellations (`/yogas`).
- **Strength** (documented heuristic; full Ṣaḍbala marked pending) and a
  rules-based **interpretation** engine with the transparent "Why?" format (`/analysis`).
- **Transits / Sade Sati** (`/today`), **Pañcāṅga** (`/panchanga`),
  **Remedies** with priority + gemstone cautions (`/remedies`),
  **Aṣṭakūṭa compatibility** (`/match`), searchable **Encyclopedia** (`/learn`),
  **Methodology** (`/methodology`).
- JSON export + print; PWA (installable, offline service worker); Netlify config.
- **16 engine unit tests** (`npm run test`) + end-to-end browser smoke test.

**Roadmap (architecture ready, intentionally not faked):** additional daśā systems
(Yoginī/Aṣṭottarī/Chara), full classical Ṣaḍbala, Ashtakavarga, muhūrta module,
chart rectification, more chart styles (South/East Indian), PDF export, i18n
(Nepali/Hindi). These are marked pending rather than approximated.

## Disclaimer

Astrology is interpretive and cultural, not scientifically validated. This tool
does not diagnose disease, predict death, or guarantee life outcomes. For health,
legal or financial concerns, consult a qualified professional.
