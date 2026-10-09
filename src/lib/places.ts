// Inbuilt worldwide birthplace search, fully client-side. The dataset
// (public/data/places.json) is fetched once and cached in memory. No external
// API is ever called, so birth-location entry works offline and privately.
//
// Row format: [name, admin, cc, lat, lon, population, tz]  (sorted by pop desc)
// Each place carries its IANA timezone; the UTC offset is resolved from that
// zone AND the birth date at compute time (see lib/tz.ts) so DST is correct.
import { currentOffset } from './tz';

type Row = [string, string, string, number, number, number, string];

export interface Place {
  name: string;
  admin: string;
  country: string;
  cc: string;
  lat: number;
  lon: number;
  tz: string;
  /** Present-day offset in hours — a display hint only. The chart uses the
   *  birth-date offset derived from `tz` (see lib/tz.ts). */
  tzOffset: number;
  label: string;
}

// Country code -> English country name, via the browser's own locale data.
const regionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;
const countryName = (cc: string): string => {
  try {
    return regionNames?.of(cc) ?? cc;
  } catch {
    return cc;
  }
};

// Fold diacritics and collapse spacing/punctuation so "Ilam" matches "Ilām"
// and "Rae Bareli" matches "Raebareli". 296k of our names carry diacritics.
const fold = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

let _rows: Row[] | null = null;
let _keys: string[] | null = null; // folded search key, index-aligned with _rows
let _loading: Promise<void> | null = null;

async function load(): Promise<void> {
  if (_rows) return;
  if (!_loading) {
    _loading = fetch('/data/places.json')
      .then((r) => r.json())
      .then((rows: Row[]) => {
        _rows = rows;
        _keys = rows.map((r) => fold(r[0]));
      });
  }
  return _loading;
}

/** Eagerly warm the cache (call on birth-input mount). */
export const preloadPlaces = () => { void load(); };

function toPlace(r: Row): Place {
  const country = countryName(r[2]);
  return {
    name: r[0], admin: r[1], country, cc: r[2],
    lat: r[3], lon: r[4], tz: r[6], tzOffset: currentOffset(r[6]),
    label: [r[0], r[1], country].filter(Boolean).join(', '),
  };
}

export async function searchPlaces(query: string, limit = 8): Promise<Place[]> {
  const q = fold(query);
  if (q.length < 2) return [];
  await load();
  const rows = _rows!;
  const keys = _keys!;
  const prefix: Row[] = [];
  const contains: Row[] = [];
  // Rows are pre-sorted by population, so the first matches are the biggest
  // (most likely) places. We stop scanning once we have enough prefix hits.
  for (let i = 0; i < rows.length; i++) {
    const k = keys[i];
    if (k.startsWith(q)) {
      if (prefix.length < limit) prefix.push(rows[i]);
      if (prefix.length >= limit) break;
    } else if (contains.length < limit && k.includes(q)) {
      contains.push(rows[i]);
    }
  }
  return prefix.concat(contains).slice(0, limit).map(toPlace);
}
