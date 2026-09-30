// ─────────────────────────────────────────────────────────────────────────
//  THE 12 HOUSES (Bhāvas)
//
//  Encoded from the "Project Light · The 12 Houses" teaching framework.
//  Kept as pure data, separate from the calculation engine, so the house
//  engine and interpretation layer can reason about a house's many geometries.
//
//  Grammar of astrology (deck): the same actor, in a different role, in a
//  different scene, creates a different story.
//    Planet (Graha)  = the actor   → WHO is acting?
//    Sign   (Rāśi)   = the role    → HOW is the actor expressing itself?
//    House  (Bhāva)  = the scene   → WHERE is the action happening?
//    House Lord (Bhāveśa)          → WHERE has that area of life gone?
//  A planet has no single fixed result, it is modified by ownership,
//  placement, association, aspect (dṛṣṭi), strength (bala) and daśā.
//
//  Principle: Sign is NOT House. The rising sign (Lagna) becomes the 1st
//  house; every other house is counted from there. A bhāva is never read
//  alone, always with its sign, its lord, its occupants and its aspects.
// ─────────────────────────────────────────────────────────────────────────

export type Purushartha = 'dharma' | 'artha' | 'kama' | 'moksha';
export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Angularity = 'kendra' | 'panaphara' | 'apoklima';

export interface HouseInfo {
  house: number; // 1-12
  motto: string; // "I AM", "I HAVE", …
  title: string; // House of Self & Body
  sanskrit: string[]; // Tanu Bhāva, Lagna Bhāva
  question: string; // WHO AM I?
  significations: string[];
  purushartha: Purushartha;
  element: Element; // symbolic correspondence via the natural zodiac
  angularity: Angularity;
  /** Functional classifications this house belongs to. */
  trikona: boolean; // trine, 1,5,9
  upachaya: boolean; // growth, 3,6,10,11
  duhsthana: boolean; // difficult / trika, 6,8,12
  ayusthana: boolean; // longevity, 8 (primary), 3 (secondary)
  maraka: boolean; // longevity-reducing, 2,7
}

export const HOUSES: HouseInfo[] = [
  {
    house: 1, motto: 'I AM', title: 'House of Self & Body',
    sanskrit: ['Tanu Bhāva', 'Lagna Bhāva'], question: 'Who am I?',
    significations: ['Body', 'Appearance', 'Health', 'Vitality', 'Character',
      'Temperament', 'Identity', 'Self-awareness', 'Direction of life'],
    purushartha: 'dharma', element: 'fire', angularity: 'kendra',
    trikona: true, upachaya: false, duhsthana: false, ayusthana: false, maraka: false,
  },
  {
    house: 2, motto: 'I HAVE', title: 'House of Wealth, Family & Speech',
    sanskrit: ['Dhana Bhāva', 'Kutumba Bhāva'], question: 'What sustains me?',
    significations: ['Accumulated wealth', 'Family', 'Speech', 'Food', 'Possessions',
      'Resources', 'Education', 'Face and mouth', 'Values'],
    purushartha: 'artha', element: 'earth', angularity: 'panaphara',
    trikona: false, upachaya: false, duhsthana: false, ayusthana: false, maraka: true,
  },
  {
    house: 3, motto: 'I ACT', title: 'House of Courage, Effort & Skills',
    sanskrit: ['Sahaja Bhāva'], question: 'What am I willing to do?',
    significations: ['Courage', 'Initiative', 'Effort', 'Communication', 'Skills',
      'Writing', 'Hobbies', 'Younger siblings', 'Short journeys', 'Self-effort'],
    purushartha: 'kama', element: 'air', angularity: 'apoklima',
    trikona: false, upachaya: true, duhsthana: false, ayusthana: true, maraka: false,
  },
  {
    house: 4, motto: 'I BELONG', title: 'House of Home, Mother & Inner Happiness',
    sanskrit: ['Sukha Bhāva', 'Bandhu Bhāva'], question: 'Where do I feel at home?',
    significations: ['Mother', 'Home', 'Property', 'Land', 'Vehicles', 'Education',
      'Inner happiness', 'Emotional security', 'Comfort', 'Roots'],
    purushartha: 'moksha', element: 'water', angularity: 'kendra',
    trikona: false, upachaya: false, duhsthana: false, ayusthana: false, maraka: false,
  },
  {
    house: 5, motto: 'I CREATE', title: 'House of Children, Intelligence & Creativity',
    sanskrit: ['Putra Bhāva'], question: 'What comes through me?',
    significations: ['Children', 'Creativity', 'Intelligence', 'Learning', 'Memory',
      'Discrimination', 'Authorship', 'Mantra', 'Devotion', 'Past-life merit'],
    purushartha: 'dharma', element: 'fire', angularity: 'panaphara',
    trikona: true, upachaya: false, duhsthana: false, ayusthana: false, maraka: false,
  },
  {
    house: 6, motto: 'I STRUGGLE', title: 'House of Conflict, Disease & Service',
    sanskrit: ['Ari Bhāva', 'Ripu Bhāva'], question: 'What must I overcome?',
    significations: ['Enemies', 'Competition', 'Disease', 'Debt', 'Obstacles',
      'Conflict', 'Service', 'Subordinates', 'Daily work', 'Problem-solving'],
    purushartha: 'artha', element: 'earth', angularity: 'apoklima',
    trikona: false, upachaya: true, duhsthana: true, ayusthana: false, maraka: false,
  },
  {
    house: 7, motto: 'I RELATE', title: 'House of Partnership & Marriage',
    sanskrit: ['Yuvati Bhāva', 'Kalatra Bhāva'], question: 'Who stands opposite me?',
    significations: ['Marriage', 'Spouse', 'Partnership', 'Sexual union',
      'Business partnership', 'Contracts', 'Public interaction', 'Open enemies'],
    purushartha: 'kama', element: 'air', angularity: 'kendra',
    trikona: false, upachaya: false, duhsthana: false, ayusthana: false, maraka: true,
  },
  {
    house: 8, motto: 'I TRANSFORM', title: 'House of Longevity, Crisis & Transformation',
    sanskrit: ['Āyuṣ Bhāva', 'Randhra Bhāva'], question: 'What changes me beyond my control?',
    significations: ['Longevity', 'Death', 'Sudden events', 'Obstacles', 'Inheritance',
      'Secrets', 'Hidden matters', 'Shared resources', 'Mysticism', 'Transformation'],
    purushartha: 'moksha', element: 'water', angularity: 'panaphara',
    trikona: false, upachaya: false, duhsthana: true, ayusthana: true, maraka: false,
  },
  {
    house: 9, motto: 'I SEEK', title: 'House of Dharma, Fortune & Higher Knowledge',
    sanskrit: ['Dharma Bhāva', 'Bhāgya Bhāva'], question: 'What gives my life meaning?',
    significations: ['Dharma', 'Wisdom', 'Guru / teacher', 'Father', 'Religion',
      'Philosophy', 'Pilgrimage', 'Higher learning', 'Fortune', 'Long journeys'],
    purushartha: 'dharma', element: 'fire', angularity: 'apoklima',
    trikona: true, upachaya: false, duhsthana: false, ayusthana: false, maraka: false,
  },
  {
    house: 10, motto: 'I ACT IN THE WORLD', title: 'House of Action, Profession & Public Life',
    sanskrit: ['Karma Bhāva'], question: 'What do I do in the world?',
    significations: ['Profession', 'Livelihood', 'Status', 'Authority', 'Responsibility',
      'Reputation', 'Public action', 'Achievement', 'Contribution', 'Work'],
    purushartha: 'artha', element: 'earth', angularity: 'kendra',
    trikona: false, upachaya: true, duhsthana: false, ayusthana: false, maraka: false,
  },
  {
    house: 11, motto: 'I GAIN', title: 'House of Gains & Fulfilment',
    sanskrit: ['Lābha Bhāva'], question: 'What comes back to me?',
    significations: ['Income', 'Gains', 'Profits', 'Rewards', 'Recognition', 'Networks',
      'Elder siblings', 'Ambitions', 'Fulfilment of desires', 'Achievement'],
    purushartha: 'kama', element: 'air', angularity: 'panaphara',
    trikona: false, upachaya: true, duhsthana: false, ayusthana: false, maraka: false,
  },
  {
    house: 12, motto: 'I RELEASE', title: 'House of Expenditure, Loss & Liberation',
    sanskrit: ['Vyaya Bhāva'], question: 'What must I let go?',
    significations: ['Expenditure', 'Loss', 'Sleep', 'Bed pleasures', 'Foreign lands',
      'Isolation', 'Confinement', 'Renunciation', 'Spirituality', 'Liberation'],
    purushartha: 'moksha', element: 'water', angularity: 'apoklima',
    trikona: false, upachaya: false, duhsthana: true, ayusthana: false, maraka: false,
  },
];

