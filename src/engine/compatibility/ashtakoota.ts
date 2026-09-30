// ─────────────────────────────────────────────────────────────────────────
//  AṢṬAKŪṬA (Guṇa Milāna), 8-fold Vedic compatibility, 36 points total.
//  Shown as INDIVIDUAL components with explanations, never a single score in
//  isolation. Based on the two Moon nakṣatras and Moon signs.
// ─────────────────────────────────────────────────────────────────────────
import type { RawChart } from '../../types/chart';
import { NAKSHATRA_DATA } from '../../data/nakshatras';
import { signLordOf } from '../../data/dignities';

export interface Koota { name: string; max: number; got: number; note: string; }
export interface MatchReport {
  kootas: Koota[];
  total: number;
  max: 36;
  verdict: string;
}

const varnaOf = (sign: number) => [3, 2, 1, 0][sign % 4]; // Brahmin=3(water)…Shudra=0(air)
const VASHYA_GROUP = [0, 1, 0, 2, 0, 1, 3, 2, 4, 1, 3, 2]; // simplified group per sign

// Yoni friend/enemy handled via the animal name equality + a small enemy set.
const YONI_ENEMIES: Record<string, string> = {
  Horse: 'Buffalo', Buffalo: 'Horse', Elephant: 'Lion', Lion: 'Elephant',
  Dog: 'Deer', Deer: 'Dog', Cat: 'Rat', Rat: 'Cat', Serpent: 'Mongoose',
  Mongoose: 'Serpent', Sheep: 'Monkey', Monkey: 'Sheep', Cow: 'Tiger', Tiger: 'Cow',
};

function moonInfo(chart: RawChart) {
  const moon = chart.planets.find((p) => p.planet === 'Moon')!;
  return { nak: NAKSHATRA_DATA[moon.nakshatraIndex], signIndex: moon.signIndex };
}

export function ashtakoota(a: RawChart, b: RawChart): MatchReport {
  const A = moonInfo(a); const B = moonInfo(b);
  const kootas: Koota[] = [];

  // 1. Varna (1), bride's varna should not exceed groom's.
  const va = varnaOf(A.signIndex), vb = varnaOf(B.signIndex);
  kootas.push({ name: 'Varṇa', max: 1, got: va >= vb ? 1 : 0,
    note: 'Spiritual compatibility / ego harmony.' });

  // 2. Vashya (2), mutual attraction/control by sign group.
  kootas.push({ name: 'Vaśya', max: 2, got: VASHYA_GROUP[A.signIndex] === VASHYA_GROUP[B.signIndex] ? 2 : 1,
    note: 'Mutual magnetism and influence.' });

  // 3. Tārā (3), count between nakṣatras, both directions.
  const taraScore = (from: number, to: number) => {
    const count = ((to - from + 27) % 27) + 1;
    const r = count % 9;
    return [1, 0, 1, 1, 0, 1, 0, 1, 1][r === 0 ? 8 : r - 1] ? 1.5 : 0;
  };
  kootas.push({ name: 'Tārā', max: 3, got: taraScore(A.nak.index, B.nak.index) + taraScore(B.nak.index, A.nak.index),
    note: 'Health, well-being and destiny of the couple.' });

  // 4. Yoni (4), instinctive/physical compatibility by animal symbol.
  const yoni = A.nak.yoni === B.nak.yoni ? 4
    : YONI_ENEMIES[A.nak.yoni] === B.nak.yoni ? 0 : 2;
  kootas.push({ name: 'Yoni', max: 4, got: yoni, note: 'Instinctive and physical compatibility.' });

  // 5. Graha Maitrī (5), friendship of Moon-sign lords.
  const la = signLordOf(A.signIndex), lb = signLordOf(B.signIndex);
  kootas.push({ name: 'Graha Maitrī', max: 5, got: la === lb ? 5 : 3,
    note: 'Mental and intellectual friendship (Moon-sign lords).' });

  // 6. Gaṇa (6), temperament (Deva/Manushya/Rakshasa).
  const gana = A.nak.gana === B.nak.gana ? 6
    : (A.nak.gana === 'Rakshasa') !== (B.nak.gana === 'Rakshasa') ? 1 : 5;
  kootas.push({ name: 'Gaṇa', max: 6, got: gana, note: 'Temperament and nature.' });

  // 7. Bhakūṭa (7), Moon-sign distance (2/12, 5/9, 6/8 are afflicted).
  const d = ((B.signIndex - A.signIndex + 12) % 12) + 1;
  const bad = [2, 12, 5, 9, 6, 8].includes(d);
  kootas.push({ name: 'Bhakūṭa', max: 7, got: bad ? 0 : 7,
    note: 'Emotional harmony and prosperity of the family.' });

  // 8. Nāḍī (8), must differ (same Nāḍī is the classic Nāḍī doṣa).
  kootas.push({ name: 'Nāḍī', max: 8, got: A.nak.nadi === B.nak.nadi ? 0 : 8,
    note: 'Health and progeny; same Nāḍī is traditionally cautioned (often remediable).' });

  const total = kootas.reduce((s, k) => s + k.got, 0);
  const verdict = total >= 28 ? 'Excellent traditional compatibility.'
    : total >= 18 ? 'Acceptable, review the weaker kūṭas individually.'
    : 'Lower total, read each component; a low score is not a verdict on the relationship.';

  return { kootas, total: Number(total.toFixed(1)), max: 36, verdict };
}
