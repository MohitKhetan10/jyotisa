import { useState } from 'react';
import ChartGuard from '../components/ChartGuard';
import KundliChart from '../components/KundliChart';
import { VARGAS, buildVarga, isVargottama, type VargaId } from '../engine/varga/varga';
import { interpretVarga } from '../engine/interpret/vargaInterpret';
import type { Ascendant, PlanetPosition } from '../types/chart';
import { useT } from '../i18n/lang';

export default function Vargas() {
  const [id, setId] = useState<VargaId>('D9');
  const { t, lang } = useT();
  return (
    <ChartGuard>
      {(chart) => {
        const v = buildVarga(id, chart);
        // Adapt varga planets to the KundliChart shape (house/sign only needed).
        const pseudoAsc = { signIndex: v.ascSignIndex, sign: v.ascSign } as Ascendant;
        const pseudoPlanets = v.planets.map((p) => ({
          planet: p.planet, sign: p.sign, signIndex: p.signIndex,
          house: p.house, dignity: p.dignity, retrograde: false,
        })) as unknown as PlanetPosition[];

        return (
          <div className="space-y-5">
            <div>
              <h1 className="font-serif text-2xl text-parchment-100">{t('p.vargas.t')}</h1>
              <p className="mt-1 text-sm text-parchment-200/60">
                16 vargas. Convention: one consistent Parāśarī method (documented),                 schools differ on some vargas. D60 is highly sensitive to birth-time accuracy.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {VARGAS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setId(m.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs transition ${
                    id === m.id ? 'bg-saffron-500 text-ink-950' : 'bg-ink-800 text-parchment-200/70 hover:bg-ink-700'
                  }`}
                >{m.id}</button>
              ))}
            </div>

            <div className="card p-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="shrink-0">
                  <KundliChart ascendant={pseudoAsc} planets={pseudoPlanets} size={320} />
                </div>
                <div className="text-sm text-parchment-200/75">
                  <h2 className="font-serif text-lg text-saffron-400">
                    {v.meta.id} · {v.meta.name} <span className="text-parchment-200/50">({v.meta.sanskrit})</span>
                  </h2>
                  <p className="mt-1 text-xs">{v.meta.purpose}</p>
                  <p className="mt-3 text-xs text-parchment-200/50">Ascendant: {v.ascSign}</p>
                  <ul className="mt-3 space-y-1 text-xs">
                    {v.planets.map((p) => (
                      <li key={p.planet}>
                        <span className="text-parchment-100">{p.planet}</span>: {p.sign} (house {p.house})
                        {p.dignity === 'exalted' && <span className="text-clay-400"> · exalted</span>}
                        {p.dignity === 'debilitated' && <span className="text-lotus-400"> · debilitated</span>}
                        {id === 'D9' && isVargottama(chart.planets.find((x) => x.planet === p.planet)!.longitude)
                          && <span className="text-saffron-400"> · vargottama</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="mb-1 font-serif text-saffron-600">{t('p.vargas.saying')}</h3>
              <p className="text-sm text-parchment-200/80">{interpretVarga(id, chart, lang).text}</p>
              <p className="mt-2 text-[11px] italic text-parchment-200/40">
                Traditional interpretation of the {v.meta.name} varga, not a scientific claim.
              </p>
            </div>
          </div>
        );
      }}
    </ChartGuard>
  );
}
