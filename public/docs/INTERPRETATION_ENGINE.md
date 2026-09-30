# Interpretation Engine

Implemented in `src/engine/interpret/interpret.ts`, with data in
`src/data/planets.ts` and `src/data/houses.ts`.

## Rules engine, not stored paragraphs

Interpretation is **composed from factors**, not a hardcoded paragraph per
placement. For each planet the engine combines:

- the planet's natural significations (kāraka) and Purāṇic soul-nature,
- the bhāva it occupies (significations, motto, question),
- its sign and dignity (exalted / own / debilitated / neutral),
- its computed **strength band** and **functional nature** for the Lagna,
- avasthā factors (retrograde, combustion).

## Output format (transparent)

Every interpretation returns the promised structure:

`whatItMeans · why[] · positive · challenge · whatModifies · timing · remedy · note`

- **why[]** lists the exact factors that produced the reading (the "Why?" button).
- **positive / challenge** are always *both* present — honest, never one-sided.
- **note** carries the standing disclaimer.

## Language rules

Non-deterministic, traditional wording — "traditionally associated with", "may
indicate". Never "you will definitely…". Calculations are stated as facts;
interpretations are explicitly labelled traditional, not scientific.

## Future AI layer

An AI explanation layer, if added, must receive the already-computed structured
data (RawChart + these interpretations) and must never invent positions, dates,
yogas or astronomical facts. Core calculations never depend on an AI model.
