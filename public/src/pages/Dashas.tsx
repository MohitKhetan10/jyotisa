import { useState } from 'react';
import ChartGuard from '../components/ChartGuard';
import { vimshottari, currentDasha, type DashaPeriod } from '../engine/dasha/vimshottari';
import { interpretDasha, interpretAntar } from '../engine/interpret/dashaInterpret';
import { useT } from '../i18n/lang';
import type { PlanetId, RawChart } from '../types/chart';
import { STRINGS, type Lang } from '../i18n/strings';

const fmt = (d: Date) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
const localName = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;

// A small analysis block (effects / actions / optional antardaśā dynamic).
function Analysis({ effects, actions, dynamic }: { effects: string; actions: string; dynamic?: string }) {
  const { t } = useT();
  return (
    <div className="mt-2 space-y-2 rounded-lg bg-ink-800/60 p-3 text-xs">
      {dynamic && <p className="text-parchment-200/85">{dynamic}</p>}
      <p><span className="font-medium text-saffron-600">{t('d.effects')}: </span><span className="text-parchment-200/80">{effects}</span></p>
      <p><span className="font-medium text-clay-500">{t('d.actions')}: </span><span className="text-parchment-200/80">{actions}</span></p>
    </div>
  );
}

function Period({ p, chart, lang, parentLord, activeLord, depth }: {
  p: DashaPeriod; chart: RawChart; lang: Lang; parentLord: PlanetId;
  activeLord?: string; depth: number;
}) {
  const [open, setOpen] = useState(false);
  const isActive = activeLord === p.lord && depth === 0;
  // depth 1 = antardaśā: show its detailed analysis when opened.
  const antar = depth === 1 && open ? interpretAntar(chart, parentLord, p.lord, lang) : null;
  return (
    <div className={depth ? 'ml-4 border-l border-ink-700 pl-3' : ''}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
          isActive ? 'bg-saffron-500/15 text-saffron-700' : 'hover:bg-ink-800'
        }`}
      >
        <span>
          {(p.children || depth === 1) ? (open ? '▾ ' : '▸ ') : '• '}
          <span className="font-medium text-parchment-100">{localName(lang, p.lord)}</span>
        </span>
        <span className="text-xs text-parchment-200/50">{fmt(p.start)} to {fmt(p.end)}</span>
      </button>
      {antar && <Analysis effects={antar.effects} actions={antar.actions} dynamic={antar.dynamic} />}
      {open && p.children && (
        <div className="mt-1 space-y-0.5">
          {p.children.map((c, i) => (
            <Period key={i} p={c} chart={chart} lang={lang} parentLord={p.lord} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashas() {
  const { t, tp, lang } = useT();
  return (
    <ChartGuard>
      {(chart) => {
        const periods = vimshottari(chart);
        const now = currentDasha(periods);
        const mahaRead = now.maha ? interpretDasha(chart, now.maha.lord, lang) : null;
        const antarRead = now.maha && now.antar ? interpretAntar(chart, now.maha.lord, now.antar.lord, lang) : null;
        return (
          <div className="space-y-5">
            <div>
              <h1 className="font-serif text-2xl text-parchment-100">{t('p.dashas.t')}</h1>
              <p className="mt-1 text-sm text-parchment-200/70">{t('p.dashas.s')}</p>
            </div>

            {now.maha && (
              <div className="card p-5">
                <div className="text-xs uppercase tracking-wide text-parchment-200/50">{t('p.dashas.now')}</div>
                <div className="mt-1 font-serif text-lg text-saffron-600">
                  {tp(now.maha.lord)}
                  {now.antar && <span className="text-parchment-200/70"> / {tp(now.antar.lord)}</span>}
                  {now.pratyantar && <span className="text-parchment-200/50"> / {tp(now.pratyantar.lord)}</span>}
                </div>

                {/* Detailed current-period analysis */}
                {mahaRead && (
                  <div className="mt-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-parchment-200/40">
                      {t('d.periodAnalysis')}
                    </div>
                    <p className="mt-1 text-sm font-medium text-parchment-100">{t('d.maha')}: {tp(now.maha.lord)}</p>
                    <Analysis effects={mahaRead.effects} actions={mahaRead.actions} />
                    {antarRead && (
                      <>
                        <p className="mt-3 text-sm font-medium text-parchment-100">{t('d.antar')}: {tp(now.antar!.lord)}</p>
                        <Analysis effects={antarRead.effects} actions={antarRead.actions} dynamic={antarRead.dynamic} />
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="card p-3">
              {periods.map((p, i) => (
                <Period key={i} p={p} chart={chart} lang={lang} parentLord={p.lord}
                        activeLord={now.maha?.lord} depth={0} />
              ))}
            </div>
            <p className="text-xs text-parchment-200/40">
              Convention: 1 year = 365.2425 days; balance from the Moon’s exact nakṣatra
              fraction at birth. Click any antardaśā for its detailed analysis.
            </p>
          </div>
        );
      }}
    </ChartGuard>
  );
}
