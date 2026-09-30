// House engine, assembles the 12 bhāvas for a specific chart. Consumes only a
// RawChart (never the ephemeris). Realises the deck's rule that a bhāva is read
// through four things at once: the house, its sign, its lord, and its occupants.
import type { PlanetId, RawChart, SignId } from '../../types/chart';
import { SIGNS } from '../zodiac/zodiac';
import { signLordOf } from '../../data/dignities';
import { HOUSES, houseClasses, type HouseInfo } from '../../data/houses';

export interface HouseView {
  info: HouseInfo;
  house: number; // 1-12
  sign: SignId;
  signIndex: number;
  /** Bhāveśa, the planet ruling this house's sign. */
  lord: PlanetId;
  /** Where the lord sits, "where has that area of life gone?" (house 1-12). */
  lordInHouse: number | null;
  lordInSign: SignId | null;
  /** Grahas occupying this house. */
  occupants: PlanetId[];
  classes: string[];
}

export function buildHouses(chart: RawChart): HouseView[] {
  const asc = chart.ascendant.signIndex;
  return HOUSES.map((info) => {
    const signIndex = (asc + info.house - 1) % 12;
    const lord = signLordOf(signIndex);
    const lordPos = chart.planets.find((p) => p.planet === lord) ?? null;
    const occupants = chart.planets
      .filter((p) => p.house === info.house)
      .map((p) => p.planet);
    return {
      info,
      house: info.house,
      sign: SIGNS[signIndex],
      signIndex,
      lord,
      lordInHouse: lordPos ? lordPos.house : null,
      lordInSign: lordPos ? lordPos.sign : null,
      occupants,
      classes: houseClasses(info.house),
    };
  });
}
