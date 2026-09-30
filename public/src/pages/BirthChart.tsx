import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChart } from '../store/chart';
import KundliChart from '../components/KundliChart';
import { downloadJSON } from '../lib/exportChart';
import { useT } from '../i18n/lang';

const DIGNITY_LABEL: Record<string, string> = {
  exalted: 'Exalted', debilitated: 'Debilitated', own: 'Own sign',
  moolatrikona: 'Moolatrikona', friend: 'Friend', neutral: 'Neutral',
  enemy: 'Enemy', none: '·',
};

export default function BirthChart() {
  const { birth, chart, status, generate } = useChart();
  const { t } = useT();

  useEffect(() => {
    if (birth && !chart && status === 'idle') void generate(birth);
  }, [birth, chart, status, generate]);

  if (!birth) {
    return (
      <div className="card p-8 text-center">
        <p className="text-parchment-200/70">No chart yet.</p>
        <Link to="/birth" className="btn-primary mt-4">Create your birth chart</Link>
      </div>
    );
  }
  if (!chart) {
    return <p className="p-8 text-center text-parchment-200/60">Calculating…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-parchment-100">{t('p.chart.t')}</h1>
        <div className="flex gap-2">
          <button className="btn-ghost !px-3 !py-1.5 text-sm" onClick={() => downloadJSON(chart, birth)}>
            {t('common.export')}
          </button>
          <button className="btn-ghost !px-3 !py-1.5 text-sm" onClick={() => window.print()}>
            {t('common.print')}
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="card p-6">
          <KundliChart ascendant={chart.ascendant} planets={chart.planets} size={380} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800 text-xs uppercase tracking-wide text-parchment-200/50">
            <tr>
              <th className="px-3 py-2">Planet</th>
              <th className="px-3 py-2">Sign</th>
              <th className="px-3 py-2">Degree</th>
              <th className="px-3 py-2">House</th>
              <th className="px-3 py-2">Nakshatra</th>
              <th className="px-3 py-2">Pada</th>
              <th className="px-3 py-2">Dignity</th>
              <th className="px-3 py-2">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {chart.planets.map((p) => (
              <tr key={p.planet} className="hover:bg-ink-800/50">
                <td className="px-3 py-2 font-medium text-parchment-50">{p.planet}</td>
                <td className="px-3 py-2">{p.sign}</td>
                <td className="px-3 py-2 tabular-nums">{p.degreeInSign.toFixed(2)}°</td>
                <td className="px-3 py-2 tabular-nums">{p.house}</td>
                <td className="px-3 py-2">{p.nakshatra}</td>
                <td className="px-3 py-2 tabular-nums">{p.pada}</td>
                <td className={`px-3 py-2 ${
                  p.dignity === 'exalted' ? 'text-clay-400'
                  : p.dignity === 'debilitated' ? 'text-lotus-400' : ''
                }`}>{DIGNITY_LABEL[p.dignity]}</td>
                <td className="px-3 py-2 text-xs text-parchment-200/60">
                  {[p.retrograde && 'Retro', p.combust && 'Combust'].filter(Boolean).join(', ') || '·'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-parchment-200/40">
        Ascendant: {chart.ascendant.sign} {chart.ascendant.degreeInSign.toFixed(2)}° ·
        Lahiri ayanāṁśa {chart.ayanamshaValue.toFixed(3)}° · Positions are sidereal,
        computed by Swiss Ephemeris.
      </p>
    </div>
  );
}
