// ─────────────────────────────────────────────────────────────────────────
//  DOSHA ENGINE, language-aware (EN/HI/NE). Computes traditional afflictions
//  honestly and WITHOUT fear: presence, cancellations, gentle interpretation,
//  harmless remedy. No dosha is presented as guaranteeing misfortune.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { STRINGS, type Lang } from '../../i18n/strings';

export interface DoshaResult {
  name: string;
  present: boolean;
  severity?: 'mild' | 'moderate' | 'notable';
  definition: string;
  finding: string;
  cancellation?: string;
  interpretation: string;
  remedy: string;
  disclaimer: string;
}

const HOUSE_OF = (chart: RawChart, id: PlanetId) => chart.planets.find((p) => p.planet === id)!.house;
const pn = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;

const NO_FEAR: Record<Lang, string> = {
  en: 'A dosha describes a tendency to work with, never a fixed fate. It does not guarantee any specific misfortune.',
  hi: 'दोष एक प्रवृत्ति बताता है जिस पर कार्य किया जा सके, कोई निश्चित नियति नहीं। यह किसी विशेष दुर्भाग्य की गारंटी नहीं देता।',
  ne: 'दोषले काम गर्न सकिने प्रवृत्ति बताउँछ, कुनै निश्चित नियति होइन। यसले कुनै विशेष दुर्भाग्यको ग्यारेन्टी दिँदैन।',
};

