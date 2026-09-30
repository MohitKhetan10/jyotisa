# The 12 Houses (Bhāvas)

Encoded in `src/data/houses.ts` from the *Project Light · The 12 Houses*
framework. The house **engine** (`src/engine/houses/houses.ts`) assembles these
for a specific chart; the UI lives at `/houses`.

## The grammar of astrology

> The same actor, in a different role, in a different scene, creates a different story.

| Element | Sanskrit | Role | Question |
|---|---|---|---|
| Planet | Graha | the actor | Who is acting? |
| Sign | Rāśi | the role | How is it expressing? |
| House | Bhāva | the scene | Where is it happening? |
| House Lord | Bhāveśa | — | Where has that area of life gone? |

**Sign is not house.** The rising sign (Lagna) *becomes* the 1st house; every
other house is counted from it. A planet has **no single fixed result** — it is
modified by ownership, house/sign placement, association, aspect (dṛṣṭi),
strength (bala) and daśā. A bhāva is **never read alone** — always with its
sign, its lord, its occupants and its aspects.

## Classification systems

Every house participates in several geometries at once (`houseClasses(n)`):

| System | Houses |
|---|---|
| Kendra · Angular | 1, 4, 7, 10 |
| Panaphara · Succedent | 2, 5, 8, 11 |
| Apoklima · Cadent | 3, 6, 9, 12 |
| Trikoṇa · Trine | 1, 5, 9 |
| Upachaya · Growth | 3, 6, 10, 11 |
| Duḥsthāna · Difficult (Trika) | 6, 8, 12 |
| Āyu-sthāna · Longevity | 8 (primary), 3 (secondary) |
| Māraka · Longevity-reducing | 2, 7 |
| Dharma · Purpose | 1, 5, 9 |
| Artha · Material support | 2, 6, 10 |
| Kāma · Desire | 3, 7, 11 |
| Mokṣa · Liberation | 4, 8, 12 |

The 1st house is unique — Lagna, Kendra, Trikoṇa and Dharma at once. The 6th is
both Upachaya (growth) and Duḥsthāna (difficulty): *difficulty can become an
arena of growth.*

## Bhāvat Bhāvam ("house from house")

`houseFrom(from, count)` re-references the chart from any house and applies the
same count again:

- 5th from the 5th = **9th** (a secondary expression of 5th-house themes)
- 8th from the 8th = **3rd** (so the 3rd is secondary longevity, Āyu-sthāna)
- 12th from a house = its **loss** → 12th-from-8th = 7th, 12th-from-3rd = 2nd,
  which is the logic behind the Māraka houses (2, 7)

## Elemental correspondence (symbolic)

Fire = Dharma (1·5·9), Earth = Artha (2·6·10), Air = Kāma (3·7·11),
Water = Mokṣa (4·8·12). This is a symbolic correspondence via the natural
zodiac sequence — **house is not element**; elements belong intrinsically to
signs.
