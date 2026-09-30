import { useState } from 'react';
import ChartGuard from '../components/ChartGuard';
import { interpretPlanets } from '../engine/interpret/interpret';
import { computeStrength } from '../engine/strength/strength';
import { STRENGTH_LIMITATIONS } from '../engine/strength/strength';
import { useT } from '../i18n/lang';

export default function Analysis() {
  const [openWhy, setOpenWhy] = useState<number | null>(null);
  const { t, tp, lang } = useT();
  return (
    <ChartGuard>
      {(chart) => {
        const interps = interpretPlanets(chart, lang);
        const strengths = computeStrength(chart);
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-2xl text-parchment-100">{t('p.analysis.t')}</h1>
              <p className="mt-1 text-sm text-parchment-200/70">{t('p.analysis.s')}</p>
            </div>

            {/* Strength table */}
            <div className="card overflow-hidden">
              <div className="border-b border-ink-700 bg-ink-800 px-4 py-2 text-xs uppercase tracking-wide text-parchment-200/50">
                {t('p.analysis.strength')}
              </div>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-ink-700">
                  {strengths.map((s) => (
                    <tr key={s.planet}>
                      <td className="px-4 py-2 font-medium text-parchment-100">{tp(s.planet)}</td>
                      <td className="px-4 py-2 text-xs text-parchment-200/60">{t(`nat.${s.functionalNature}`)}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded bg-ink-700">
                            <div className={`h-full rounded ${
                              s.band === 'strong' ? 'bg-clay-400' : s.band === 'moderate' ? 'bg-saffron-400' : 'bg-lotus-400'
                            }`} style={{ width: `${s.score * 10}%` }} />
                          </div>
                          <span className="text-xs text-parchment-200/60">{s.score}/10 · {t(`band.${s.band}`)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs text-parchment-200/50">{s.notes.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-2 text-[11px] italic text-parchment-200/40">{STRENGTH_LIMITATIONS}</p>
            </div>

            {/* Interpretations */}
            <div className="space-y-3">
              {interps.map((it, i) => (
                <div key={i} className="card p-4">
                  <h3 className="font-serif text-base text-saffron-600">{it.subject}</h3>
                  <p className="mt-2 text-sm text-parchment-200/85">{it.whatItMeans}</p>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <p className="text-clay-500"><b className="text-clay-500">{t('an.positive')}:</b> {it.positive}</p>
                    <p className="text-lotus-500"><b className="text-lotus-400">{t('an.challenge')}:</b> {it.challenge}</p>
                  </div>
                  <p className="mt-2 text-xs text-parchment-200/60"><b>{t('an.modifies')}:</b> {it.whatModifies}</p>
                  <p className="mt-1 text-xs text-parchment-200/60"><b>{t('an.timing')}:</b> {it.timing}</p>
                  <p className="mt-1 text-xs text-parchment-200/60"><b>{t('an.remedy')}:</b> {it.remedy}</p>
                  <button
                    onClick={() => setOpenWhy(openWhy === i ? null : i)}
                    className="mt-2 text-xs text-saffron-600 underline-offset-2 hover:underline"
                  >
                    {openWhy === i ? t('common.hideWhy') : t('common.why')}
                  </button>
                  {openWhy === i && (
                    <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs text-parchment-200/60">
                      {it.why.map((w, j) => <li key={j}>{w}</li>)}
                    </ul>
                  )}
                  <p className="mt-2 text-[11px] italic text-parchment-200/40">{it.note}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </ChartGuard>
  );
}
