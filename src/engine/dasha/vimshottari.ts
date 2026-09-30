// ─────────────────────────────────────────────────────────────────────────
//  VIMŚOTTARĪ DAŚĀ, the primary Vedic timing system (120-year cycle).
//
//  Driven by the Moon's nakṣatra at birth. Convention: 1 year = 365.2425 days
//  (mean Gregorian year). Dates are computed from the birth instant (Julian Day
//  UT of the RawChart). Maha → Antar → Pratyantar are all derived by the same
//  proportional rule (a sub-period's length = parent length × sub-lord years / 120).
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { NAKSHATRA_LORDS, norm360 } from '../zodiac/zodiac';

const YEAR_DAYS = 365.2425;
const MS_PER_DAY = 86_400_000;

/** Vimśottarī lord order and their dashā lengths in years (total 120). */
export const DASHA_YEARS: Record<PlanetId, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const ORDER: PlanetId[] = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export interface DashaPeriod {
  lord: PlanetId;
  start: Date;
  end: Date;
  level: 1 | 2 | 3; // maha, antar, pratyantar
  children?: DashaPeriod[];
}

const jdToDate = (jd: number) => new Date((jd - 2440587.5) * MS_PER_DAY);
const addYears = (d: Date, years: number) => new Date(d.getTime() + years * YEAR_DAYS * MS_PER_DAY);
const nextLord = (l: PlanetId, step = 1) => ORDER[(ORDER.indexOf(l) + step + ORDER.length * 9) % ORDER.length];

/** Sub-periods of a period, proportionally, starting from the parent lord. */
function subPeriods(parentLord: PlanetId, start: Date, parentYears: number, level: 2 | 3): DashaPeriod[] {
  const out: DashaPeriod[] = [];
  let cursor = start;
  for (let i = 0; i < 9; i++) {
    const lord = nextLord(parentLord, i);
    const years = (parentYears * DASHA_YEARS[lord]) / 120;
    const end = addYears(cursor, years);
    const period: DashaPeriod = { lord, start: cursor, end, level };
    if (level === 2) period.children = subPeriods(lord, cursor, years, 3);
    out.push(period);
    cursor = end;
  }
  return out;
}

/**
 * Full Vimśottarī tree from birth: maha-daśās (each with antar, each antar with
 * pratyantar), spanning the traditional 120 years from the balance at birth.
 */
export function vimshottari(chart: RawChart): DashaPeriod[] {
  const moon = chart.planets.find((p) => p.planet === 'Moon')!;
  const lon = norm360(moon.longitude);
  const nakSpan = 360 / 27;
  const nakIndex = Math.floor(lon / nakSpan);
  const fractionTraversed = (lon - nakIndex * nakSpan) / nakSpan;

  const firstLord = NAKSHATRA_LORDS[nakIndex % 9] as PlanetId;
  const birth = jdToDate(chart.julianDayUT);

  // Balance of the first mahā-daśā (portion remaining).
  const firstFullYears = DASHA_YEARS[firstLord];
  const balanceYears = firstFullYears * (1 - fractionTraversed);
  // The first period notionally started before birth; we present it from birth.
  const periods: DashaPeriod[] = [];
  let cursor = birth;

  for (let i = 0; i < 9; i++) {
    const lord = i === 0 ? firstLord : nextLord(firstLord, i);
    const years = i === 0 ? balanceYears : DASHA_YEARS[lord];
    const end = addYears(cursor, years);
    periods.push({
      lord, start: cursor, end, level: 1,
      children: subPeriods(lord, cursor, years, 2),
    });
    cursor = end;
  }
  return periods;
}

/** The active maha/antar/pratyantar at a given moment (default now). */
export function currentDasha(periods: DashaPeriod[], at: Date = new Date()) {
  const maha = periods.find((p) => at >= p.start && at < p.end) ?? null;
  const antar = maha?.children?.find((p) => at >= p.start && at < p.end) ?? null;
  const pratyantar = antar?.children?.find((p) => at >= p.start && at < p.end) ?? null;
  return { maha, antar, pratyantar };
}
