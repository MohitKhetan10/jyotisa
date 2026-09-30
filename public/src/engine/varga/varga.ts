// ─────────────────────────────────────────────────────────────────────────
//  DIVISIONAL CHARTS (Ṣoḍaśavarga), all 16 classical vargas.
//
//  Pure functions: each maps a sidereal longitude → a resulting sign index
//  (0-11). Convention documented per varga below. NOTE (per project rule):
//  Vedic schools differ on some varga methods, this module implements ONE
//  consistent Parāśarī convention (as used by mainstream software such as
//  Jagannātha Horā). The convention is stated so results are reproducible.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart, SignId } from '../../types/chart';
import { SIGNS, norm360, signIndexOf, degreeInSignOf, nakshatraOf } from '../zodiac/zodiac';
import { dignityOf } from '../../data/dignities';

export type VargaId =
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12'
  | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

export interface VargaMeta {
  id: VargaId;
  divisions: number;
  name: string;
  sanskrit: string;
  purpose: string;
}

export const VARGAS: VargaMeta[] = [
  { id: 'D1', divisions: 1, name: 'Rāśi', sanskrit: 'Rāśi', purpose: 'The physical body and overall life, the primary chart.' },
  { id: 'D2', divisions: 2, name: 'Hora', sanskrit: 'Horā', purpose: 'Wealth and resources.' },
  { id: 'D3', divisions: 3, name: 'Drekkana', sanskrit: 'Dreṣkāṇa', purpose: 'Siblings, courage, initiative.' },
  { id: 'D4', divisions: 4, name: 'Chaturthamsa', sanskrit: 'Caturthāṁśa', purpose: 'Home, property, fortune, fixed assets.' },
  { id: 'D7', divisions: 7, name: 'Saptamsa', sanskrit: 'Saptāṁśa', purpose: 'Children and progeny.' },
  { id: 'D9', divisions: 9, name: 'Navamsa', sanskrit: 'Navāṁśa', purpose: 'Marriage, dharma, inner strength of every planet, the most important varga.' },
  { id: 'D10', divisions: 10, name: 'Dasamsa', sanskrit: 'Daśāṁśa', purpose: 'Career, profession, public action.' },
  { id: 'D12', divisions: 12, name: 'Dwadashamsa', sanskrit: 'Dvādaśāṁśa', purpose: 'Parents and ancestry.' },
  { id: 'D16', divisions: 16, name: 'Shodasamsa', sanskrit: 'Ṣoḍaśāṁśa', purpose: 'Vehicles, comforts, happiness and its disturbances.' },
  { id: 'D20', divisions: 20, name: 'Vimsamsa', sanskrit: 'Viṁśāṁśa', purpose: 'Spiritual practice, worship, devotion.' },
  { id: 'D24', divisions: 24, name: 'Chaturvimsamsa', sanskrit: 'Caturviṁśāṁśa', purpose: 'Education, learning, knowledge.' },
  { id: 'D27', divisions: 27, name: 'Bhamsa', sanskrit: 'Bhāṁśa / Nakṣatrāṁśa', purpose: 'Strengths and weaknesses, physical stamina.' },
  { id: 'D30', divisions: 30, name: 'Trimsamsa', sanskrit: 'Triṁśāṁśa', purpose: 'Misfortunes, character, moral fibre.' },
  { id: 'D40', divisions: 40, name: 'Khavedamsa', sanskrit: 'Khavedāṁśa', purpose: 'Auspicious and inauspicious matrilineal effects.' },
  { id: 'D45', divisions: 45, name: 'Akshavedamsa', sanskrit: 'Akṣavedāṁśa', purpose: 'General character, patrilineal effects.' },
  { id: 'D60', divisions: 60, name: 'Shashtiamsa', sanskrit: 'Ṣaṣṭyāṁśa', purpose: 'Deep karmic totality; small time error changes it greatly.' },
];

export const VARGA_META: Record<VargaId, VargaMeta> = Object.fromEntries(
  VARGAS.map((v) => [v.id, v]),
) as Record<VargaId, VargaMeta>;

// ── helpers ────────────────────────────────────────────────────────────────
const mod12 = (n: number) => ((n % 12) + 12) % 12;
const isOdd = (sign: number) => sign % 2 === 0; // Aries(0) is an odd sign
/** 0 movable (chara), 1 fixed (sthira), 2 dual (dvisvabhāva). */
const modality = (sign: number) => sign % 3;
/** 0 fire, 1 earth, 2 air, 3 water. */
const element = (sign: number) => sign % 4;

/** Which n-th part (0-based) a longitude falls into within its 30° sign. */
const part = (lon: number, n: number) => Math.floor((degreeInSignOf(lon) / 30) * n);

// ── the 16 mappings: longitude → resulting sign index (0-11) ────────────────
function d1(lon: number) { return signIndexOf(lon); }