// ── Classification sets (single source of truth) ──────────────────────────
export const KENDRA = [1, 4, 7, 10];
export const PANAPHARA = [2, 5, 8, 11];
export const APOKLIMA = [3, 6, 9, 12];
export const TRIKONA = [1, 5, 9];
export const UPACHAYA = [3, 6, 10, 11];
export const DUHSTHANA = [6, 8, 12]; // trika
export const AYUSTHANA = [8, 3]; // 8 primary, 3 secondary
export const MARAKA = [2, 7];

export const PURUSHARTHA_HOUSES: Record<Purushartha, number[]> = {
  dharma: [1, 5, 9],
  artha: [2, 6, 10],
  kama: [3, 7, 11],
  moksha: [4, 8, 12],
};

/** Human-readable tags a house belongs to, powers the "why" transparency. */
export function houseClasses(house: number): string[] {
  const h = HOUSES[house - 1];
  const tags: string[] = [];
  tags.push({ kendra: 'Kendra · Angular', panaphara: 'Panaphara · Succedent',
    apoklima: 'Apoklima · Cadent' }[h.angularity]);
  if (h.trikona) tags.push('Trikoṇa · Trine');
  if (h.upachaya) tags.push('Upachaya · Growth');
  if (h.duhsthana) tags.push('Duḥsthāna · Difficult');
  if (h.ayusthana) tags.push(house === 8 ? 'Āyu-sthāna · Longevity (primary)' : 'Āyu-sthāna · Longevity (secondary)');
  if (h.maraka) tags.push('Māraka · Longevity-reducing');
  tags.push({ dharma: 'Dharma · Purpose', artha: 'Artha · Material support',
    kama: 'Kāma · Desire', moksha: 'Mokṣa · Liberation' }[h.purushartha]);
  return tags;
}

/**
 * Bhāvat Bhāvam, "house from house". Re-reference the chart from a given house
 * and apply the same count again. E.g. 5th from 5th = 9th; 8th from 8th = 3rd
 * (secondary longevity); 12th from a house = its loss (→ maraka logic).
 */
export const houseFrom = (from: number, count: number): number =>
  ((from - 1 + (count - 1)) % 12) + 1;