const D: Record<Lang, Record<string, { name: string; def: string; present: string; absent: string; interp: string; interpAbsent: string; remedy: string; cancel?: string }>> = {
  en: {
    manglik: { name: 'Mangal Dosha (Manglik)', def: 'Mars in the 1st, 2nd, 4th, 7th, 8th or 12th from the Lagna is called Maṅglik, thought to add heat and friction to partnership.', present: 'Mars is in a Maṅglik house.', absent: 'Mars is outside the Maṅglik houses.', interp: 'May indicate a need for patience, maturity and conscious effort in close relationships. Very common and easily worked with.', interpAbsent: 'Not present.', remedy: 'Worship of Hanuman, red-lentil charity on Tuesdays, and Hanuman Chalisa recitation are the classic gentle remedies.', cancel: 'Reduced when both partners are Maṅglik, or Mars is in own/exalted sign or aspected by Jupiter.' },
    kaalsarpa: { name: 'Kaal Sarpa', def: 'When all seven planets fall on one side of the Rāhu–Ketu axis, a concentration of karmic intensity along one line.', present: 'All seven planets lie on one side of the Rāhu–Ketu axis.', absent: 'Planets fall on both sides of the axis, so it is not formed.', interp: 'Can bring an intense, all-or-nothing quality and a sense of delayed timing, often followed by strong results once effort matures.', interpAbsent: 'Not present.', remedy: 'Worship of Lord Shiva, Nāga devotion, and the Mahā-Mṛtyuñjaya mantra.', cancel: 'Greatly softened when planets are strong or the axis falls in favourable houses. Many successful people have it.' },
    grahan: { name: 'Grahan Dosha', def: 'The Sun or Moon conjoined with Rāhu or Ketu, like an eclipse, the luminary’s light partly veiled.', present: 'A luminary is conjoined with a node.', absent: 'Neither luminary is conjoined with a node.', interp: 'May bring an inward, sensitive or unconventional relationship with self-expression (Sun) or emotions (Moon); often depth and intuition alongside the challenge.', interpAbsent: 'Not present.', remedy: 'Sūrya (Sun) or Chandra (Moon) worship and the relevant mantra on its day.' },
    kemadruma: { name: 'Kemadruma Dosha', def: 'The Moon with no planets adjacent (2nd/12th) and none conjoining it is said to lack support.', present: 'The Moon has no adjacent or conjunct planetary support.', absent: 'The Moon is supported by neighbouring/conjunct planets.', interp: 'Can correspond to phases of feeling unsupported, especially early in life; typically eases as the chart’s stronger yogas take over.', interpAbsent: 'Not present.', remedy: 'Strengthen the Moon: Monday fasting, white offerings, and devotion to the Divine Mother.', cancel: 'Cancelled when the Moon is in a kendra from the Lagna, aspected by benefics, or strong in navamsa, cancellation is very common.' },
  },
  hi: {
    manglik: { name: 'मंगल दोष (मांगलिक)', def: 'लग्न से 1, 2, 4, 7, 8 या 12वें भाव में मंगल को मांगलिक कहते हैं, जो साझेदारी में ताप और घर्षण जोड़ता माना जाता है।', present: 'मंगल मांगलिक भाव में है।', absent: 'मंगल मांगलिक भावों के बाहर है।', interp: 'निकट संबंधों में धैर्य, परिपक्वता और सचेत प्रयास की आवश्यकता का संकेत। बहुत सामान्य और सरलता से साधने योग्य।', interpAbsent: 'उपस्थित नहीं।', remedy: 'हनुमान उपासना, मंगलवार को लाल मसूर का दान, और हनुमान चालीसा पाठ, ये शास्त्रीय सौम्य उपाय हैं।', cancel: 'दोनों साथी मांगलिक हों, या मंगल स्वराशि/उच्च का हो या गुरु की दृष्टि हो तो कम।' },
    kaalsarpa: { name: 'काल सर्प', def: 'जब सातों ग्रह राहु–केतु अक्ष के एक ओर हों, एक रेखा पर कार्मिक तीव्रता का संकेंद्रण।', present: 'सातों ग्रह राहु–केतु अक्ष के एक ओर हैं।', absent: 'ग्रह अक्ष के दोनों ओर हैं, अतः नहीं बना।', interp: 'तीव्र, सब-या-कुछ नहीं वाला भाव और विलंबित समय दे सकता है, प्रायः प्रयास परिपक्व होने पर प्रबल फल।', interpAbsent: 'उपस्थित नहीं।', remedy: 'शिव उपासना, नाग-भक्ति, और महामृत्युंजय मंत्र।', cancel: 'ग्रह बली हों या अक्ष शुभ भावों में हो तो बहुत नरम। अनेक सफल व्यक्तियों में यह है।' },
    grahan: { name: 'ग्रहण दोष', def: 'सूर्य या चंद्र का राहु या केतु से युति, ग्रहण जैसा, ज्योति का प्रकाश आंशिक ढका।', present: 'कोई ज्योति नोड से युति में है।', absent: 'कोई भी ज्योति नोड से युति में नहीं।', interp: 'आत्म-अभिव्यक्ति (सूर्य) या भावनाओं (चंद्र) के साथ अंतर्मुखी, संवेदनशील संबंध; प्रायः चुनौती के साथ गहराई और अंतर्ज्ञान।', interpAbsent: 'उपस्थित नहीं।', remedy: 'सूर्य (सूर्य) या चंद्र (चंद्र) उपासना और उसके दिन संबंधित मंत्र।' },
    kemadruma: { name: 'केमद्रुम दोष', def: 'चंद्र के निकट (2रे/12वें) कोई ग्रह न हो और न युति में, तो सहारा-रहित कहा जाता है।', present: 'चंद्र को निकटवर्ती या युति का सहारा नहीं।', absent: 'चंद्र को निकटवर्ती/युति ग्रहों का सहारा है।', interp: 'सहारा-रहित अनुभव के चरणों से मेल, विशेषकर आरंभिक जीवन में; प्रायः चार्ट के प्रबल योगों के सक्रिय होते ही सरल होता है।', interpAbsent: 'उपस्थित नहीं।', remedy: 'चंद्र को बलवान करें: सोमवार व्रत, श्वेत अर्पण, और देवी माँ की भक्ति।', cancel: 'चंद्र लग्न से केंद्र में हो, शुभ दृष्टि हो, या नवांश में बली हो तो भंग, भंग बहुत सामान्य है।' },
  },
  ne: {
    manglik: { name: 'मंगल दोष (मांगलिक)', def: 'लग्नबाट १, २, ४, ७, ८ वा १२औं भावमा मंगललाई मांगलिक भनिन्छ, जसले साझेदारीमा ताप र घर्षण थप्छ भनिन्छ।', present: 'मंगल मांगलिक भावमा छ।', absent: 'मंगल मांगलिक भावभन्दा बाहिर छ।', interp: 'नजिकका सम्बन्धमा धैर्य, परिपक्वता र सचेत प्रयासको आवश्यकताको संकेत। धेरै सामान्य र सजिलै साध्न सकिने।', interpAbsent: 'उपस्थित छैन।', remedy: 'हनुमान उपासना, मंगलबार रातो मसुरको दान, र हनुमान चालीसा पाठ, यी शास्त्रीय सौम्य उपाय हुन्।', cancel: 'दुवै साथी मांगलिक भए, वा मंगल स्वराशि/उच्चको भए वा गुरुको दृष्टि भए कम।' },
    kaalsarpa: { name: 'काल सर्प', def: 'जब सातै ग्रह राहु–केतु अक्षको एकातिर हुन्छन्, एक रेखामा कार्मिक तीव्रताको संकेन्द्रण।', present: 'सातै ग्रह राहु–केतु अक्षको एकातिर छन्।', absent: 'ग्रह अक्षको दुवैतिर छन्, त्यसैले बनेको छैन।', interp: 'तीव्र, सब-या-केही-नभएको भाव र विलम्बित समय दिन सक्छ, प्रायः प्रयास परिपक्व भएपछि प्रबल फल।', interpAbsent: 'उपस्थित छैन।', remedy: 'शिव उपासना, नाग-भक्ति, र महामृत्युंजय मन्त्र।', cancel: 'ग्रह बली भए वा अक्ष शुभ भावमा भए धेरै नरम। धेरै सफल व्यक्तिमा यो छ।' },
    grahan: { name: 'ग्रहण दोष', def: 'सूर्य वा चन्द्रको राहु वा केतुसँग युति, ग्रहणजस्तै, ज्योतिको प्रकाश आंशिक छोपिएको।', present: 'कुनै ज्योति नोडसँग युतिमा छ।', absent: 'कुनै पनि ज्योति नोडसँग युतिमा छैन।', interp: 'आत्म-अभिव्यक्ति (सूर्य) वा भावना (चन्द्र) सँग अन्तर्मुखी, संवेदनशील सम्बन्ध; प्रायः चुनौतीसँगै गहिराइ र अन्तर्ज्ञान।', interpAbsent: 'उपस्थित छैन।', remedy: 'सूर्य (सूर्य) वा चन्द्र (चन्द्र) उपासना र त्यसको दिन सम्बन्धित मन्त्र।' },
    kemadruma: { name: 'केमद्रुम दोष', def: 'चन्द्रको नजिक (२रो/१२औं) कुनै ग्रह नभए र युतिमा पनि नभए, सहारा-रहित भनिन्छ।', present: 'चन्द्रलाई नजिक वा युतिको सहारा छैन।', absent: 'चन्द्रलाई नजिक/युति ग्रहको सहारा छ।', interp: 'सहारा-रहित अनुभवका चरणसँग मेल, विशेषगरी सुरुको जीवनमा; प्रायः चार्टका प्रबल योग सक्रिय भएपछि सजिलो हुन्छ।', interpAbsent: 'उपस्थित छैन।', remedy: 'चन्द्रलाई बलियो बनाउनुहोस्: सोमबार व्रत, सेतो अर्पण, र देवी माताको भक्ति।', cancel: 'चन्द्र लग्नबाट केन्द्रमा भए, शुभ दृष्टि भए, वा नवांशमा बली भए भंग, भंग धेरै सामान्य छ।' },
  },
};

