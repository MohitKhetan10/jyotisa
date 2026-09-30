// ─────────────────────────────────────────────────────────────────────────
//  DAŚĀ INTERPRETATION, language-aware (EN/HI/NE).
//  For a period lord it reads the lord's NATAL condition (house, sign, dignity,
//  strength, functional nature) and composes: effects (what the period tends to
//  bring) + actions (what to do for the best outcome). Antardaśā analysis blends
//  the mahā lord and the antar lord. Traditional guidance, never deterministic.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { computeStrength, functionalNatures } from '../strength/strength';
import { REMEDIES } from '../../data/remedies';
import { STRINGS, type Lang } from '../../i18n/strings';
import { PLANET_C, HOUSE_C } from '../../i18n/content';
import { REMEDY_C } from '../../i18n/remedyContent';

export interface DashaReading { effects: string; actions: string; }
export interface AntarReading extends DashaReading { dynamic: string; }

const pn = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;
const noDot = (s: string) => s.replace(/[।.]\s*$/, ''); // strip trailing period for mid-sentence use
const ordEn = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const hnum = (lang: Lang, n: number) => lang === 'hi' ? `${n}वें` : lang === 'ne' ? `${n} औं` : ordEn(n);

interface NatalInfo { house: number; sign: string; dignity: string; band: string; nature: string; }
function natal(chart: RawChart, lord: PlanetId): NatalInfo {
  const p = chart.planets.find((x) => x.planet === lord)!;
  const band = computeStrength(chart).find((s) => s.planet === lord)!.band;
  const nature = functionalNatures(chart.ascendant.signIndex)[lord];
  return { house: p.house, sign: p.sign, dignity: p.dignity, band, nature };
}

const DIGP: Record<Lang, Record<string, string>> = {
  en: { exalted: 'exalted', own: 'in its own sign', debilitated: 'debilitated', none: 'placed' },
  hi: { exalted: 'उच्च', own: 'स्वराशि में', debilitated: 'नीच', none: 'स्थित' },
  ne: { exalted: 'उच्च', own: 'स्वराशिमा', debilitated: 'नीच', none: 'स्थित' },
};
const BANDW: Record<Lang, Record<string, string>> = {
  en: { strong: 'strong', moderate: 'moderate', weak: 'weak' },
  hi: { strong: 'प्रबल', moderate: 'मध्यम', weak: 'निर्बल' },
  ne: { strong: 'प्रबल', moderate: 'मध्यम', weak: 'कमजोर' },
};

// ── Mahādaśā effects + actions ─────────────────────────────────────────────
export function interpretDasha(chart: RawChart, lord: PlanetId, lang: Lang = 'en'): DashaReading {
  const n = natal(chart, lord);
  const c = PLANET_C[lang][lord];
  const hc = HOUSE_C[lang][n.house];
  const rem = { mantra: REMEDIES[lord].mantra, ...REMEDY_C[lang][lord] };
  const P = pn(lang, lord);
  const dig = DIGP[lang][n.dignity === 'none' ? 'none' : n.dignity] ?? DIGP[lang].none;
  const band = BANDW[lang][n.band];
  const favourable = n.dignity === 'exalted' || n.dignity === 'own' || n.band === 'strong';
  const testing = n.dignity === 'debilitated' || n.band === 'weak';

  if (lang === 'hi') {
    const fav = favourable ? 'सहायक और वृद्धिकारक' : testing ? 'परीक्षक किंतु चरित्र-निर्माणकारी' : 'मिश्रित, स्थिर प्रयास को फल देने वाला';
    const nat = n.nature === 'benefic' ? 'आपके लग्न के लिए शुभ होने से इसके अच्छे फल सहज आते हैं।' : n.nature === 'malefic' ? 'कार्यात्मक पाप होने से यह अनुशासन और चुनौती के माध्यम से परिपक्व करता है।' : '';
    return {
      effects: `${P} की महादशा ${noDot(c.karaka)} और आपके जन्म के ${hnum(lang, n.house)} भाव (${hc.sig}) के विषयों को सक्रिय करती है। क्योंकि ${P} यहाँ ${dig} और ${band} है, यह काल प्रायः ${fav} रहता है। ${nat}`,
      actions: `इस काल का सर्वोत्तम पाने के लिए: ${rem.day} को ${rem.mantra.transliteration} का जप करें, ${noDot(rem.charity)}, ${rem.deity} की उपासना करें। अपनी ऊर्जा ${hc.sig} पर केंद्रित करें; ${c.challenge} से सावधान रहें।`,
    };
  }
  if (lang === 'ne') {
    const fav = favourable ? 'सहायक र वृद्धिकारक' : testing ? 'परीक्षक तर चरित्र-निर्माणकारी' : 'मिश्रित, स्थिर प्रयासलाई फल दिने';
    const nat = n.nature === 'benefic' ? 'तपाईंको लग्नका लागि शुभ भएकाले यसका राम्रा फल सहजै आउँछन्।' : n.nature === 'malefic' ? 'कार्यात्मक पाप भएकाले यो अनुशासन र चुनौतीमार्फत परिपक्व बनाउँछ।' : '';
    return {
      effects: `${P} को महादशाले ${noDot(c.karaka)} र तपाईंको जन्मको ${hnum(lang, n.house)} भाव (${hc.sig}) का विषयलाई सक्रिय पार्छ। किनकि ${P} यहाँ ${dig} र ${band} छ, यो काल प्रायः ${fav} रहन्छ। ${nat}`,
      actions: `यो कालको उत्तम पाउन: ${rem.day} मा ${rem.mantra.transliteration} जप गर्नुहोस्, ${noDot(rem.charity)}, ${rem.deity} को उपासना गर्नुहोस्। आफ्नो ऊर्जा ${hc.sig} मा केन्द्रित गर्नुहोस्; ${c.challenge} बाट सचेत रहनुहोस्।`,
    };
  }
  const fav = favourable ? 'supportive and growth-bringing' : testing ? 'testing but character-building' : 'mixed, rewarding steady effort';
  const nat = n.nature === 'benefic' ? 'As a benefic for your Lagna, its good results come more readily.' : n.nature === 'malefic' ? 'As a functional malefic, it works through discipline and challenge that mature you.' : '';
  return {
    effects: `The ${P} mahā-daśā activates ${noDot(c.karaka)} and the affairs of your natal ${hnum(lang, n.house)} house (${hc.sig}). Because ${P} is ${dig} and ${band} here, this period tends to be ${fav}. ${nat}`,
    actions: `To get the best of this period: chant ${rem.mantra.transliteration} on ${rem.day}s, ${noDot(rem.charity)}, honour ${rem.deity}. Focus your energy on ${hc.sig}; stay mindful of ${c.challenge}`,
  };
}

