"""Build the inbuilt birthplace dataset for Nepal + India from GeoNames dumps.

Coverage goal: EVERY real birthplace — every city, town and village — so nobody
searching their birthplace comes up empty. India's GeoNames rows almost all carry
population 0 (the figure is simply unfilled), so a population threshold silently
drops tens of thousands of genuine towns. We therefore keep every populated place
(feature class "P") and rely on a compact row format + gzip to keep transfer small.

Usage:
    python scripts/build_places.py /path/to/geonames   # dir holding IN.txt, NP.txt, admin1.txt
Output: public/data/places.json  ->  list of
    [name, admin(state/province), country_code, lat, lon, population]
sorted by population desc so the biggest matches surface first.
(Timezone is derived from the country code at runtime: NP +5:45, IN +5:30.)
"""
import csv, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = sys.argv[1] if len(sys.argv) > 1 else HERE
OUT  = os.path.join(HERE, "..", "public", "data", "places.json")

# GeoNames column indices (tab separated, no header)
NAME, FCLASS, FCODE, LAT, LON = 1, 6, 7, 4, 5
ADMIN1_CODE_IDX, POP = 10, 14

csv.field_size_limit(2**31 - 1)

# admin1 code ("IN.28") -> readable name ("West Bengal")
ADMIN1 = {}
with open(os.path.join(SRC, "admin1.txt"), encoding="utf-8") as f:
    for r in csv.reader(f, delimiter="\t"):
        if len(r) >= 2:
            ADMIN1[r[0]] = r[1]

def load(path, cc, rows):
    seen = set()
    with open(path, encoding="utf-8") as f:
        for r in csv.reader(f, delimiter="\t"):
            if len(r) < 18 or r[FCLASS] != "P":   # populated places only
                continue
            name = r[NAME].strip()
            if not name:
                continue
            try:
                pop = int(r[POP] or 0)
            except ValueError:
                pop = 0
            admin = ADMIN1.get(f"{cc}.{r[ADMIN1_CODE_IDX]}", "")
            lat, lon = round(float(r[LAT]), 4), round(float(r[LON]), 4)
            # De-dupe exact name+admin+coords repeats that GeoNames sometimes carries.
            key = (name.lower(), admin, round(lat, 2), round(lon, 2))
            if key in seen:
                continue
            seen.add(key)
            rows.append([name, admin, cc, lat, lon, pop])

rows = []
load(os.path.join(SRC, "NP.txt"), "NP", rows)
load(os.path.join(SRC, "IN.txt"), "IN", rows)
rows.sort(key=lambda x: x[5], reverse=True)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, separators=(",", ":"))

np_n = sum(1 for r in rows if r[2] == "NP")
in_n = sum(1 for r in rows if r[2] == "IN")
size = os.path.getsize(OUT)
print(f"Nepal: {np_n}  India: {in_n}  total: {len(rows)}  file: {size/1024/1024:.1f} MB -> {OUT}")
