const SECTIONS: [string, string][] = [
  ['Zodiac & Ayanāṁśa', 'Sidereal zodiac (fixed to the stars). Default ayanāṁśa is Lahiri; Raman, Krishnamurti and Fagan-Bradley are supported. The ayanāṁśa is applied by the Swiss Ephemeris via its sidereal mode.'],
  ['Ephemeris', 'Swiss Ephemeris 2.10 (AGPL-3.0), compiled to WebAssembly, running entirely in your browser with its bundled .se1 data (planets, Moon, asteroids), covering ~1800-2400 AD at full precision.'],
  ['Coordinates & Time', 'Your local birth time is converted to UTC using the birthplace’s standard offset (Nepal +5:45, India +5:30), then to Julian Day (UT). Positions are geocentric.'],
  ['House system', 'Whole-sign houses: the ascendant’s sign is the 1st house; each following sign is the next house. The ascendant is computed from the sidereal Midheaven/horizon.'],
  ['Nodes', 'Rāhu uses the true node; Ketu is exactly 180° opposite.'],
  ['Divisional charts', 'One consistent Parāśarī convention is used for all 16 vargas (documented in docs/VARGA_CALCULATIONS.md). Schools differ on some methods; D60 is very sensitive to birth-time accuracy.'],
  ['Vimśottarī Daśā', 'Driven by the Moon’s nakṣatra. 1 year = 365.2425 days. The first period’s balance is the unelapsed fraction of the Moon’s nakṣatra at birth. Sub-periods are proportional.'],
  ['Strength', 'A transparent, documented heuristic (functional nature + Dig Bala + dignity + combustion), NOT full classical Ṣaḍbala, the remaining balas are marked pending rather than approximated.'],
  ['Interpretation', 'Composed by a rules engine from planet nature, house, sign, dignity and strength, never random. Interpretations are labelled traditional; calculations are presented as calculations.'],
];

import { useT } from '../i18n/lang';

export default function Methodology() {
  const { t } = useT();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-parchment-100">{t('p.method.t')}</h1>
        <p className="mt-1 text-sm text-parchment-200/60">
          Full transparency. This app never fabricates positions, dates, yogas or
          events. Where something can’t be computed reliably, it says so.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {SECTIONS.map(([h, body]) => (
          <div key={h} className="card p-4">
            <h2 className="font-medium text-saffron-400">{h}</h2>
            <p className="mt-1 text-sm text-parchment-200/75">{body}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-parchment-200/40">
        This app’s interpretations are not scientifically validated. Astrology is an
        interpretive, cultural tradition. For health, legal or financial decisions,
        consult a qualified professional.
      </p>
    </div>
  );
}
