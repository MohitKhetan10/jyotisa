// ─────────────────────────────────────────────────────────────────────────
//  HOUSE (Bhāva) INTERPRETATION, language-aware. Builds a detailed reading for
//  each house from the "12 Houses" framework: the bhāva's domain + the sign on
//  it + its lord's placement ("where that area of life has gone") + occupants +
//  its classifications + its core question. Composed per language (EN/HI/NE).
// ─────────────────────────────────────────────────────────────────────────
import type { RawChart, PlanetId } from '../../types/chart';
import { buildHouses, type HouseView } from '../houses/houses';
import { STRINGS, type Lang } from '../../i18n/strings';
import { HOUSE_C } from '../../i18n/content';

const pn = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;
const sn = (lang: Lang, s: string) => STRINGS[lang][`sn.${s}`] ?? s;

// Motto + core question per house, per language.
const MQ: Record<Lang, Record<number, { motto: string; q: string }>> = {
  en: { 1: { motto: 'I AM', q: 'Who am I?' }, 2: { motto: 'I HAVE', q: 'What sustains me?' }, 3: { motto: 'I ACT', q: 'What am I willing to do?' }, 4: { motto: 'I BELONG', q: 'Where do I feel at home?' }, 5: { motto: 'I CREATE', q: 'What comes through me?' }, 6: { motto: 'I STRUGGLE', q: 'What must I overcome?' }, 7: { motto: 'I RELATE', q: 'Who stands opposite me?' }, 8: { motto: 'I TRANSFORM', q: 'What changes me beyond my control?' }, 9: { motto: 'I SEEK', q: 'What gives my life meaning?' }, 10: { motto: 'I ACT IN THE WORLD', q: 'What do I do in the world?' }, 11: { motto: 'I GAIN', q: 'What comes back to me?' }, 12: { motto: 'I RELEASE', q: 'What must I let go?' } },
  hi: { 1: { motto: 'मैं हूँ', q: 'मैं कौन हूँ?' }, 2: { motto: 'मेरे पास है', q: 'क्या मुझे धारण करता है?' }, 3: { motto: 'मैं करता हूँ', q: 'मैं क्या करने को तैयार हूँ?' }, 4: { motto: 'मैं आबद्ध हूँ', q: 'मैं कहाँ घर अनुभव करता हूँ?' }, 5: { motto: 'मैं सृजता हूँ', q: 'मुझसे क्या आता है?' }, 6: { motto: 'मैं संघर्ष करता हूँ', q: 'मुझे किस पर विजय पानी है?' }, 7: { motto: 'मैं संबंध बनाता हूँ', q: 'मेरे सामने कौन खड़ा है?' }, 8: { motto: 'मैं रूपांतरित होता हूँ', q: 'मेरे नियंत्रण से परे क्या मुझे बदलता है?' }, 9: { motto: 'मैं खोजता हूँ', q: 'मेरे जीवन को अर्थ क्या देता है?' }, 10: { motto: 'मैं संसार में कार्य करता हूँ', q: 'मैं संसार में क्या करता हूँ?' }, 11: { motto: 'मुझे प्राप्त होता है', q: 'मेरे पास क्या लौटता है?' }, 12: { motto: 'मैं त्यागता हूँ', q: 'मुझे क्या छोड़ना है?' } },
  ne: { 1: { motto: 'म हुँ', q: 'म को हुँ?' }, 2: { motto: 'मसँग छ', q: 'मलाई केले धान्छ?' }, 3: { motto: 'म गर्छु', q: 'म के गर्न तयार छु?' }, 4: { motto: 'म आबद्ध छु', q: 'म कहाँ घर अनुभव गर्छु?' }, 5: { motto: 'म सृजना गर्छु', q: 'मबाट के आउँछ?' }, 6: { motto: 'म संघर्ष गर्छु', q: 'मैले केमाथि विजय पाउनुपर्छ?' }, 7: { motto: 'म सम्बन्ध बनाउँछु', q: 'मेरो अगाडि को उभिन्छ?' }, 8: { motto: 'म रूपान्तरित हुन्छु', q: 'मेरो नियन्त्रणभन्दा बाहिर केले मलाई बदल्छ?' }, 9: { motto: 'म खोज्छु', q: 'मेरो जीवनलाई अर्थ केले दिन्छ?' }, 10: { motto: 'म संसारमा काम गर्छु', q: 'म संसारमा के गर्छु?' }, 11: { motto: 'मलाई प्राप्त हुन्छ', q: 'ममा के फर्कन्छ?' }, 12: { motto: 'म त्याग्छु', q: 'मैले के त्याग्नुपर्छ?' } },
};

