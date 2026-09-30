import type { PlanetPosition, Ascendant, PlanetId } from '../types/chart';

// North Indian chart: fixed diamond layout. Houses sit in fixed screen
// positions; the sign (rashi) rotates so house 1 always holds the ascendant.
const ABBR: Record<PlanetId, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju',
  Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

// Label + planet-cluster centroids for houses 1..12 in a 400×400 viewport.
const HOUSE_POS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 90 }, 2: { x: 100, y: 45 }, 3: { x: 55, y: 100 },
  4: { x: 100, y: 200 }, 5: { x: 55, y: 300 }, 6: { x: 100, y: 355 },
  7: { x: 200, y: 300 }, 8: { x: 300, y: 355 }, 9: { x: 345, y: 300 },
  10: { x: 300, y: 200 }, 11: { x: 345, y: 100 }, 12: { x: 300, y: 45 },
};

interface Props {
  ascendant: Ascendant;
  planets: PlanetPosition[];
  size?: number;
}

export default function KundliChart({ ascendant, planets, size = 360 }: Props) {
  const asc = ascendant.signIndex;
  // Rashi number (1-12, Aries=1) occupying each house.
  const rashiOf = (house: number) => ((asc + house - 1) % 12) + 1;
  const byHouse = (house: number) => planets.filter((p) => p.house === house);

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className="max-w-full"
      role="img"
      aria-label="North Indian birth chart (D1 Rāśi)"
    >
      <rect x="1" y="1" width="398" height="398" fill="none" stroke="#333a50" strokeWidth="2" />
      {/* diagonals */}
      <line x1="0" y1="0" x2="400" y2="400" stroke="#333a50" strokeWidth="1.5" />
      <line x1="400" y1="0" x2="0" y2="400" stroke="#333a50" strokeWidth="1.5" />
      {/* inner diamond joining edge midpoints */}
      <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#333a50" strokeWidth="1.5" />

      {Object.entries(HOUSE_POS).map(([h, pos]) => {
        const house = Number(h);
        const bodies = byHouse(house);
        return (
          <g key={h}>
            {/* faint rashi number */}
            <text
              x={pos.x}
              y={pos.y - 16}
              textAnchor="middle"
              className="fill-parchment-200/30"
              fontSize="11"
            >
              {rashiOf(house)}
            </text>
            {/* planets, stacked */}
            {bodies.map((p, i) => (
              <text
                key={p.planet}
                x={pos.x}
                y={pos.y + i * 15}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                className={
                  p.dignity === 'exalted'
                    ? 'fill-saffron-400'
                    : p.dignity === 'debilitated'
                      ? 'fill-lotus-400'
                      : 'fill-parchment-50'
                }
              >
                {ABBR[p.planet]}
                {p.retrograde ? '↺' : ''}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
