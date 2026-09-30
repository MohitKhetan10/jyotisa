// Inbuilt birthplace search, Nepal + India, fully client-side. The dataset
// (public/data/places.json) is fetched once and cached in memory. No external
// API is ever called, so birth-location entry works offline and privately.
//
// Row format: [name, admin, cc, lat, lon, tz, population]  (sorted by pop desc)
type Row = [string, string, string, number, number, string, number];

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
const COUNTRY: Record<string, string> = { NP: 'Nepal', IN: 'India' };

let _rows: Row[] | null = null;
let _loading: Promise<Row[]> | null = null;

async function load(): Promise<Row[]> {
  if (_rows) return _rows;
  if (!_loading) {
    _loading = fetch('/data/places.json')
      .then((r) => r.json())
      .then((rows: Row[]) => { _rows = rows; return rows; });
  }
  return _loading;
}

/** Eagerly warm the cache (call on birth-input mount). */
export const preloadPlaces = () => { void load(); };

function toPlace(r: Row): Place {
  return {
    name: r[0], admin: r[1], country: COUNTRY[r[2]] ?? r[2], cc: r[2],
    lat: r[3], lon: r[4], tz: r[5], tzOffset: TZ_OFFSET[r[2]] ?? 0,
    label: [r[0], r[1], COUNTRY[r[2]] ?? r[2]].filter(Boolean).join(', '),
  };
}

export async function searchPlaces(query: string, limit = 8): Promise<Place[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const rows = await load();
  const prefix: Row[] = [];
  const contains: Row[] = [];
  for (const r of rows) {
    const n = r[0].toLowerCase();
    if (n.startsWith(q)) { if (prefix.length < limit) prefix.push(r); }
    else if (n.includes(q) && contains.length < limit) contains.push(r);
    if (prefix.length >= limit) break;
  }
  return prefix.concat(contains).slice(0, limit).map(toPlace);
}
