import ChartGuard from '../components/ChartGuard';
import { soulPurpose, lifeTimings, cautions } from '../engine/interpret/life';
import { useT } from '../i18n/lang';

export default function Life() {
  const { t, tp, lang } = useT();
  return (
    <ChartGuard>
      {(chart) => {
        const soul = soulPurpose(chart, lang);
        const timings = lifeTimings(chart, lang);
        const cauts = cautions(chart, lang);
        return (
          <div className="space-y-8">
            {/* Soul purpose */}
            <section>
              <h1 className="font-serif text-2xl text-parchment-100">{t('p.life.t')}</h1>
              <p className="mt-1 text-sm text-parchment-200/70">
                {t('life.akA')} <span className="text-saffron-600">{tp(soul.atmakaraka)}</span>{t('life.akB')}
              </p>
              <div className="mt-4 space-y-3">
                {soul.paragraphs.map((p, i) => (
                  <div key={i} className="card p-5">
                    <h2 className="font-serif text-base text-saffron-400">{p.heading}</h2>
                    <p className="mt-1 text-sm text-parchment-200/85">{p.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timing windows */}
            <section>
              <h2 className="font-serif text-xl text-parchment-100">{t('p.life.timing')}</h2>
              <p className="mt-1 text-sm text-parchment-200/70">{t('p.life.timingSub')}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {timings.map((a) => (
                  <div key={a.area} className="card p-5">
                    <h3 className="font-medium text-saffron-600">{a.area}</h3>
                    <p className="mt-1 text-xs text-parchment-200/50">
                      {t('life.sig')}: {a.significators.map((s) => tp(s)).join(', ')}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {a.windows.length ? a.windows.map((w, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="text-parchment-100">{w.label}</span>
                          <span className="text-xs text-parchment-200/60">{w.from} to {w.to}</span>
                        </li>
                      )) : <li className="text-xs text-parchment-200/50">{t('life.noWindow')}</li>}
                    </ul>
                    <p className="mt-3 text-xs italic text-parchment-200/50">{a.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cautions */}
            <section>
              <h2 className="font-serif text-xl text-parchment-100">{t('p.life.cautions')}</h2>
              <p className="mt-1 text-sm text-parchment-200/70">{t('p.life.cautionsSub')}</p>
              <div className="mt-4 space-y-3">
                {cauts.length === 0 && (
                  <p className="text-sm text-parchment-200/50">{t('life.cautNone')}</p>
                )}
                {cauts.map((c, i) => (
                  <div key={i} className="card border-l-2 border-lotus-500/50 p-5">
                    <h3 className="font-medium text-lotus-500">{c.area}</h3>
                    <p className="mt-1 text-xs text-parchment-200/50">{t('life.chartShows')}: {c.finding}</p>
                    <p className="mt-2 text-sm text-parchment-200/85">{c.possibility}</p>
                    <p className="mt-2 text-sm text-clay-500">
                      <span className="text-clay-500 font-medium">{t('life.willGrace')}:</span> {c.grace}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] italic text-parchment-200/40">{t('life.disclaimer')}</p>
            </section>
          </div>
        );
      }}
    </ChartGuard>
  );
}
