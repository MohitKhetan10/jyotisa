// Export the chart as JSON (birth info + settings + positions + derived data).
// No unnecessary personal data beyond what the user entered.
import type { BirthDetails, RawChart } from '../types/chart';
import { buildHouses } from '../engine/houses/houses';
import { detectYogas } from '../engine/yoga/yoga';
import { detectDoshas } from '../engine/dosha/dosha';
import { vimshottari } from '../engine/dasha/vimshottari';
import { VARGAS, vargaSignIndex } from '../engine/varga/varga';
import { SIGNS } from '../engine/zodiac/zodiac';

export function buildExport(chart: RawChart, birth: BirthDetails) {
  return {
    meta: {
      app: 'Jyotiṣa', generated: new Date().toISOString(),
      engine: 'Swiss Ephemeris (swisseph-wasm)', zodiac: 'sidereal',
      ayanamsha: chart.settings.ayanamsha, houseSystem: chart.settings.houseSystem,
    },
    birth,
    ayanamshaValue: chart.ayanamshaValue,
    reliability: chart.reliability,
    ascendant: chart.ascendant,
    planets: chart.planets,
    houses: buildHouses(chart).map((h) => ({
      house: h.house, sign: h.sign, lord: h.lord,
      lordInHouse: h.lordInHouse, occupants: h.occupants,
    })),
    vargas: Object.fromEntries(VARGAS.map((v) => [
      v.id, chart.planets.map((p) => ({ planet: p.planet, sign: SIGNS[vargaSignIndex(v.id, p.longitude)] })),
    ])),
    yogas: detectYogas(chart),
    doshas: detectDoshas(chart).filter((d) => d.present).map((d) => d.name),
    vimshottari: vimshottari(chart).map((m) => ({
      lord: m.lord, start: m.start.toISOString(), end: m.end.toISOString(),
    })),
  };
}

export function downloadJSON(chart: RawChart, birth: BirthDetails) {
  const data = buildExport(chart, birth);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(birth.name || 'chart').replace(/\s+/g, '_')}_jyotisha.json`;
  a.click();
  URL.revokeObjectURL(url);
}
