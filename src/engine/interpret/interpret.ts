// ─────────────────────────────────────────────────────────────────────────
//  INTERPRETATION RULES ENGINE, language-aware (EN / HI / NE).
//  Composes each reading from factors (planet nature + house + sign + dignity
//  + strength), building grammatical sentences per language. Returns the
//  transparent format: whatItMeans · why · positive · challenge · whatModifies
//  · timing · remedy · note. Interpretations are traditional, never deterministic.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { computeStrength } from '../strength/strength';
import { REMEDIES } from '../../data/remedies';
import { STRINGS, type Lang } from '../../i18n/strings';
import { PLANET_C, HOUSE_C } from '../../i18n/content';
import { REMEDY_C } from '../../i18n/remedyContent';

export interface Interpretation {
  subject: string;
  whatItMeans: string;
  why: string[];
  positive: string;
  challenge: string;
  whatModifies: string;
  timing: string;
  remedy: string;
  note: string;
}

const nm = (lang: Lang, prefix: string, name: string) =>
  STRINGS[lang][`${prefix}.${name}`] ?? name;

const BAND: Record<Lang, Record<string, string>> = {
  en: { strong: 'strong', moderate: 'moderate', weak: 'weak' },
  hi: { strong: 'प्रबल', moderate: 'मध्यम', weak: 'निर्बल' },
  ne: { strong: 'प्रबल', moderate: 'मध्यम', weak: 'कमजोर' },
};
const NATURE: Record<Lang, Record<string, string>> = {
  en: { benefic: 'benefic', malefic: 'malefic', neutral: 'neutral' },
  hi: { benefic: 'शुभ', malefic: 'पाप', neutral: 'सम' },
  ne: { benefic: 'शुभ', malefic: 'पाप', neutral: 'सम' },
};
const NOTE: Record<Lang, string> = {
  en: 'Traditional Vedic interpretation, not a scientific or deterministic claim. Free will, effort and grace shape how any placement expresses.',
  hi: 'पारंपरिक वैदिक व्याख्या, कोई वैज्ञानिक या सुनिश्चित दावा नहीं। इच्छाशक्ति, प्रयास और कृपा तय करते हैं कि कोई स्थिति कैसे प्रकट होती है।',
  ne: 'परम्परागत वैदिक व्याख्या, कुनै वैज्ञानिक वा निश्चित दाबी होइन। इच्छाशक्ति, प्रयास र कृपाले कुनै स्थिति कसरी प्रकट हुन्छ भन्ने निर्धारण गर्छ।',
};