const SIGN_Q: Record<Lang, string[]> = {
  en: ['bold and pioneering', 'steady and resourceful', 'versatile and communicative', 'nurturing and sensitive', 'dignified and expressive', 'analytical and service-minded', 'harmonious and relational', 'intense and transformative', 'expansive and principled', 'disciplined and enduring', 'unconventional and humane', 'compassionate and imaginative'],
  hi: ['साहसी और अग्रणी', 'स्थिर और साधन-संपन्न', 'बहुमुखी और संवादशील', 'पोषक और संवेदनशील', 'गरिमामय और अभिव्यक्तिपूर्ण', 'विश्लेषणात्मक और सेवाभावी', 'सामंजस्यपूर्ण और संबंधपरक', 'तीव्र और परिवर्तनकारी', 'विस्तृत और सिद्धांतनिष्ठ', 'अनुशासित और सहनशील', 'अपरंपरागत और मानवीय', 'करुणामय और कल्पनाशील'],
  ne: ['साहसी र अग्रणी', 'स्थिर र साधनसम्पन्न', 'बहुमुखी र संवादशील', 'पोषक र संवेदनशील', 'गरिमामय र अभिव्यक्तिपूर्ण', 'विश्लेषणात्मक र सेवाभावी', 'सामंजस्यपूर्ण र सम्बन्धपरक', 'तीव्र र परिवर्तनकारी', 'विस्तृत र सिद्धान्तनिष्ठ', 'अनुशासित र सहनशील', 'अपरम्परागत र मानवीय', 'करुणामय र कल्पनाशील'],
};

// Localised classification tags built from the HouseInfo booleans.
function classTags(hv: HouseView, lang: Lang): string[] {
  const i = hv.info;
  const A = {
    en: { kendra: 'Kendra · Angular', panaphara: 'Panaphara · Succedent', apoklima: 'Apoklima · Cadent', trikona: 'Trikoṇa · Trine', upachaya: 'Upachaya · Growth', duhsthana: 'Duḥsthāna · Difficult', ayu: 'Āyu-sthāna · Longevity', maraka: 'Māraka', dharma: 'Dharma · Purpose', artha: 'Artha · Material', kama: 'Kāma · Desire', moksha: 'Mokṣa · Liberation' },
    hi: { kendra: 'केंद्र · कोणीय', panaphara: 'पणफर · उत्तरवर्ती', apoklima: 'आपोक्लिम · पतनशील', trikona: 'त्रिकोण', upachaya: 'उपचय · वृद्धि', duhsthana: 'दुःस्थान · कठिन', ayu: 'आयु-स्थान', maraka: 'मारक', dharma: 'धर्म · उद्देश्य', artha: 'अर्थ · भौतिक', kama: 'काम · इच्छा', moksha: 'मोक्ष · मुक्ति' },
    ne: { kendra: 'केन्द्र · कोणीय', panaphara: 'पणफर · उत्तरवर्ती', apoklima: 'आपोक्लिम · पतनशील', trikona: 'त्रिकोण', upachaya: 'उपचय · वृद्धि', duhsthana: 'दुःस्थान · कठिन', ayu: 'आयु-स्थान', maraka: 'मारक', dharma: 'धर्म · उद्देश्य', artha: 'अर्थ · भौतिक', kama: 'काम · इच्छा', moksha: 'मोक्ष · मुक्ति' },
  }[lang];
  const tags = [A[i.angularity]];
  if (i.trikona) tags.push(A.trikona);
  if (i.upachaya) tags.push(A.upachaya);
  if (i.duhsthana) tags.push(A.duhsthana);
  if (i.ayusthana) tags.push(A.ayu);
  if (i.maraka) tags.push(A.maraka);
  tags.push(A[i.purushartha]);
  return tags;
}

