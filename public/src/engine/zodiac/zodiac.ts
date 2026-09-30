// Pure zodiac math, no dependency on any ephemeris. Given a sidereal longitude
// it derives sign, degree, nakshatra and pada. Shared by D1 and every varga.
import type { SignId } from '../../types/chart';

export const SIGNS: SignId[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

/** Nakshatra lords in Vimshottari order, one per nakshatra (repeats every 9). */
export const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export const norm360 = (deg: number): number => ((deg % 360) + 360) % 360;

export const signIndexOf = (longitude: number): number =>
  Math.floor(norm360(longitude) / 30);

export const signOf = (longitude: number): SignId => SIGNS[signIndexOf(longitude)];

export const degreeInSignOf = (longitude: number): number => norm360(longitude) % 30;

const NAK_SPAN = 360 / 27; // 13.3333 deg
const PADA_SPAN = NAK_SPAN / 4; // 3.3333 deg

export function nakshatraOf(longitude: number): {
  index: number;
  name: string;
  pada: number;
  lord: string;
} {
  const lon = norm360(longitude);
  const index = Math.floor(lon / NAK_SPAN);
  const within = lon - index * NAK_SPAN;
  const pada = Math.floor(within / PADA_SPAN) + 1;
  return {
    index,
    name: NAKSHATRAS[index],
    pada,
    lord: NAKSHATRA_LORDS[index % 9],
  };
}

/** Whole-sign house number (1-12) of a body given the ascendant sign index. */
export const wholeSignHouse = (bodySignIndex: number, ascSignIndex: number): number =>
  ((bodySignIndex - ascSignIndex + 12) % 12) + 1;
