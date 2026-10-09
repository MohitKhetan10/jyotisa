"""Build the inbuilt birthplace dataset for the ENTIRE WORLD from GeoNames.

Source: GeoNames `cities500.txt` — every city/town with population >= 500 plus
administrative seats of any size (~236k places worldwide). This keeps the file
small enough to ship to the browser while covering virtually every real
birthplace a user will search for. Fully offline: no geocoding API is ever hit.

Each place carries its IANA timezone (e.g. "America/New_York"); the UTC offset
is resolved at runtime from the zone AND the birth date, so historical DST is
handled correctly (critical for the Ascendant and house cusps).

Usage:
    python scripts/build_places.py [geodata_dir]   # dir with cities500.txt, admin1CodesASCII.txt
    (defaults to scripts/geodata)
Output: public/data/places.json  ->  list of
    [name, admin(state/province), country_code, lat, lon, population, tz]
sorted by population desc so the biggest matches surface first.
"""
import csv, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "geodata")
OUT  = os.path.join(HERE, "..", "public", "data", "places.json")

# GeoNames column indices for cities500.txt (tab separated, no header)
NAME, LAT, LON, FCLASS = 1, 4, 5, 6
CC, ADMIN1_CODE_IDX, POP, TZ = 8, 10, 14, 17

csv.field_size_limit(2**31 - 1)

# admin1 code ("IN.28") -> readable name ("West Bengal")
ADMIN1 = {}
with open(os.path.join(SRC, "admin1CodesASCII.txt"), encoding="utf-8") as f:
    for r in csv.reader(f, delimiter="\t"):
        if len(r) >= 2:
            ADMIN1[r[0]] = r[1]

rows = []
seen = set()
with open(os.path.join(SRC, "cities500.txt"), encoding="utf-8") as f:
    for r in csv.reader(f, delimiter="\t"):
        if len(r) < 18 or r[FCLASS] != "P":   # populated places only
            continue
        name = r[NAME].strip()
        cc = r[CC].strip()
        if not name or not cc:
            continue
        try:
            pop = int(r[POP] or 0)
        except ValueError:
            pop = 0
        admin = ADMIN1.get(f"{cc}.{r[ADMIN1_CODE_IDX]}", "")
        lat, lon = round(float(r[LAT]), 4), round(float(r[LON]), 4)
        tz = r[TZ].strip()
        # De-dupe exact name+admin+coords repeats that GeoNames sometimes carries.
        key = (name.lower(), admin, cc, round(lat, 2), round(lon, 2))
        if key in seen:
            continue
        seen.add(key)
        rows.append([name, admin, cc, lat, lon, pop, tz])

rows.sort(key=lambda x: x[5], reverse=True)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, separators=(",", ":"))

countries = len({r[2] for r in rows})
size = os.path.getsize(OUT)
print(f"places: {len(rows)}  countries: {countries}  file: {size/1024/1024:.1f} MB -> {OUT}")
