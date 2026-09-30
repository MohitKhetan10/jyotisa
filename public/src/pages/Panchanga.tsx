import { useEffect, useState } from 'react';
import { computePanchanga, type Panchanga as P } from '../engine/panchanga/panchanga';
import { useChart } from '../store/chart';
import { useT } from '../i18n/lang';

const t = (d: Date | null) => d ? d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ', ';
const range = (r: [Date, Date] | null) => r ? `${t(r[0])} to ${t(r[1])}` : ', ';

export default function Panchanga() {
  const birth = useChart((s) => s.birth);
  const { t: tr, lang } = useT();
  // Default location: birthplace if known, else Kathmandu.
  const lat = birth?.lat ?? 27.7017;
  const lon = birth?.lon ?? 85.3206;
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pan, setPan] = useState<P | null>(null);

  useEffect(() => {
    const [y, m, d] = date.split('-').map(Number);
    const noon = new Date(Date.UTC(y, m - 1, d, 6, 0, 0)); // ~local midday for IN/NP
    computePanchanga(noon, lat, lon, lang).then(setPan).catch(() => setPan(null));
  }, [date, lat, lon, lang]);

  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex justify-between border-b border-ink-700 py-2 text-sm">
      <span className="text-parchment-200/50">{k}</span>
      <span className="text-parchment-100">{v}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-parchment-100">{tr('p.panchanga.t')}</h1>
        <p className="mt-1 text-sm text-parchment-200/70">
          {tr('pn.sub')} {birth ? birth.place : 'Kathmandu'}.
        </p>
      </div>
      <input type="date" className="field max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} />

      {!pan ? (
        <p className="text-parchment-200/60">{tr('common.calculating')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-2 font-serif text-saffron-600">{tr('p.panchanga.limbs')}</h2>
            <Row k={tr('pn.vara')} v={pan.vara} />
            <Row k={tr('pn.tithi')} v={`${pan.tithi.name} (${pan.tithi.paksha} ${tr('pn.paksha')})`} />
            <Row k={tr('pn.nak')} v={pan.nakshatra} />
            <Row k={tr('pn.yoga')} v={pan.yoga} />
            <Row k={tr('pn.karana')} v={pan.karana} />
          </div>
          <div className="card p-5">
            <h2 className="mb-2 font-serif text-saffron-600">{tr('p.panchanga.times')}</h2>
            <Row k={tr('pn.sunrise')} v={t(pan.sunrise)} />
            <Row k={tr('pn.sunset')} v={t(pan.sunset)} />
            <Row k={tr('pn.rahu')} v={range(pan.rahuKalam)} />
            <Row k={tr('pn.yama')} v={range(pan.yamaganda)} />
            <Row k={tr('pn.gulika')} v={range(pan.gulika)} />
            <Row k={tr('pn.abhijit')} v={range(pan.abhijit)} />
          </div>
        </div>
      )}
      <p className="text-[11px] italic text-parchment-200/40">{tr('pn.disc')}</p>
    </div>
  );
}