function d2(lon: number) {
  const s = signIndexOf(lon); const first = degreeInSignOf(lon) < 15;
  // Odd signs: 1st half Leo, 2nd half Cancer. Even signs: reverse.
  return isOdd(s) ? (first ? 4 : 3) : (first ? 3 : 4);
}

function d3(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 3); // 0,1,2
  return mod12(s + k * 4); // same, 5th, 9th
}

function d4(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 4);
  return mod12(s + k * 3); // same, 4th, 7th, 10th (kendras)
}

function d7(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 7);
  const start = isOdd(s) ? s : mod12(s + 6); // even signs start from 7th
  return mod12(start + k);
}

// Navamsa: continuous 3°20' mapping, equivalently element-based start.
function d9(lon: number) { return mod12(Math.floor(norm360(lon) / (30 / 9))); }

function d10(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 10);
  const start = isOdd(s) ? s : mod12(s + 8); // even signs start from 9th
  return mod12(start + k);
}

function d12(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 12);
  return mod12(s + k); // count from the sign itself
}

function startByModality(sign: number, movable: number, fixed: number, dual: number) {
  return [movable, fixed, dual][modality(sign)];
}

function d16(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 16);
  return mod12(startByModality(s, 0 /*Aries*/, 4 /*Leo*/, 8 /*Sag*/) + k);
}

function d20(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 20);
  return mod12(startByModality(s, 0 /*Aries*/, 8 /*Sag*/, 4 /*Leo*/) + k);
}

function d24(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 24);
  const start = isOdd(s) ? 4 /*Leo*/ : 3 /*Cancer*/;
  return mod12(start + k);
}

function d27(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 27);
  // fire→Aries, earth→Cancer, air→Libra, water→Capricorn
  const start = [0, 3, 6, 9][element(s)];
  return mod12(start + k);
}

// Trimsamsa, unequal 5/5/8/7/5° rulership segments; maps to a ruler's sign.
function d30(lon: number) {
  const s = signIndexOf(lon); const d = degreeInSignOf(lon);
  if (isOdd(s)) {
    if (d < 5) return 0;      // Mars → Aries
    if (d < 10) return 10;    // Saturn → Aquarius
    if (d < 18) return 8;     // Jupiter → Sagittarius
    if (d < 25) return 2;     // Mercury → Gemini
    return 6;                 // Venus → Libra
  }
  if (d < 5) return 1;        // Venus → Taurus
  if (d < 12) return 5;       // Mercury → Virgo
  if (d < 20) return 11;      // Jupiter → Pisces
  if (d < 25) return 9;       // Saturn → Capricorn
  return 7;                   // Mars → Scorpio
}

function d40(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 40);
  const start = isOdd(s) ? 0 /*Aries*/ : 6 /*Libra*/;
  return mod12(start + k);
}

function d45(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 45);
  return mod12(startByModality(s, 0 /*Aries*/, 4 /*Leo*/, 8 /*Sag*/) + k);
}

function d60(lon: number) {
  const s = signIndexOf(lon); const k = part(lon, 60);
  return mod12(s + k); // count from the sign itself
}

const MAP: Record<VargaId, (lon: number) => number> = {
  D1: d1, D2: d2, D3: d3, D4: d4, D7: d7, D9: d9, D10: d10, D12: d12,
  D16: d16, D20: d20, D24: d24, D27: d27, D30: d30, D40: d40, D45: d45, D60: d60,
};

export const vargaSignIndex = (id: VargaId, longitude: number): number =>
  MAP[id](norm360(longitude));

// ── whole varga chart ───────────────────────────────────────────────────────
export interface VargaPlanet {
  planet: PlanetId;
  sign: SignId;
  signIndex: number;
  house: number; // relative to varga ascendant, whole-sign
  dignity: ReturnType<typeof dignityOf>;
}

export interface VargaChart {
  id: VargaId;
  meta: VargaMeta;
  ascSignIndex: number;
  ascSign: SignId;
  planets: VargaPlanet[];
}

/** Build a full divisional chart from the D1 RawChart. */
export function buildVarga(id: VargaId, chart: RawChart): VargaChart {
  const ascSignIndex = vargaSignIndex(id, chart.ascendant.longitude);
  const planets = chart.planets.map((p) => {
    const signIndex = vargaSignIndex(id, p.longitude);
    // Dignity in a varga is judged by the sign the planet lands in. We map the
    // sign back to a representative longitude (sign start) for the lookup.
    return {
      planet: p.planet,
      sign: SIGNS[signIndex],
      signIndex,
      house: mod12(signIndex - ascSignIndex) + 1,
      dignity: dignityOf(p.planet, signIndex * 30 + 1),
    };
  });
  return {
    id, meta: VARGA_META[id], ascSignIndex, ascSign: SIGNS[ascSignIndex], planets,
  };
}

/** Vargottama: a planet in the same sign in D1 and D9 (a mark of strength). */
export function isVargottama(longitude: number): boolean {
  return signIndexOf(longitude) === d9(longitude);
}

// re-exported for callers that want nakshatra of a varga position, etc.
export { nakshatraOf };
