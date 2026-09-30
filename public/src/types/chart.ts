// Domain types shared across the whole app. These are engine-agnostic: the
// ephemeris layer produces them, and every other layer (varga, dasha, yoga,
// interpretation, UI) consumes only these, never the raw Swiss Ephemeris API.

export type PlanetId =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter'
  | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';

export type SignId =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Ayanamsha = 'lahiri' | 'raman' | 'krishnamurti' | 'fagan_bradley';

export interface BirthDetails {
  name: string;
  /** Local calendar date/time as entered by the user. */
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23 local
  minute: number;
  /** Whether the birth time is known; if false, timing techniques are unreliable. */
  timeKnown: boolean;
  place: string; // display label
  lat: number;
  lon: number;
  /** UTC offset in hours for the birth moment (e.g. +5.75 for Nepal). */
  tzOffset: number;
}

export interface PlanetPosition {
  planet: PlanetId;
  /** Sidereal ecliptic longitude, 0-360. */
  longitude: number;
  sign: SignId;
  signIndex: number; // 0-11
  /** Degrees within the sign, 0-30. */
  degreeInSign: number;
  retrograde: boolean;
  /** Whole-sign house (1-12) relative to the ascendant. */
  house: number;
  nakshatra: string;
  nakshatraIndex: number; // 0-26
  pada: number; // 1-4
  /** Combust = too close to the Sun (set by engine post-processing). */
  combust: boolean;
  dignity: Dignity;
}

export type Dignity =
  | 'exalted' | 'debilitated' | 'own' | 'moolatrikona'
  | 'friend' | 'neutral' | 'enemy' | 'none';

export interface Ascendant {
  longitude: number;
  sign: SignId;
  signIndex: number;
  degreeInSign: number;
  nakshatra: string;
  nakshatraIndex: number;
  pada: number;
}

export interface CalcSettings {
  ayanamsha: Ayanamsha;
  houseSystem: 'whole-sign';
}

/** The single source of truth produced by the ephemeris layer for a birth. */
export interface RawChart {
  julianDayUT: number;
  ayanamshaValue: number;
  ascendant: Ascendant;
  planets: PlanetPosition[];
  settings: CalcSettings;
  /** Quality flag: birth time known affects ascendant/houses/dasha reliability. */
  reliability: 'high' | 'medium' | 'low';
}
