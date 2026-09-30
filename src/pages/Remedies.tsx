import ChartGuard from '../components/ChartGuard';
import { prioritizeRemedies, REMEDIES } from '../engine/remedies/prioritize';
import type { PlanetId } from '../types/chart';
import { useT } from '../i18n/lang';
import { REMEDY_C } from '../i18n/remedyContent';

function RemedyCard({ planet, tag, reason }: { planet: PlanetId; tag: string; reason: string }) {
  const { t, tp, lang } = useT();
  const m = REMEDIES[planet].mantra; // mantra is language-neutral (Sanskrit)
  const r = REMEDY_C[lang][planet];
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div><dt className="inline text-parchment-200/50">{k}: </dt><dd className="inline text-parchment-100">{v}</dd></div>
  );
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-saffron-600">{tp(planet)}</h3>
        <span className="rounded bg-ink-800 px-2 py-0.5 text-xs text-parchment-200/60">{tag}</span>
      </div>
      <p className="mt-1 text-xs italic text-parchment-200/50">{t('rem.chosen')}: {reason}</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <Row k={t('rem.mantra')} v={`${m.sanskrit}, ${m.transliteration} (×${m.count})`} />
        <Row k={t('rem.day')} v={r.day} />
        <Row k={t('rem.deity')} v={r.deity} />
        <Row k={t('rem.charity')} v={r.charity} />
        <Row k={t('rem.fasting')} v={r.fasting} />
        <Row k={t('rem.lifestyle')} v={r.lifestyle} />
      </dl>
      <p className="mt-3 rounded-lg border border-saffron-600/30 bg-saffron-600/5 p-2 text-xs text-saffron-600/90">
        {t('rem.gem')} ({r.gemstone.stone}): {r.gemstone.caution}
      </p>
    </div>
  );
}

export default function Remedies() {
  const { t, lang } = useT();
  return (
    <ChartGuard>
      {(chart) => {
        const plan = prioritizeRemedies(chart, lang);
        return (
          <div className="space-y-5">
            <div>
              <h1 className="font-serif text-2xl text-parchment-100">{t('p.remedies.t')}</h1>
              <p className="mt-1 text-sm text-parchment-200/70">{t('p.remedies.s')} {plan.note}</p>
            </div>
            <RemedyCard planet={plan.primary.planet} tag={t('p.remedies.primary')} reason={plan.primary.reason} />
            {plan.supporting.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {plan.supporting.map((s) => (
                  <RemedyCard key={s.planet} planet={s.planet} tag={t('p.remedies.supporting')} reason={s.reason} />
                ))}
              </div>
            )}
          </div>
        );
      }}
    </ChartGuard>
  );
}
