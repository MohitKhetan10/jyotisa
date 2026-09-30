// ─────────────────────────────────────────────────────────────────────────
//  TRANSIT (Gochara) ENGINE, where the planets are now, judged against the
//  natal Moon (the classical reference for gochara). Includes Sade Sati,
//  Aṣṭama Śani, and Jupiter/Saturn transit houses from the Moon. Uses the same
//  Swiss Ephemeris layer for the current moment, nothing is approximated.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart, SignId } from '../../types/chart';
import { SIGNS } from '../zodiac/zodiac';
import { computeChart } from '../ephemeris/swiss';
import type { Lang } from '../../i18n/strings';

function sadeNote(lang: Lang, phase: 'rising' | 'peak' | 'setting' | null, houseFromMoon: number): string {
  if (!phase) return {
    en: 'Saturn is not currently in the 12th, 1st or 2nd from your natal Moon, so Sade Sati is not active.',
    hi: 'शनि इस समय आपके जन्म-चंद्र से 12वें, 1ले या 2रे में नहीं है, अतः साढ़ेसाती सक्रिय नहीं।',
    ne: 'शनि यस बेला तपाईंको जन्म-चन्द्रबाट १२औं, १लो वा २रो मा छैन, त्यसैले साढेसाती सक्रिय छैन।',
  }[lang];
  const ord = { en: houseFromMoon === 12 ? '12th' : houseFromMoon === 1 ? '1st' : '2nd', hi: houseFromMoon === 12 ? '12वें' : houseFromMoon === 1 ? '1ले' : '2रे', ne: houseFromMoon === 12 ? '१२औं' : houseFromMoon === 1 ? '१लो' : '२रो' }[lang];
  const ph = { en: { rising: 'rising', peak: 'peak', setting: 'setting' }, hi: { rising: 'आरोही', peak: 'शिखर', setting: 'अवरोही' }, ne: { rising: 'आरोही', peak: 'शिखर', setting: 'अवरोही' } }[lang][phase];
  return {
    en: `Saturn is transiting the ${ord} from your Moon, the ${ph} phase of Sade Sati. A period of maturing responsibility and slowing down; traditionally demanding but character-building. It is a phase, not a punishment.`,
    hi: `शनि आपके चंद्र से ${ord} में गोचर कर रहा है, साढ़ेसाती का ${ph} चरण। परिपक्व होते उत्तरदायित्व और धीमे पड़ने का काल; परंपरागत रूप से कठिन किंतु चरित्र-निर्माणकारी। यह एक चरण है, दंड नहीं।`,
    ne: `शनि तपाईंको चन्द्रबाट ${ord} मा गोचर गर्दैछ, साढेसातीको ${ph} चरण। परिपक्व हुँदै गएको उत्तरदायित्व र सुस्ताउने काल; परम्परागत रूपमा कठिन तर चरित्र-निर्माणकारी। यो एक चरण हो, दण्ड होइन।`,
  }[lang];
}

export interface TransitPlanet {
  planet: PlanetId;
  sign: SignId;
  signIndex: number;
  retrograde: boolean;
  houseFromMoon: number; // 1-12 from natal Moon sign
}

export interface SadeSati {
  active: boolean;
  phase: 'rising' | 'peak' | 'setting' | null; // 12th, 1st, 2nd from Moon
  note: string;
}

export interface TransitReport {
  at: Date;
  moonSign: SignId;
  planets: TransitPlanet[];
  sadeSati: SadeSati;
  ashtamaShani: boolean; // Saturn in 8th from Moon
  jupiterHouseFromMoon: number;
  saturnHouseFromMoon: number;
}

/** Compute current transits for a natal chart. Location affects little for
 *  sign-based gochara; natal coordinates are used for consistency. */
export async function computeTransits(
  natal: RawChart, natalLat: number, natalLon: number, at: Date = new Date(),
  lang: Lang = 'en',
): Promise<TransitReport> {
  const now = await computeChart({
    name: 'transit',
    year: at.getUTCFullYear(), month: at.getUTCMonth() + 1, day: at.getUTCDate(),
    hour: at.getUTCHours(), minute: at.getUTCMinutes(), timeKnown: true,
    place: 'now', lat: natalLat, lon: natalLon, tzOffset: 0,
  }, natal.settings);

  const moonSignIndex = natal.planets.find((p) => p.planet === 'Moon')!.signIndex;
  const fromMoon = (signIndex: number) => ((signIndex - moonSignIndex + 12) % 12) + 1;

  const planets: TransitPlanet[] = now.planets.map((p) => ({
    planet: p.planet, sign: p.sign, signIndex: p.signIndex,
    retrograde: p.retrograde, houseFromMoon: fromMoon(p.signIndex),
  }));

  const saturn = planets.find((p) => p.planet === 'Saturn')!;
  const jupiter = planets.find((p) => p.planet === 'Jupiter')!;

  const sadePhase: SadeSati['phase'] =
    saturn.houseFromMoon === 12 ? 'rising'
    : saturn.houseFromMoon === 1 ? 'peak'
    : saturn.houseFromMoon === 2 ? 'setting' : null;

  return {
    at,
    moonSign: SIGNS[moonSignIndex],
    planets,
    sadeSati: {
      active: sadePhase !== null,
      phase: sadePhase,
      note: sadeNote(lang, sadePhase, saturn.houseFromMoon),
    },
    ashtamaShani: saturn.houseFromMoon === 8,
    jupiterHouseFromMoon: jupiter.houseFromMoon,
    saturnHouseFromMoon: saturn.houseFromMoon,
  };
}