export interface HouseReading {
  house: number;
  title: string; motto: string; question: string;
  sanskrit: string[]; sign: string; lord: string;
  lordInHouse: number | null; occupants: string[];
  classes: string[]; detail: string;
}

export function interpretHouses(chart: RawChart, lang: Lang = 'en'): HouseReading[] {
  const houses = buildHouses(chart);
  return houses.map((hv) => {
    const hc = HOUSE_C[lang][hv.house];
    const lordHouseC = hv.lordInHouse ? HOUSE_C[lang][hv.lordInHouse] : null;
    const quality = SIGN_Q[lang][hv.signIndex];
    const occ = hv.occupants.map((o) => pn(lang, o));
    const lordName = pn(lang, hv.lord);
    const signName = sn(lang, hv.sign);
    const detail = buildDetail(lang, hv, hc, lordHouseC, quality, occ, lordName, signName);
    return {
      house: hv.house, title: hc.title, motto: MQ[lang][hv.house].motto,
      question: MQ[lang][hv.house].q, sanskrit: hv.info.sanskrit, sign: signName,
      lord: lordName, lordInHouse: hv.lordInHouse, occupants: occ,
      classes: classTags(hv, lang), detail,
    };
  });
}

function buildDetail(
  lang: Lang, hv: HouseView, hc: { title: string; sig: string },
  lordHouseC: { title: string; sig: string } | null, quality: string,
  occ: string[], lordName: string, signName: string,
): string {
  const lh = hv.lordInHouse;
  if (lang === 'hi') {
    const occTxt = occ.length ? `${occ.join(', ')} इस भाव में स्थित हैं और इसमें अपनी प्रकृति जोड़ते हैं।` : 'कोई ग्रह इसमें स्थित नहीं, अतः यह मुख्यतः अपने स्वामी और दृष्टियों से कार्य करता है।';
    const lordTxt = lh && lordHouseC ? `इसका स्वामी ${lordName} आपके ${lh}वें भाव में बैठा है, अतः इस भाव के विषय ${lordHouseC.sig} की ओर खिंचते हैं।` : `इसका स्वामी ${lordName} है।`;
    return `${hc.title} ${hc.sig} का प्रतिनिधित्व करता है। यहाँ यह ${signName} में पड़ता है, इस क्षेत्र को ${quality} स्वर देता है। ${lordTxt} ${occTxt}`;
  }
  if (lang === 'ne') {
    const occTxt = occ.length ? `${occ.join(', ')} यस भावमा रहेका छन् र यसमा आफ्नो प्रकृति थप्छन्।` : 'कुनै ग्रह यसमा छैन, त्यसैले यो मुख्यतः आफ्नो स्वामी र दृष्टिबाट काम गर्छ।';
    const lordTxt = lh && lordHouseC ? `यसको स्वामी ${lordName} तपाईंको ${lh} औं भावमा बसेको छ, त्यसैले यस भावका विषय ${lordHouseC.sig} तर्फ तानिन्छन्।` : `यसको स्वामी ${lordName} हो।`;
    return `${hc.title} ले ${hc.sig} को प्रतिनिधित्व गर्छ। यहाँ यो ${signName} मा पर्छ, यस क्षेत्रलाई ${quality} स्वर दिन्छ। ${lordTxt} ${occTxt}`;
  }
  const occTxt = occ.length ? `${occ.join(', ')} occupy this house, adding their nature to it.` : 'No planet occupies it, so it works mainly through its lord and aspects.';
  const lordTxt = lh && lordHouseC ? `Its lord ${lordName} sits in your ${ordinal(lh)} house, so the affairs of this bhāva are drawn toward ${lordHouseC.sig}.` : `Its lord is ${lordName}.`;
  return `${hc.title} governs ${hc.sig}. Here it falls in ${signName}, giving this area a ${quality} tone. ${lordTxt} ${occTxt}`;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export type { PlanetId };
