// Inbuilt birthplace search, Nepal + India, fully client-side. The dataset
// (public/data/places.json) is fetched once and cached in memory. No external
// API is ever called, so birth-location entry works offline and privately.
//
// Row format: [name, admin, cc, lat, lon, population]  (sorted by pop desc)
// Timezone is derived from the country code: Nepal +5:45, India +5:30.
type Row = [string, string, string, number, number, number];

export interface Place {
  name: string;
  admin: string;
  country: string;
  cc: string;
  lat: number;
  lon: number;
  tz: string;
  tzOffset: number;
  label: string;
}

const TZ_OFFSET: Record<string, number> = { NP: 5.75, IN: 5.5 };
const TZ_NAME: Record<string, string> = { NP: 'Asia/Kathmandu', IN: 'Asia/Kolkata' };
const COUNTRY: Record<string, string> = { NP: 'Nepal', IN: 'India' };

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
  return {
    name: r[0], admin: r[1], country: COUNTRY[r[2]] ?? r[2], cc: r[2],
    lat: r[3], lon: r[4], tz: TZ_NAME[r[2]] ?? '', tzOffset: TZ_OFFSET[r[2]] ?? 0,
    label: [r[0], r[1], COUNTRY[r[2]] ?? r[2]].filter(Boolean).join(', '),
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
