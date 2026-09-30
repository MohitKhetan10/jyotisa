// Classical dignities (Parashari). Sign indices: Aries=0 ... Pisces=11.
import type { PlanetId, Dignity } from '../types/chart';
import { SIGNS, signIndexOf } from '../engine/zodiac/zodiac';

// Sign rulership (for own-sign detection). Rahu/Ketu have no classical rulership.
export const SIGN_LORDS: Record<number, PlanetId> = {
  0: 'Mars', 1: 'Venus', 2: 'Mercury', 3: 'Moon', 4: 'Sun', 5: 'Mercury',
  6: 'Venus', 7: 'Mars', 8: 'Jupiter', 9: 'Saturn', 10: 'Saturn', 11: 'Jupiter',
};

const OWN: Partial<Record<PlanetId, number[]>> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};

const EXALT: Partial<Record<PlanetId, number>> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
  Rahu: 1, Ketu: 7,
};
const DEBIL: Partial<Record<PlanetId, number>> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0,
  Rahu: 7, Ketu: 1,
};

export function dignityOf(planet: PlanetId, longitude: number): Dignity {
  const s = signIndexOf(longitude);
  if (EXALT[planet] === s) return 'exalted';
  if (DEBIL[planet] === s) return 'debilitated';
  if (OWN[planet]?.includes(s)) return 'own';
  return 'none';
}

/** Ruling planet of a sign, by sign index (0-11) or sign name. */
export const signLordOf = (sign: import('../types/chart').SignId | number): PlanetId => {
  const idx = typeof sign === 'number' ? sign : SIGNS.indexOf(sign);
  return SIGN_LORDS[idx];
};
