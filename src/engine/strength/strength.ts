// ─────────────────────────────────────────────────────────────────────────
//  PLANETARY STRENGTH, transparent and documented (never an arbitrary score).
//
//  This implements the most reliable, clearly-defined components first:
//    • Functional nature (benefic/malefic) by Lagna, via house lordship rules.
//    • Dig Bala (directional strength), the classical kendra of full strength.
//    • Sthāna-ish dignity points (exalted/own/…/debilitated).
//    • Avasthā penalties (combustion, debilitation).
//  Full classical Ṣaḍbala (Kāla, Cheṣṭā, Naisargika, Dṛk with exact virūpas)
//  is NOT yet implemented, those are marked pending rather than approximated.
//  The composite is a documented heuristic on a 0-10 scale, not Ṣaḍbala rūpas.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { signLordOf } from '../../data/dignities';

export type FunctionalNature = 'benefic' | 'malefic' | 'neutral';

export interface PlanetStrength {
  planet: PlanetId;
  functionalNature: FunctionalNature;
  digBala: number; // 0..1 (fraction of full directional strength)
  dignityPoints: number; // -2..+2
  score: number; // 0..10 composite (documented below)
  band: 'strong' | 'moderate' | 'weak';
  notes: string[];
}

// House of full Dig Bala for each planet (opposite house = zero strength).
const DIG_HOUSE: Record<PlanetId, number> = {
  Jupiter: 1, Mercury: 1, Moon: 4, Venus: 4, Sun: 10, Mars: 10, Saturn: 7,
  Rahu: 7, Ketu: 1, // nodes: no classical Dig Bala; use a neutral anchor
};

/** Functional benefic/malefic by Lagna (simplified Parāśarī functional rules). */
export function functionalNatures(lagnaSignIndex: number): Record<PlanetId, FunctionalNature> {
  const lordOf = (house: number) => signLordOf((lagnaSignIndex + house - 1) % 12);
  const nat = {} as Record<PlanetId, FunctionalNature>;
  const trikonaLords = new Set([1, 5, 9].map(lordOf));
  const dusthanaLords = new Set([3, 6, 11].map(lordOf)); // 3/6/11 as functional malefics
  (['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as PlanetId[]).forEach((pl) => {
    if (trikonaLords.has(pl)) nat[pl] = 'benefic';
    else if (dusthanaLords.has(pl)) nat[pl] = 'malefic';
    else nat[pl] = 'neutral';
  });
  // Nodes are treated as functional malefics (shadowy) by default.
  nat.Rahu = 'malefic'; nat.Ketu = 'malefic';
  return nat;
}

function digBalaFraction(planet: PlanetId, house: number): number {
  const full = DIG_HOUSE[planet];
  // Angular distance from the full-strength house; opposite (6 away) = 0.
  const dist = Math.min((house - full + 12) % 12, (full - house + 12) % 12);
  return 1 - dist / 6; // 1 at full house, 0 at opposite
}

export function computeStrength(chart: RawChart): PlanetStrength[] {
  const natures = functionalNatures(chart.ascendant.signIndex);
  return chart.planets.map((p) => {
    const notes: string[] = [];
    const dig = digBalaFraction(p.planet, p.house);

    let dignityPoints = 0;
    if (p.dignity === 'exalted') { dignityPoints = 2; notes.push('Exalted'); }
    else if (p.dignity === 'own') { dignityPoints = 1.5; notes.push('Own sign'); }
    else if (p.dignity === 'debilitated') { dignityPoints = -2; notes.push('Debilitated'); }

    if (p.combust) notes.push('Combust (weakens expression)');
    if (p.retrograde && p.planet !== 'Rahu' && p.planet !== 'Ketu') notes.push('Retrograde (intensified/internalised)');

    // Composite (documented): base 5, ±dignity(×1.5), +dig(×2.5), penalties.
    let score = 5 + dignityPoints * 1.5 + dig * 2.5;
    if (p.combust) score -= 1.5;
    score = Math.max(0, Math.min(10, score));

    return {
      planet: p.planet,
      functionalNature: natures[p.planet],
      digBala: Number(dig.toFixed(2)),
      dignityPoints,
      score: Number(score.toFixed(1)),
      band: score >= 6.5 ? 'strong' : score >= 4 ? 'moderate' : 'weak',
      notes,
    };
  });
}

/** What is NOT yet implemented, shown in the UI so nothing is faked. */
export const STRENGTH_LIMITATIONS =
  'This is a documented heuristic combining functional nature, Dig Bala, dignity ' +
  'and combustion, not full classical Ṣaḍbala. Cheṣṭā, Kāla, Naisargika and Dṛk ' +
  'Bala (with exact virūpa values) are pending and are not approximated here.';