export function interpretPlanets(chart: RawChart, lang: Lang = 'en'): Interpretation[] {
  const strengths = computeStrength(chart);
  const strengthOf = (id: PlanetId) => strengths.find((s) => s.planet === id)!;

  return chart.planets.map((p) => {
    const c = PLANET_C[lang][p.planet];
    const h = HOUSE_C[lang][p.house];
    const st = strengthOf(p.planet);
    const pName = nm(lang, 'pl', p.planet);
    const sName = nm(lang, 'sn', p.sign);
    const dig = nm(lang, 'dig', digKey(p.dignity));
    const band = BAND[lang][st.band];
    const nature = NATURE[lang][st.functionalNature];
    const weak = st.band === 'weak' || p.dignity === 'debilitated';
    const strong = st.band === 'strong';
    const rem = { mantra: REMEDIES[p.planet].mantra, ...REMEDY_C[lang][p.planet] };
    const H = p.house;

    const why: string[] = [];
    if (lang === 'en') {
      why.push(`${pName} is in ${sName} (house ${H}: ${h.title}).`);
      why.push(`Nakshatra ${p.nakshatra}, pada ${p.pada}.`);
      why.push(`Dignity: ${dig}. Functional role: ${nature}.`);
      why.push(`Strength (heuristic): ${band} (${st.score}/10).`);
      if (p.retrograde && !isNode(p.planet)) why.push('Retrograde, energy intensified and turned inward.');
      if (p.combust) why.push('Combust, close to the Sun, outer expression dimmed.');
    } else if (lang === 'hi') {
      why.push(`${pName} ${sName} में है (भाव ${H}: ${h.title})।`);
      why.push(`नक्षत्र ${p.nakshatra}, पाद ${p.pada}।`);
      why.push(`गरिमा: ${dig}. कार्यात्मक भूमिका: ${nature}।`);
      why.push(`बल (आकलन): ${band} (${st.score}/10)।`);
      if (p.retrograde && !isNode(p.planet)) why.push('वक्री, ऊर्जा तीव्र और अंतर्मुखी।');
      if (p.combust) why.push('अस्त, सूर्य के निकट, बाह्य अभिव्यक्ति मंद।');
    } else {
      why.push(`${pName} ${sName} मा छ (भाव ${H}: ${h.title})।`);
      why.push(`नक्षत्र ${p.nakshatra}, पाद ${p.pada}।`);
      why.push(`गरिमा: ${dig}. कार्यात्मक भूमिका: ${nature}।`);
      why.push(`बल (आकलन): ${band} (${st.score}/10)।`);
      if (p.retrograde && !isNode(p.planet)) why.push('वक्री, ऊर्जा तीव्र र अन्तर्मुखी।');
      if (p.combust) why.push('अस्त, सूर्यको नजिक, बाह्य अभिव्यक्ति मधुरो।');
    }

    let subject: string, whatItMeans: string, positive: string, challenge: string,
        whatModifies: string, timing: string, remedy: string;

    if (lang === 'hi') {
      const degWord = p.dignity === 'debilitated' ? 'नीच' : 'निर्बल';
      subject = `${pName} ${H}वें भाव में (${sName})`;
      whatItMeans = `${c.karaka} यह ऊर्जा आपके ${H}वें भाव (${h.title}: ${h.sig}) में प्रवाहित होती है, ${sName} से रंगी हुई।`;
      positive = strong
        ? `यहाँ सुस्थित: ${c.positive} ये वरदान आपके ${H}वें भाव के विषयों में प्रबलता से प्रकट होते हैं।`
        : `इसकी उच्चतर संभावना: ${c.positive} जिसे ${H}वें भाव के विषयों में विकसित किया जा सकता है।`;
      challenge = weak
        ? `क्योंकि यह यहाँ ${degWord} है, इनसे सावधान रहें: ${c.challenge} यह साध्य है, नियति नहीं।`
        : `जिस छाया के प्रति सजग रहें: ${c.challenge}`;
      whatModifies = `यह फल ग्रह पर पड़ने वाली दृष्टि, उसके स्वामी की स्थिति, उसके बल (अभी ${band}), और उसकी दशा चल रही है या नहीं, इनसे बदलता है।`;
      timing = `इसके विषय ${pName} की महादशा और अंतर्दशा में, और जब गोचर आपके ${H}वें भाव को सक्रिय करते हैं, तब प्रमुख होते हैं।`;
      remedy = `सहायक अभ्यास: ${rem.mantra.transliteration} (${rem.day}); ${rem.deity} की उपासना।`;
    } else if (lang === 'ne') {
      const degWord = p.dignity === 'debilitated' ? 'नीच' : 'कमजोर';
      subject = `${pName} ${H} औं भावमा (${sName})`;
      whatItMeans = `${c.karaka} यो ऊर्जा तपाईंको ${H} औं भाव (${h.title}: ${h.sig}) मा प्रवाहित हुन्छ, ${sName} ले रंगिएको।`;
      positive = strong
        ? `यहाँ सुस्थित: ${c.positive} यी वरदान तपाईंको ${H} औं भावका विषयहरूमा प्रबल रूपमा प्रकट हुन्छन्।`
        : `यसको उच्चतर सम्भावना: ${c.positive} जसलाई ${H} औं भावका विषयहरूमा विकास गर्न सकिन्छ।`;
      challenge = weak
        ? `किनकि यो यहाँ ${degWord} छ, यीबाट सचेत रहनुहोस्: ${c.challenge} यो साध्य छ, नियति होइन।`
        : `सजग रहनुपर्ने छाया: ${c.challenge}`;
      whatModifies = `यो फल ग्रहमाथिको दृष्टि, यसको स्वामीको अवस्था, यसको बल (अहिले ${band}), र यसको दशा चलिरहेको छ कि छैन, यीबाट परिवर्तन हुन्छ।`;
      timing = `यसका विषय ${pName} को महादशा र अन्तर्दशामा, र जब गोचरले तपाईंको ${H} औं भावलाई सक्रिय पार्छ, तब प्रमुख हुन्छन्।`;
      remedy = `सहायक अभ्यास: ${rem.mantra.transliteration} (${rem.day}); ${rem.deity} को उपासना।`;
    } else {
      subject = `${pName} in the ${ordinal(H)} house (${sName})`;
      whatItMeans = `${c.karaka} This energy flows into your ${ordinal(H)} house (${h.title}: ${h.sig}), coloured by ${sName}.`;
      positive = strong
        ? `Well-placed here: ${c.positive} These gifts express strongly through your ${ordinal(H)}-house matters.`
        : `Its higher potential: ${c.positive} available to cultivate through your ${ordinal(H)}-house matters.`;
      challenge = weak
        ? `Because it is ${p.dignity === 'debilitated' ? 'debilitated' : 'weak'} here, watch for: ${c.challenge} This is workable, not fated.`
        : `Shadow to stay aware of: ${c.challenge}`;
      whatModifies = `This result shifts with aspects (dṛṣṭi) on the planet, its dispositor’s condition, its strength (currently ${band}), and whether its daśā is running.`;
      timing = `Its themes come forward during the ${pName} mahā-daśā and antar-daśā, and when transits activate your ${ordinal(H)} house.`;
      remedy = `Supportive practice: ${rem.mantra.transliteration} (${rem.day}s); honour ${rem.deity}.`;
    }

    return { subject, whatItMeans, why, positive, challenge, whatModifies, timing, remedy, note: NOTE[lang] };
  });
}

const isNode = (p: PlanetId) => p === 'Rahu' || p === 'Ketu';
const digKey = (d: string) => d === 'none' ? 'neutral' : d;
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
