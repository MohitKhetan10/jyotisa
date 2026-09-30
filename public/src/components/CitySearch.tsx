import { useEffect, useRef, useState } from 'react';
import { type Place, searchPlaces, preloadPlaces } from '../lib/places';

interface Props {
  value: string;
  onSelect: (p: Place) => void;
}

const tzLabel = (off: number) => {
  const h = Math.trunc(off);
  const m = Math.round(Math.abs(off - h) * 60);
  return `UTC+${Math.abs(h)}${m ? ':' + String(m).padStart(2, '0') : ''}`;
};

export default function CitySearch({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debRef = useRef<number | undefined>(undefined);

  useEffect(() => { preloadPlaces(); }, []);
  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    setOpen(true);
    window.clearTimeout(debRef.current);
    debRef.current = window.setTimeout(async () => {
      setResults(await searchPlaces(q));
    }, 150);
  }

  function pick(p: Place) {
    setQuery(p.label);
    setResults([]);
    setOpen(false);
    onSelect(p);
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        className="field"
        autoComplete="off"
        placeholder="Search city… e.g. Kathmandu, Pokhara, Delhi, Varanasi"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        aria-label="Birthplace city"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-ink-700 bg-ink-800 shadow-2xl">
          {results.map((p, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(p)}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-ink-700"
              >
                <span>
                  <span className="block text-sm font-medium text-parchment-50">{p.name}</span>
                  <span className="block text-xs text-parchment-200/50">
                    {[p.admin, p.country].filter(Boolean).join(', ')}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-saffron-400/70">{tzLabel(p.tzOffset)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
