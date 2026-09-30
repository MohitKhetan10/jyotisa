// ─────────────────────────────────────────────────────────────────────────
//  EPHEMERIS LAYER, the ONLY module in the app that talks to swisseph-wasm.
//  Everything else consumes the engine-agnostic RawChart it produces. Swapping
//  the astronomy backend would touch this file and nothing else.
//
//  Engine: Swiss Ephemeris (AGPL-3.0) via swisseph-wasm. Sidereal zodiac,
//  Lahiri ayanamsha by default, whole-sign houses for Vedic interpretation.
// ─────────────────────────────────────────────────────────────────────────
import SwissEph from 'swisseph-wasm';
import type {
  Ascendant, Ayanamsha, BirthDetails, CalcSettings, PlanetId,
  PlanetPosition, RawChart,
} from '../../types/chart';
import {
  SIGNS, degreeInSignOf, nakshatraOf, norm360, signIndexOf, wholeSignHouse,
} from '../zodiac/zodiac';
import { dignityOf } from '../../data/dignities';

// swisseph-wasm's TS types don't expose a rich instance type, so we narrow to
// what we use. A single shared instance is initialised lazily (loads ~2.1 MB
// WASM + ephemeris data once, then cached by the browser).
type Swe = InstanceType<typeof SwissEph>;
let _swe: Swe | null = null;
let _initPromise: Promise<Swe> | null = null;

export async function getEngine(): Promise<Swe> {
  if (_swe) return _swe;
  if (!_initPromise) {
    _initPromise = (async () => {
      const swe = new SwissEph();
      await swe.initSwissEph();
      _swe = swe;
      return swe;
    })();
  }
  return _initPromise;
}

const AYANAMSHA_MODE: Record<Ayanamsha, number> = {
  lahiri: 1, // SE_SIDM_LAHIRI
  raman: 3, // SE_SIDM_DELUCE is 2; Raman is 3
  krishnamurti: 5,
  fagan_bradley: 0,
};

// Swiss Ephemeris body ids we compute. Ketu is derived as Rahu + 180°.
const BODY_IDS: Array<[PlanetId, keyof Swe | number]> = [
  ['Sun', 0], ['Moon', 1], ['Mars', 4], ['Mercury', 2], ['Jupiter', 5],
  ['Venus', 3], ['Saturn', 6], ['Rahu', 11 /* SE_TRUE_NODE */],
];

/** Combustion orbs (degrees from Sun) per classical convention. */
const COMBUST_ORB: Partial<Record<PlanetId, number>> = {
  Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
};

function buildAscendant(longitude: number): Ascendant {
  const nak = nakshatraOf(longitude);
  return {
    longitude,
    sign: SIGNS[signIndexOf(longitude)],
    signIndex: signIndexOf(longitude),
    degreeInSign: degreeInSignOf(longitude),
    nakshatra: nak.name,
    nakshatraIndex: nak.index,
    pada: nak.pada,
  };
}

/**
 * Compute a full sidereal birth chart. Pure output, a RawChart the rest of
 * the app can reason about without any Swiss Ephemeris knowledge.
 */
export async function computeChart(
  birth: BirthDetails,
  settings: CalcSettings = { ayanamsha: 'lahiri', houseSystem: 'whole-sign' },
): Promise<RawChart> {
  const swe = await getEngine();
  swe.set_sid_mode(AYANAMSHA_MODE[settings.ayanamsha], 0, 0);

  // Convert local civil time → UTC, then to Julian Day (UT).
  const utcHourFloat = birth.hour + birth.minute / 60 - birth.tzOffset;
  // Normalise into a proper UTC calendar moment via a JS Date so day/month roll over.
  const base = Date.UTC(birth.year, birth.month - 1, birth.day, 0, 0, 0);
  const utc = new Date(base + utcHourFloat * 3600_000);
  const { julianDayUT: jd } = swe.utc_to_jd(
    utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(),
    utc.getUTCHours(), utc.getUTCMinutes(), utc.getUTCSeconds(), 1 /* Gregorian */,
  );

  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

  // Ascendant / houses (whole-sign uses the ascendant sign only).
  const houses = swe.houses_ex(jd, swe.SEFLG_SIDEREAL, birth.lat, birth.lon, 'W');
  const ascLon = norm360(houses.ascmc[0]);
  const ascendant = buildAscendant(ascLon);
  const ascSignIndex = ascendant.signIndex;

  const sunPos = swe.calc_ut(jd, 0, flags);
  const sunLon = norm360(sunPos[0]);

  const planets: PlanetPosition[] = [];
  for (const [name, id] of BODY_IDS) {
    const r = swe.calc_ut(jd, id as number, flags);
    const longitude = norm360(r[0]);
    planets.push(makePlanet(name, longitude, r[3] < 0, ascSignIndex, sunLon));
  }
  // Ketu = Rahu + 180°, always retrograde.
  const rahu = planets.find((p) => p.planet === 'Rahu')!;
  planets.push(
    makePlanet('Ketu', norm360(rahu.longitude + 180), true, ascSignIndex, sunLon),
  );

  return {
    julianDayUT: jd,
    ayanamshaValue: swe.get_ayanamsa(jd),
    ascendant,
    planets,
    settings,
    reliability: birth.timeKnown ? 'high' : 'low',
  };
}

function makePlanet(
  planet: PlanetId, longitude: number, retrograde: boolean,
  ascSignIndex: number, sunLon: number,
): PlanetPosition {
  const nak = nakshatraOf(longitude);
  const signIndex = signIndexOf(longitude);
  // Combustion: within orb of the Sun (Sun/Rahu/Ketu never combust).
  let combust = false;
  const orb = COMBUST_ORB[planet];
  if (orb) {
    const sep = Math.abs(((longitude - sunLon + 540) % 360) - 180);
    combust = sep <= orb;
  }
  return {
    planet,
    longitude,
    sign: SIGNS[signIndex],
    signIndex,
    degreeInSign: degreeInSignOf(longitude),
    retrograde,
    house: wholeSignHouse(signIndex, ascSignIndex),
    nakshatra: nak.name,
    nakshatraIndex: nak.index,
    pada: nak.pada,
    combust,
    dignity: dignityOf(planet, longitude),
  };
}
