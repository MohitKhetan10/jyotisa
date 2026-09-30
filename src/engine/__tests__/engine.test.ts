// Engine tests against a known birth: 15 Jan 1990, 12:00, New Delhi.
// Uses the real Swiss Ephemeris WASM (works in Node) so calculations are verified
// end-to-end, not mocked.
import { describe, it, expect, beforeAll } from 'vitest';
import type { RawChart } from '../../types/chart';
import { computeChart } from '../ephemeris/swiss';
import { signOf, nakshatraOf, wholeSignHouse } from '../zodiac/zodiac';
import { buildVarga, isVargottama, vargaSignIndex } from '../varga/varga';
import { vimshottari, currentDasha, DASHA_YEARS } from '../dasha/vimshottari';
import { detectYogas } from '../yoga/yoga';
import { ashtakoota } from '../compatibility/ashtakoota';

let chart: RawChart;
beforeAll(async () => {
  chart = await computeChart({
    name: 'Test', year: 1990, month: 1, day: 15, hour: 12, minute: 0,
    timeKnown: true, place: 'New Delhi', lat: 28.6139, lon: 77.209, tzOffset: 5.5,
  });
}, 30000);

describe('zodiac math', () => {
  it('maps longitude to sign', () => {
    expect(signOf(0)).toBe('Aries');
    expect(signOf(271.1)).toBe('Capricorn');
    expect(signOf(359.9)).toBe('Pisces');
  });
  it('computes nakshatra + pada', () => {
    const n = nakshatraOf(0);
    expect(n.name).toBe('Ashwini');
    expect(n.pada).toBe(1);
    expect(nakshatraOf(13.34).name).toBe('Bharani');
  });
  it('whole-sign house wraps correctly', () => {
    expect(wholeSignHouse(0, 0)).toBe(1);
    expect(wholeSignHouse(9, 0)).toBe(10);
    expect(wholeSignHouse(0, 9)).toBe(4);
  });
});

describe('ephemeris chart (Swiss Ephemeris)', () => {
  it('places the Sun in Capricorn (Makara) for a mid-Jan birth', () => {
    const sun = chart.planets.find((p) => p.planet === 'Sun')!;
    expect(sun.sign).toBe('Capricorn');
  });
  it('has Lahiri ayanamsha ~23.7° for 1990', () => {
    expect(chart.ayanamshaValue).toBeGreaterThan(23.5);
    expect(chart.ayanamshaValue).toBeLessThan(24.0);
  });
  it('marks the nodes retrograde and Ketu opposite Rahu', () => {
    const rahu = chart.planets.find((p) => p.planet === 'Rahu')!;
    const ketu = chart.planets.find((p) => p.planet === 'Ketu')!;
    expect(Math.abs(((ketu.longitude - rahu.longitude + 360) % 360) - 180)).toBeLessThan(0.001);
    expect(ketu.retrograde).toBe(true);
  });
});

describe('vargas', () => {
  it('D9 uses continuous 3°20′ mapping', () => {
    expect(vargaSignIndex('D9', 0)).toBe(0);   // Aries 0° → Aries navamsa
    expect(vargaSignIndex('D9', 90)).toBe(3);  // Cancer 0° → Cancer navamsa
  });
  it('vargottama iff D1 sign === D9 sign', () => {
    expect(isVargottama(1)).toBe(true);        // both Aries
    expect(isVargottama(3.5)).toBe(false);
  });
  it('builds a D9 with 9 planets and a valid ascendant', () => {
    const v = buildVarga('D9', chart);
    expect(v.planets).toHaveLength(9);
    expect(v.ascSignIndex).toBeGreaterThanOrEqual(0);
    expect(v.ascSignIndex).toBeLessThan(12);
  });
});

describe('vimshottari dasha', () => {
  const periods = () => vimshottari(chart);
  it('has 9 maha-dashas; from birth spans (120 − elapsed balance) years', () => {
    const p = periods();
    expect(p).toHaveLength(9);
    // First maha is shown from birth with its BALANCE, so the timeline from birth
    // covers 120 minus the already-elapsed portion of the first lord's period.
    const years = (p[8].end.getTime() - p[0].start.getTime()) / (365.2425 * 86400000);
    expect(years).toBeGreaterThan(100);
    expect(years).toBeLessThanOrEqual(120);
    // All nine lords appear exactly once.
    expect(new Set(p.map((x) => x.lord)).size).toBe(9);
  });
  it('each maha has 9 antars and each antar 9 pratyantars', () => {
    const p = periods();
    expect(p[0].children).toHaveLength(9);
    expect(p[0].children![0].children).toHaveLength(9);
  });
  it('sub-period years sum to the parent length', () => {
    const p = periods()[1]; // a full (non-balance) maha
    expect(DASHA_YEARS[p.lord]).toBeGreaterThan(0);
    const sum = p.children!.reduce((s, c) => s + (c.end.getTime() - c.start.getTime()), 0);
    const parent = p.end.getTime() - p.start.getTime();
    expect(Math.abs(sum - parent)).toBeLessThan(1000 * 60); // within a minute
  });
  it('finds a current period', () => {
    const now = currentDasha(periods());
    expect(now.maha).not.toBeNull();
  });
});

describe('yoga engine', () => {
  it('returns structured hits with a why and effect', () => {
    const hits = detectYogas(chart);
    hits.forEach((h) => {
      expect(h.why.length).toBeGreaterThan(0);
      expect(h.effect.length).toBeGreaterThan(0);
    });
  });
});

describe('ashtakoota', () => {
  it('scores 0..36 with per-component breakdown', () => {
    const r = ashtakoota(chart, chart);
    expect(r.kootas).toHaveLength(8);
    expect(r.total).toBeGreaterThanOrEqual(0);
    expect(r.total).toBeLessThanOrEqual(36);
  });
  it('same chart shares Nāḍī → Nāḍī doṣa (0 points)', () => {
    const r = ashtakoota(chart, chart);
    expect(r.kootas.find((k) => k.name === 'Nāḍī')!.got).toBe(0);
  });
});
