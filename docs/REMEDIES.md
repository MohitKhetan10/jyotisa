# Remedies

Data: `src/data/remedies.ts`. Priority engine: `src/engine/remedies/prioritize.ts`.

## Principles

- All remedies are **devotional and harmless**: mantra, charity, fasting, deity
  worship, lifestyle. No fear-based content, no dangerous fasting or rituals.
- **Gemstones are never auto-recommended.** Each is listed with a caution
  explaining that chart-compatibility matters and expert guidance is required.
  Blue Sapphire (Śani) and the nodal stones carry the strongest warnings.

## Priority system

Rather than dumping every remedy, `prioritizeRemedies(chart)` selects a focus:

1. Runs the strength engine.
2. Scores each planet's *need* — weak band (+3) / moderate (+1), functional
   benefic (+2), debilitated (+2), combust (+1). Nodes excluded from primary.
3. Returns a **primary** planet + up to two **supporting** planets, each with a
   plain-language reason ("chosen because …").

The UI advises focusing on the primary remedy for 40 days before adding others.

## Per-planet fields

deity · day · mantra (Sanskrit + transliteration + japa count) · charity ·
fasting · lifestyle · gemstone (stone + caution).
