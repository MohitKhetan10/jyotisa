import { useEffect, useState } from 'react';
import ChartGuard from '../components/ChartGuard';
import { computeTransits, type TransitReport } from '../engine/transit/transit';
import type { BirthDetails, RawChart } from '../types/chart';
import { useT } from '../i18n/lang';

function TodayInner({ chart, birth }: { chart: RawChart; birth: BirthDetails }) {
  const { t, tp, ts, lang } = useT();
  const [rep, setRep] = useState<TransitReport | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    computeTransits(chart, birth.lat, birth.lon, new Date(), lang)
      .then((r) => alive && setRep(r))
      .catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, [chart, birth.lat, birth.lon, lang]);

  if (err) return <p className="p-8 text-center text-lotus-400">Transit error: {err}</p>;
  if (!rep) return <p className="p-8 text-center text-parchment-200/60">{t('today.computing')}</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-parchment-100">{t('p.today.t')}</h1>
        <p className="mt-1 text-sm text-parchment-200/70">
          {t('today.judged')} {ts(rep.moonSign)}. {rep.at.toLocaleDateString()}
        </p>
      </div>

      {/* Sade Sati */}
      <div className={`card p-5 ${rep.sadeSati.active ? 'border-lotus-500/40' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg text-parchment-100">{t('today.sade')}</span>
          <span className={rep.sadeSati.active ? 'text-lotus-500' : 'text-clay-500'}>
            {rep.sadeSati.active ? `${t('today.active')} · ${t(`ph.${rep.sadeSati.phase}`)} ${t('today.phaseWord')}` : t('today.notActive')}
          </span>
        </div>
        <p className="mt-2 text-sm text-parchment-200/80">{rep.sadeSati.note}</p>
        {rep.ashtamaShani && <p className="mt-2 text-xs text-lotus-500">{t('today.ashtama')}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-saffron-600">{t('today.jup')}</h3>
          <p className="mt-1 text-xs text-parchment-200/50">{t('today.fromMoonH')}: {rep.jupiterHouseFromMoon}</p>
          <p className="mt-1 text-xs text-parchment-200/75">
            {[2, 5, 7, 9, 11].includes(rep.jupiterHouseFromMoon) ? t('today.jupGood') : t('today.jupInward')}
          </p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-saffron-600">{t('today.sat')}</h3>
          <p className="mt-1 text-xs text-parchment-200/50">{t('today.fromMoonH')}: {rep.saturnHouseFromMoon}</p>
          <p className="mt-1 text-xs text-parchment-200/75">
            {[3, 6, 11].includes(rep.saturnHouseFromMoon) ? t('today.satGood') : t('today.satHard')}
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800 text-xs uppercase tracking-wide text-parchment-200/50">
            <tr><th className="px-4 py-2">{t('th.planet')}</th><th className="px-4 py-2">{t('th.signNow')}</th><th className="px-4 py-2">{t('th.fromMoon')}</th><th className="px-4 py-2">{t('th.motion')}</th></tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {rep.planets.map((p) => (
              <tr key={p.planet}>
                <td className="px-4 py-2 font-medium text-parchment-100">{tp(p.planet)}</td>
                <td className="px-4 py-2">{ts(p.sign)}</td>
                <td className="px-4 py-2 tabular-nums">{p.houseFromMoon}</td>
                <td className="px-4 py-2 text-xs text-parchment-200/50">{p.retrograde ? t('mo.retro') : t('mo.direct')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] italic text-parchment-200/40">{t('today.disc')}</p>
    </div>
  );
}

export default function Today() {
  return <ChartGuard>{(chart, birth) => <TodayInner chart={chart} birth={birth} />}</ChartGuard>;
}
