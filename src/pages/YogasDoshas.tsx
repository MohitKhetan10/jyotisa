import ChartGuard from '../components/ChartGuard';
import { detectYogas } from '../engine/yoga/yoga';
import { detectDoshas } from '../engine/dosha/dosha';
import { useT } from '../i18n/lang';

export default function YogasDoshas() {
  const { t, lang } = useT();
  return (
    <ChartGuard>
      {(chart) => {
        const yogas = detectYogas(chart, lang);
        const doshas = detectDoshas(chart, lang);
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-2xl text-parchment-100">{t('p.yogas.t')}</h1>
              <p className="mt-1 text-sm text-parchment-200/70">{t('p.yogas.s')}</p>
            </div>

            <section>
              <h2 className="mb-3 font-serif text-lg text-saffron-600">
                {t('p.yogas.yogas')} ({yogas.length} {t('yd.detected')})
              </h2>
              {yogas.length === 0 && (
                <p className="text-sm text-parchment-200/50">{t('yd.noYogas')}</p>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {yogas.map((y, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-parchment-100">{y.name}</span>
                      <span className={`text-xs ${
                        y.strength === 'strong' ? 'text-clay-400'
                        : y.strength === 'moderate' ? 'text-saffron-400' : 'text-parchment-200/50'
                      }`}>{t(`band.${y.strength}`)}</span>
                    </div>
                    <p className="mt-1 text-xs text-parchment-200/50">{t('yd.why')}: {y.why}</p>
                    <p className="mt-2 text-sm text-parchment-200/80">{y.effect}</p>
                    <p className="mt-2 text-xs italic text-parchment-200/50">{t('yd.canModify')}: {y.canModify}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-lg text-lotus-500">{t('p.yogas.doshas')}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {doshas.map((d, i) => (
                  <div key={i} className={`card p-4 ${d.present ? '' : 'opacity-70'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-parchment-100">{d.name}</span>
                      <span className={`text-xs ${d.present ? 'text-lotus-500' : 'text-clay-500'}`}>
                        {d.present ? (d.severity ? t(`sev.${d.severity}`) : t('yd.present')) : t('yd.absent')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-parchment-200/50">{d.definition}</p>
                    <p className="mt-2 text-sm text-parchment-200/80">{d.finding}</p>
                    {d.present && <p className="mt-1 text-sm text-parchment-200/80">{d.interpretation}</p>}
                    {d.cancellation && <p className="mt-1 text-xs text-clay-400/80">{d.cancellation}</p>}
                    {d.present && <p className="mt-1 text-xs text-parchment-200/60">{t('yd.remedy')}: {d.remedy}</p>}
                    <p className="mt-2 text-[11px] italic text-parchment-200/40">{d.disclaimer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      }}
    </ChartGuard>
  );
}
