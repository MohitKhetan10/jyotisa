// Remedy priority engine, instead of dumping every remedy, it selects a focus
// based on the chart: the weakest / most-afflicted functional benefics get
// priority, and each recommendation explains WHY it was chosen.
import type { PlanetId, RawChart } from '../../types/chart';
import type { PlanetStrength } from '../strength/strength';
import { computeStrength } from '../strength/strength';
import { REMEDIES } from '../../data/remedies';
import { STRINGS, type Lang } from '../../i18n/strings';

export interface RemedyPlan {
  primary: { planet: PlanetId; reason: string };
  supporting: { planet: PlanetId; reason: string }[];
  note: string;
}

const RB: Record<Lang, { band: Record<string, string>; benefic: string; deb: string; comb: string; note: string; join: string }> = {
  en: { band: { strong: 'strong', moderate: 'moderate', weak: 'weak' }, benefic: 'a functional benefic for your Lagna', deb: 'debilitated', comb: 'combust', note: 'Focus on the primary remedy first for 40 days before adding others. All remedies here are devotional and harmless. Gemstones are described with cautions and should not be worn without expert guidance.', join: 'is' },
  hi: { band: { strong: 'प्रबल', moderate: 'मध्यम', weak: 'निर्बल' }, benefic: 'आपके लग्न के लिए कार्यात्मक शुभ', deb: 'नीच', comb: 'अस्त', note: 'पहले 40 दिन मुख्य उपाय पर ध्यान दें, फिर अन्य जोड़ें। यहाँ सभी उपाय भक्तिपूर्ण और हानिरहित हैं। रत्न सावधानी के साथ बताए गए हैं और बिना विशेषज्ञ मार्गदर्शन नहीं पहनने चाहिए।', join: 'है:' },
  ne: { band: { strong: 'प्रबल', moderate: 'मध्यम', weak: 'कमजोर' }, benefic: 'तपाईंको लग्नका लागि कार्यात्मक शुभ', deb: 'नीच', comb: 'अस्त', note: 'पहिले ४० दिन मुख्य उपायमा ध्यान दिनुहोस्, त्यसपछि अरू थप्नुहोस्। यहाँ सबै उपाय भक्तिपूर्ण र हानिरहित छन्। रत्न सावधानीका साथ बताइएका छन् र विशेषज्ञ मार्गदर्शनबिना लगाउनु हुँदैन।', join: 'छ:' },
};

const pn = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;

export function prioritizeRemedies(chart: RawChart, lang: Lang = 'en'): RemedyPlan {
  const strengths = computeStrength(chart);
  const R = RB[lang];

  // Candidates: functional benefics that are weak, plus any debilitated/combust.
  const scored = strengths
    .filter((s) => s.planet !== 'Rahu' && s.planet !== 'Ketu')
    .map((s) => {
      let need = 0;
      if (s.band === 'weak') need += 3;
      else if (s.band === 'moderate') need += 1;
      if (s.functionalNature === 'benefic') need += 2; // helping a benefic helps most
      if (s.notes.some((n) => /Debilitated/.test(n))) need += 2;
      if (s.notes.some((n) => /Combust/.test(n))) need += 1;
      return { planet: s.planet, need, s };
    })
    .sort((a, b) => b.need - a.need);

  const top = scored[0];
  const supporting = scored.slice(1, 3).filter((c) => c.need > 0);

  const reasonFor = (c: { planet: PlanetId; s: PlanetStrength }) => {
    const bits = [`${pn(lang, c.planet)} ${R.join} ${R.band[c.s.band]}`];
    if (c.s.functionalNature === 'benefic') bits.push(R.benefic);
    if (c.s.notes.some((n) => /Debilitated/.test(n))) bits.push(R.deb);
    if (c.s.notes.some((n) => /Combust/.test(n))) bits.push(R.comb);
    return bits.join(', ') + '.';
  };

  return {
    primary: { planet: top.planet, reason: reasonFor(top) },
    supporting: supporting.map((c) => ({ planet: c.planet, reason: reasonFor(c) })),
    note: R.note,
  };
}

export { REMEDIES };