export function detectDoshas(chart: RawChart, lang: Lang = 'en'): DoshaResult[] {
  const T = D[lang];
  const out: DoshaResult[] = [];

  const mh = HOUSE_OF(chart, 'Mars');
  const manglikPresent = [1, 2, 4, 7, 8, 12].includes(mh);
  out.push({ ...pick(T.manglik, manglikPresent, lang), severity: manglikPresent ? (mh === 7 || mh === 8 ? 'notable' : 'moderate') : undefined, cancellation: manglikPresent ? T.manglik.cancel : undefined });

  const rahu = chart.planets.find((p) => p.planet === 'Rahu')!.longitude;
  const ketu = chart.planets.find((p) => p.planet === 'Ketu')!.longitude;
  const seven: PlanetId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const within = (lon: number) => ((lon - rahu + 360) % 360) <= ((ketu - rahu + 360) % 360);
  const ks = seven.every((id) => within(chart.planets.find((p) => p.planet === id)!.longitude)) || seven.every((id) => !within(chart.planets.find((p) => p.planet === id)!.longitude));
  out.push({ ...pick(T.kaalsarpa, ks, lang), severity: ks ? 'moderate' : undefined, cancellation: ks ? T.kaalsarpa.cancel : undefined });

  const s = chart.planets.find((p) => p.planet === 'Sun')!;
  const m = chart.planets.find((p) => p.planet === 'Moon')!;
  const nodes = chart.planets.filter((p) => p.planet === 'Rahu' || p.planet === 'Ketu');
  const withNode = (h: number) => nodes.filter((n) => n.house === h).map((n) => n.planet);
  const parts = [...withNode(s.house).map((x) => `${pn(lang, 'Sun')}+${pn(lang, x)}`), ...withNode(m.house).map((x) => `${pn(lang, 'Moon')}+${pn(lang, x)}`)];
  const grahanPresent = parts.length > 0;
  out.push({ ...pick(T.grahan, grahanPresent, lang), finding: grahanPresent ? parts.join('; ') + '.' : T.grahan.absent, severity: grahanPresent ? 'mild' : undefined });

  const moonHouse = m.house;
  const rel = (h: number) => ((h - moonHouse + 12) % 12) + 1;
  const support = chart.planets.some((p) => ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet) && [2, 12].includes(rel(p.house)))
    || chart.planets.some((p) => p.planet !== 'Moon' && p.planet !== 'Sun' && p.planet !== 'Rahu' && p.planet !== 'Ketu' && p.house === moonHouse);
  const kemaPresent = !support;
  out.push({ ...pick(T.kemadruma, kemaPresent, lang), severity: kemaPresent ? 'moderate' : undefined, cancellation: kemaPresent ? T.kemadruma.cancel : undefined });

  return out;
}

function pick(t: { name: string; def: string; present: string; absent: string; interp: string; interpAbsent: string; remedy: string }, present: boolean, lang: Lang): DoshaResult {
  return { name: t.name, present, definition: t.def, finding: present ? t.present : t.absent, interpretation: present ? t.interp : t.interpAbsent, remedy: t.remedy, disclaimer: NO_FEAR[lang] };
}