// ── Antardaśā detailed analysis ────────────────────────────────────────────
export function interpretAntar(chart: RawChart, mahaLord: PlanetId, antarLord: PlanetId, lang: Lang = 'en'): AntarReading {
  const base = interpretDasha(chart, antarLord, lang);
  const n = natal(chart, antarLord);
  const M = pn(lang, mahaLord), A = pn(lang, antarLord);
  const same = mahaLord === antarLord;
  const antarGood = n.dignity === 'exalted' || n.dignity === 'own' || n.band === 'strong';
  const hc = HOUSE_C[lang][n.house];
  const c = PLANET_C[lang][antarLord];

  let dynamic: string;
  if (lang === 'hi') {
    dynamic = same
      ? `${M} की महादशा में यही ${A} की अंतर्दशा है, अतः इस समय ${A} के विषय सबसे प्रबल हैं।`
      : `${M} की महादशा के भीतर ${A} की अंतर्दशा उसे रंग देती है। ${A} आपके ${hnum(lang, n.house)} भाव (${hc.sig}) में स्थित है, ${DIGP[lang][n.dignity === 'none' ? 'none' : n.dignity]} और ${BANDW[lang][n.band]}, ${antarGood ? 'अतः यह महादशा को अच्छा सहारा देती है।' : 'अतः यह कुछ घर्षण ला सकती है; धैर्य और उपाय सहायक हैं।'} यह अंतर्दशा विशेषकर ${noDot(c.karaka)} को सामने लाती है।`;
  } else if (lang === 'ne') {
    dynamic = same
      ? `${M} को महादशामा यही ${A} को अन्तर्दशा हो, त्यसैले यस बेला ${A} का विषय सबैभन्दा प्रबल छन्।`
      : `${M} को महादशाभित्र ${A} को अन्तर्दशाले यसलाई रंग दिन्छ। ${A} तपाईंको ${hnum(lang, n.house)} भाव (${hc.sig}) मा स्थित छ, ${DIGP[lang][n.dignity === 'none' ? 'none' : n.dignity]} र ${BANDW[lang][n.band]}, ${antarGood ? 'त्यसैले यसले महादशालाई राम्रो सहारा दिन्छ।' : 'त्यसैले यसले केही घर्षण ल्याउन सक्छ; धैर्य र उपाय सहायक हुन्छन्।'} यो अन्तर्दशाले विशेषगरी ${noDot(c.karaka)} लाई अगाडि ल्याउँछ।`;
  } else {
    dynamic = same
      ? `Within the ${M} mahā-daśā this is ${A}'s own sub-period, so its themes are strongest now.`
      : `Within the ${M} mahā-daśā, the ${A} antardaśā colours it. ${A} sits in your ${hnum(lang, n.house)} house (${hc.sig}), ${DIGP[lang][n.dignity === 'none' ? 'none' : n.dignity]} and ${BANDW[lang][n.band]}, ${antarGood ? 'so it supports the mahā lord well.' : 'so it can bring friction; patience and remedy help.'} This antardaśā especially brings ${noDot(c.karaka)} to the fore.`;
  }
  return { effects: base.effects, actions: base.actions, dynamic };
}
