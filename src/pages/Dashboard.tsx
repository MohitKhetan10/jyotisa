import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChart } from '../store/chart';
import KundliChart from '../components/KundliChart';
import { useT } from '../i18n/lang';

const RELIABILITY: Record<string, { cls: string }> = {
  high: { cls: 'text-clay-400' },
  medium: { cls: 'text-saffron-500' },
  low: { cls: 'text-lotus-400' },
};

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wide text-parchment-200/50">{label}</div>
      <div className="mt-1 font-serif text-lg text-parchment-50">{value}</div>
      {sub && <div className="text-xs text-parchment-200/50">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { birth, chart, status, error, generate } = useChart();
  const { t, ts } = useT();

  // Recompute on reload: only inputs are persisted, the chart is derived.
  useEffect(() => {
    if (birth && !chart && status === 'idle') void generate(birth);
  }, [birth, chart, status, generate]);

  if (!birth) {
    return (
      <div className="card p-8 text-center">
        <p className="text-parchment-200/70">{t('common.noChart')}</p>
        <Link to="/birth" className="btn-primary mt-4">{t('common.createChart')}</Link>
      </div>
    );
  }

  if (status === 'computing' || (!chart && status !== 'error')) {
    return <p className="p-8 text-center text-parchment-200/60">{t('common.calculating')}</p>;
  }
  if (status === 'error') {
    return <p className="p-8 text-center text-lotus-400">Calculation error: {error}</p>;
  }
  if (!chart) return null;

  const moon = chart.planets.find((p) => p.planet === 'Moon')!;
  const sun = chart.planets.find((p) => p.planet === 'Sun')!;
  const rel = RELIABILITY[chart.reliability];
  const relLabel = t(`rel.${chart.reliability}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-parchment-100">{birth.name}</h1>
          <p className="text-sm text-parchment-200/70">
            {birth.day}/{birth.month}/{birth.year}
            {birth.timeKnown ? ` · ${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')}` : ` · ${t('dash.timeUnknown')}`}
            {' · '}{birth.place}
          </p>
        </div>
        <div className="text-right text-sm">
          <span className="text-parchment-200/50">{t('dash.reliability')}: </span>
          <span className={rel.cls}>{relLabel}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={t('dash.ascendant')} value={ts(chart.ascendant.sign)}
              sub={`${chart.ascendant.degreeInSign.toFixed(1)}° · ${chart.ascendant.nakshatra}`} />
        <Stat label={t('dash.moon')} value={ts(moon.sign)}
              sub={`${moon.nakshatra} pada ${moon.pada}`} />
        <Stat label={t('dash.sun')} value={ts(sun.sign)}
              sub={`${t('dash.house')} ${sun.house}`} />
      </div>

      <div className="card p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <KundliChart ascendant={chart.ascendant} planets={chart.planets} />
            <p className="mt-2 text-center text-xs text-parchment-200/40">D1 Rāśi · North Indian</p>
          </div>
          <div className="flex-1 text-sm text-parchment-200/70">
            <p className="mb-2 font-medium text-parchment-100">Ayanāṁśa</p>
            <p className="text-xs">Lahiri {chart.ayanamshaValue.toFixed(3)}° · Sidereal · Whole-sign houses</p>
            <Link to="/chart" className="btn-ghost mt-4">{t('dash.seeChart')} →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
