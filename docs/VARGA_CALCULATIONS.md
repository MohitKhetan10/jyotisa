# Varga (Divisional Chart) Calculations

Implemented in `src/engine/varga/varga.ts`. Each varga maps a sidereal longitude
to a resulting sign (0–11). **Vedic schools differ on some varga methods** — this
engine uses one consistent Parāśarī convention (as in mainstream software such as
Jagannātha Horā) so results are reproducible. The convention per varga:

| Varga | Div | Method used |
|---|---|---|
| D1 Rāśi | 1 | sign = ⌊lon/30⌋ |
| D2 Horā | 2 | Odd sign: 1st half → Leo, 2nd → Cancer; even sign reversed |
| D3 Dreṣkāṇa | 3 | 10° parts → same, 5th, 9th from the sign |
| D4 Caturthāṁśa | 4 | 7.5° parts → same, 4th, 7th, 10th (kendras) |
| D7 Saptāṁśa | 7 | Odd: from same sign; even: from the 7th; then count |
| D9 Navāṁśa | 9 | Continuous 3°20′ mapping (⌊lon/(30/9)⌋ mod 12) |
| D10 Daśāṁśa | 10 | Odd: from same sign; even: from the 9th; then count |
| D12 Dvādaśāṁśa | 12 | Count from the sign itself |
| D16 Ṣoḍaśāṁśa | 16 | Start by modality: movable→Aries, fixed→Leo, dual→Sagittarius |
| D20 Viṁśāṁśa | 20 | movable→Aries, fixed→Sagittarius, dual→Leo |
| D24 Caturviṁśāṁśa | 24 | Odd→Leo, even→Cancer |
| D27 Bhāṁśa | 27 | By element: fire→Aries, earth→Cancer, air→Libra, water→Capricorn |
| D30 Triṁśāṁśa | 30 | Unequal 5/5/8/7/5° ruler segments (odd), reversed (even) |
| D40 Khavedāṁśa | 40 | Odd→Aries, even→Libra |
| D45 Akṣavedāṁśa | 45 | movable→Aries, fixed→Leo, dual→Sagittarius |
| D60 Ṣaṣṭyāṁśa | 60 | Count from the sign itself (0.5° parts) |

**Vargottama** (`isVargottama`): same sign in D1 and D9 — a mark of strength.

**D60 warning:** at 0.5° per division, even a one-minute birth-time error can move
a planet a full division. The UI flags this.
