// Standalone sanity check that swisseph-wasm computes Lahiri sidereal positions.
// Run: node scripts/verify-engine.mjs
import SwissEph from 'swisseph-wasm';

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra',
  'Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const sign = (lon) => SIGNS[Math.floor(((lon % 360) + 360) % 360 / 30)];

const swe = new SwissEph();
await swe.initSwissEph();
console.log('Swiss Ephemeris version:', swe.version());

swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

// Test birth: 15 Jan 1990, 12:00 IST (06:30 UTC), New Delhi (28.61N, 77.21E)
const { julianDayUT: jd } = swe.utc_to_jd(1990, 1, 15, 6, 30, 0, swe.SE_GREG_CAL);
const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

const bodies = [
  ['Sun', swe.SE_SUN], ['Moon', swe.SE_MOON], ['Mars', swe.SE_MARS],
  ['Mercury', swe.SE_MERCURY], ['Jupiter', swe.SE_JUPITER], ['Venus', swe.SE_VENUS],
  ['Saturn', swe.SE_SATURN], ['Rahu', swe.SE_TRUE_NODE],
];
console.log('Ayanamsa (Lahiri):', swe.get_ayanamsa(jd).toFixed(4), 'deg');
for (const [name, id] of bodies) {
  const r = swe.calc_ut(jd, id, flags);
  const lon = r[0];
  const retro = r[3] < 0 ? ' [R]' : '';
  console.log(`${name.padEnd(8)} ${lon.toFixed(3).padStart(8)}  ${sign(lon)}${retro}`);
}

const h = swe.houses_ex(jd, swe.SEFLG_SIDEREAL, 28.6139, 77.209, 'W');
console.log('Ascendant:', h.ascmc[0].toFixed(3), sign(h.ascmc[0]));

swe.close?.();
