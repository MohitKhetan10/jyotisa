import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChart } from '../store/chart';
import { interpretHouses } from '../engine/interpret/houseInterpret';
import { useT } from '../i18n/lang';

export default function Houses() {
  const { birth, chart, status, generate } = useChart();
  const { t, lang } = useT();

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
  if (!chart) return <p className="p-8 text-center text-parchment-200/60">{t('common.calculating')}</p>;

  const houses = interpretHouses(chart, lang);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-parchment-100">{t('p.houses.t')}</h1>
        <p className="mt-1 text-sm text-parchment-200/70">{t('p.houses.s')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {houses.map((h) => (
          <div key={h.house} className="card p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-serif text-lg text-saffron-600">
                  {h.house}. {h.motto}
                </span>
                <div className="text-sm font-medium text-parchment-100">{h.title}</div>
                <div className="text-xs text-parchment-200/50">{h.sanskrit.join(' · ')}</div>
              </div>
              <span className="rounded-md bg-ink-800 px-2 py-1 text-xs text-parchment-200/70">
                {h.sign}
              </span>
            </div>

            <p className="mt-2 text-xs italic text-lotus-500">{h.question}</p>

            {/* Detailed interpretation */}
            <p className="mt-3 text-sm leading-relaxed text-parchment-200/85">{h.detail}</p>

            <div className="mt-3 space-y-1 text-xs text-parchment-200/70">
              <p>
                <span className="text-parchment-200/50">{t('h.lord')}: </span>
                <span className="text-parchment-100">{h.lord}</span>
                {h.lordInHouse && (
                  <span className="text-parchment-200/50"> → {t('h.placed')} {h.lordInHouse}</span>
                )}
              </p>
              <p>
                <span className="text-parchment-200/50">{t('h.occupants')}: </span>
                {h.occupants.length ? h.occupants.join(', ') : '·'}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {h.classes.map((c) => (
                <span key={c} className="rounded bg-ink-800/80 px-2 py-0.5 text-[10px] text-saffron-600/80">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
