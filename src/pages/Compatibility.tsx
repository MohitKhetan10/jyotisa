import { useState } from 'react';
import CitySearch from '../components/CitySearch';
import type { Place } from '../lib/places';
import { offsetForZone } from '../lib/tz';
import type { BirthDetails, RawChart } from '../types/chart';
import { computeChart } from '../engine/ephemeris/swiss';
import { ashtakoota, type MatchReport } from '../engine/compatibility/ashtakoota';
import { useT } from '../i18n/lang';

interface Draft { name: string; date: string; time: string; place: Place | null; }
const empty: Draft = { name: '', date: '', time: '', place: null };

function PersonForm({ label, draft, set }: { label: string; draft: Draft; set: (d: Draft) => void }) {
  return (
    <div className="card space-y-3 p-5">
      <h3 className="font-serif text-saffron-400">{label}</h3>
      <input className="field" placeholder="Name" value={draft.name}
             onChange={(e) => set({ ...draft, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input type="date" className="field" value={draft.date} onChange={(e) => set({ ...draft, date: e.target.value })} />
        <input type="time" className="field" value={draft.time} onChange={(e) => set({ ...draft, time: e.target.value })} />
      </div>
      <CitySearch value={draft.place?.label ?? ''} onSelect={(p) => set({ ...draft, place: p })} />
    </div>
  );
}

const toBirth = (d: Draft): BirthDetails => {
  const [y, m, dd] = d.date.split('-').map(Number);
  const [hh, mm] = (d.time || '12:00').split(':').map(Number);
  const tzOffset = offsetForZone(d.place!.tz, y, m, dd, hh, mm);
  return { name: d.name || 'Person', year: y, month: m, day: dd, hour: hh, minute: mm,
    timeKnown: !!d.time, place: d.place!.label, lat: d.place!.lat, lon: d.place!.lon, tzOffset };
};

export default function Compatibility() {
  const { t } = useT();
  const [a, setA] = useState<Draft>(empty);
  const [b, setB] = useState<Draft>(empty);
  const [report, setReport] = useState<MatchReport | null>(null);
  const [err, setErr] = useState('');

  async function run() {
    setErr('');
    if (!a.date || !a.place || !b.date || !b.place) { setErr('Enter date and birthplace for both people.'); return; }
    const [ca, cb]: [RawChart, RawChart] = await Promise.all([computeChart(toBirth(a)), computeChart(toBirth(b))]);
    setReport(ashtakoota(ca, cb));
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-parchment-100">{t('p.match.t')}</h1>
        <p className="mt-1 text-sm text-parchment-200/70">
          {t('p.match.s')}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PersonForm label="Person A" draft={a} set={setA} />
        <PersonForm label="Person B" draft={b} set={setB} />
      </div>
      {err && <p className="text-sm text-lotus-400">{err}</p>}
      <button className="btn-primary" onClick={run}>{t('p.match.run')}</button>

      {report && (
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-lg text-saffron-400">
              {report.total} / {report.max} guṇas
            </h2>
            <span className="text-sm text-parchment-200/70">{report.verdict}</span>
          </div>
          <div className="mt-4 space-y-2">
            {report.kootas.map((k) => (
              <div key={k.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-100">{k.name}</span>
                  <span className="text-parchment-200/60">{k.got} / {k.max}</span>
                </div>
                <div className="mt-0.5 h-1.5 w-full rounded bg-ink-700">
                  <div className="h-full rounded bg-saffron-400" style={{ width: `${(k.got / k.max) * 100}%` }} />
                </div>
                <p className="mt-0.5 text-xs text-parchment-200/50">{k.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] italic text-parchment-200/40">
            A number is not a verdict on love. Read the weak kūṭas; many are remediable,
            and full compatibility also considers Maṅglik status, D9 and the 7th house.
          </p>
        </div>
      )}
    </div>
  );
}
