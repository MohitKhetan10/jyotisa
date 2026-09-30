import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitySearch from '../components/CitySearch';
import { useChart } from '../store/chart';
import type { Place } from '../lib/places';
import { useT } from '../i18n/lang';

export default function BirthInput() {
  const navigate = useNavigate();
  const generate = useChart((s) => s.generate);
  const { t } = useT();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeKnown, setTimeKnown] = useState(true);
  const [place, setPlace] = useState<Place | null>(null);
  const [placeLabel, setPlaceLabel] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!date) return setError(t('birth.errDate'));
    if (!place) return setError(t('birth.errPlace'));
    if (timeKnown && !time) return setError(t('birth.errTime'));

    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = (timeKnown ? time : '12:00').split(':').map(Number);

    await generate({
      name: name.trim() || 'Seeker',
      year: y, month: m, day: d,
      hour: hh, minute: mm,
      timeKnown,
      place: place.label, lat: place.lat, lon: place.lon, tzOffset: place.tzOffset,
    });
    navigate('/dashboard');
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-2xl text-parchment-100">{t('birth.title')}</h1>
      <p className="mt-1 text-sm text-parchment-200/70">{t('birth.subtitle')}</p>

      <form onSubmit={submit} className="card mt-6 space-y-5 p-6">
        <div>
          <label className="label" htmlFor="name">{t('birth.name')}</label>
          <input id="name" className="field" value={name}
                 onChange={(e) => setName(e.target.value)} placeholder={t('birth.namePh')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="date">{t('birth.dob')}</label>
            <input id="date" type="date" className="field" value={date}
                   onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="time">{t('birth.tob')}</label>
            <input id="time" type="time" className="field" value={time}
                   disabled={!timeKnown}
                   onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-parchment-200/70">
          <input type="checkbox" checked={!timeKnown}
                 onChange={(e) => setTimeKnown(!e.target.checked)} />
          {t('birth.unknown')}
        </label>

        {!timeKnown && (
          <p className="rounded-lg border border-saffron-600/40 bg-saffron-600/10 p-3 text-xs text-saffron-600">
            {t('birth.warning')}
          </p>
        )}

        <div>
          <label className="label">{t('birth.place')}</label>
          <CitySearch
            value={placeLabel}
            onSelect={(p) => { setPlace(p); setPlaceLabel(p.label); }}
          />
          {place && (
            <p className="mt-1.5 text-xs text-parchment-200/50">
              {place.lat.toFixed(4)}°, {place.lon.toFixed(4)}° · {place.tz}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-lotus-400">{error}</p>}

        <button type="submit" className="btn-primary w-full">{t('common.generate')}</button>
      </form>
    </div>
  );
}
