// ─────────────────────────────────────────────────────────────────────────
//  LIFE INTERPRETATION (language-aware): soul purpose, timing windows, cautions.
//  Timing windows are computed from real Vimśottarī periods. Cautions name
//  difficult patterns honestly, always as tendencies that will and grace shape,
//  never as fixed verdicts. Sentences are composed per language (EN / HI / NE).
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { buildHouses } from '../houses/houses';
import { vimshottari, type DashaPeriod } from '../dasha/vimshottari';
import { STRINGS, type Lang } from '../../i18n/strings';
import { PLANET_C } from '../../i18n/content';

const nm = (lang: Lang, prefix: string, name: string) => STRINGS[lang][`${prefix}.${name}`] ?? name;
const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
const hnum = (lang: Lang, n: number) => lang === 'hi' ? `${n}वें` : lang === 'ne' ? `${n} औं` : ordinalEn(n);
function ordinalEn(n: number) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

// ── Soul purpose ────────────────────────────────────────────────────────────
export interface SoulPurpose { atmakaraka: PlanetId; paragraphs: { heading: string; text: string }[]; }

export function soulPurpose(chart: RawChart, lang: Lang = 'en'): SoulPurpose {
  const seven: PlanetId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const ak = seven.map((id) => chart.planets.find((p) => p.planet === id)!)
    .sort((a, b) => b.degreeInSign - a.degreeInSign)[0];
  const ketu = chart.planets.find((p) => p.planet === 'Ketu')!;
  const rahu = chart.planets.find((p) => p.planet === 'Rahu')!;
  const sun = chart.planets.find((p) => p.planet === 'Sun')!;
  const ninth = buildHouses(chart)[8];

  const P = (id: PlanetId) => nm(lang, 'pl', id);
  const S = (s: string) => nm(lang, 'sn', s);
  const soulTxt = PLANET_C[lang][ak.planet].soul;

  const heads = {
    en: ['The soul’s chief significator (Ātmakāraka)', 'Where the soul is coming from (Ketu)', 'Where the soul is heading (Rahu)', 'Dharma & vitality'],
    hi: ['आत्मा का प्रमुख कारक (आत्मकारक)', 'आत्मा कहाँ से आ रही है (केतु)', 'आत्मा कहाँ जा रही है (राहु)', 'धर्म और ओज'],
    ne: ['आत्माको प्रमुख कारक (आत्मकारक)', 'आत्मा कहाँबाट आउँदैछ (केतु)', 'आत्मा कहाँ जाँदैछ (राहु)', 'धर्म र ओज'],
  }[lang];

  let paras: string[];
  if (lang === 'hi') {
    paras = [
      `${P(ak.planet)} आपकी कुंडली में सबसे अधिक अंश धारण करता है, अतः यह आपका आत्मकारक है, वह ग्रह जो इस जीवन में आत्मा का मुख्य उद्देश्य वहन करता है। ${soulTxt} ${S(ak.sign)} में ${hnum(lang, ak.house)} भाव में स्थित, आपका मूल कार्य उस भाव के विषयों पर केंद्रित है, ${P(ak.planet)} के माध्यम से परिष्कृत। जैसे-जैसे ${P(ak.planet)} आप में परिपक्व होता है, वैसे-वैसे आपकी आत्म-भावना भी।`,
      `${S(ketu.sign)} (${hnum(lang, ketu.house)} भाव), नक्षत्र ${ketu.nakshatra} में केतु दर्शाता है कि आपकी आत्मा ने अतीत में क्या साध लिया है, यह सहज ही आता है और "पूर्ण" सा लगता है। इन ${hnum(lang, ketu.house)}-भाव विषयों के प्रति एक शांत विरक्ति हो सकती है; आत्मा यहाँ पहले भी रह चुकी है।`,
      `${S(rahu.sign)} (${hnum(lang, rahu.house)} भाव) में राहु वह अपरिचित दिशा है जिसकी ओर आपकी आत्मा खिंच रही है। यह विदेशी, भूखा, असहज भी लग सकता है, क्योंकि यही नई वृद्धि है। केतु के आराम की ओर लौटने के बजाय ${hnum(lang, rahu.house)}-भाव की सीखों में झुकना आपके विकास की एक केंद्रीय धुरी है।`,
      `${S(sun.sign)} (${hnum(lang, sun.house)} भाव) में आपका सूर्य आपके व्यक्तित्व का प्रकाश है, जहाँ आप सत्यनिष्ठा से चमकने के लिए हैं। आपका धर्म का 9वाँ भाव ${S(ninth.sign)} है, स्वामी ${P(ninth.lord)}: उच्चतर अर्थ, गुरु और भाग्य उन्हीं विषयों से आते हैं। उद्देश्य यहाँ सूर्य के सत्य, 9वें भाव के धर्म, और राहु की वृद्धि का मिलन है।`,
    ];
  } else if (lang === 'ne') {
    paras = [
      `${P(ak.planet)} तपाईंको कुण्डलीमा सबैभन्दा बढी अंश धारण गर्छ, त्यसैले यो तपाईंको आत्मकारक हो, त्यो ग्रह जसले यस जीवनमा आत्माको मुख्य उद्देश्य बोक्छ। ${soulTxt} ${S(ak.sign)} मा ${hnum(lang, ak.house)} भावमा रहेको, तपाईंको मूल कार्य त्यस भावका विषयहरूमा केन्द्रित छ, ${P(ak.planet)} मार्फत परिष्कृत। ${P(ak.planet)} तपाईंमा परिपक्व हुँदै जाँदा, तपाईंको आत्म-भावना पनि।`,
      `${S(ketu.sign)} (${hnum(lang, ketu.house)} भाव), नक्षत्र ${ketu.nakshatra} मा केतुले देखाउँछ कि तपाईंको आत्माले विगतमा के साधिसकेको छ, यो सहजै आउँछ र "पूरा" जस्तो लाग्छ। यी ${hnum(lang, ketu.house)}-भाव विषयहरूप्रति एक शान्त विरक्ति हुन सक्छ; आत्मा यहाँ पहिले पनि आइसकेको छ।`,
      `${S(rahu.sign)} (${hnum(lang, rahu.house)} भाव) मा राहु त्यो अपरिचित दिशा हो जसतर्फ तपाईंको आत्मा तानिँदैछ। यो विदेशी, भोको, असहज पनि लाग्न सक्छ, किनकि यही नयाँ वृद्धि हो। केतुको आरामतर्फ फर्कनुभन्दा ${hnum(lang, rahu.house)}-भावका सिकाइहरूमा झुक्नु तपाईंको विकासको केन्द्रीय धुरी हो।`,
      `${S(sun.sign)} (${hnum(lang, sun.house)} भाव) मा तपाईंको सूर्य तपाईंको व्यक्तित्वको प्रकाश हो, जहाँ तपाईं इमानदारीका साथ चम्कन हुनुहुन्छ। तपाईंको धर्मको ९ औं भाव ${S(ninth.sign)} हो, स्वामी ${P(ninth.lord)}: उच्चतर अर्थ, गुरु र भाग्य तिनै विषयहरूबाट आउँछन्। उद्देश्य यहाँ सूर्यको सत्य, ९ औं भावको धर्म, र राहुको वृद्धिको मिलन हो।`,
    ];
  } else {
    paras = [
      `${P(ak.planet)} holds the highest degree in your chart, making it your Ātmakāraka, the planet carrying the soul’s deepest agenda this life. ${soulTxt} Placed in ${S(ak.sign)} in the ${hnum(lang, ak.house)} house, your core work centres on the themes of that house, refined through ${P(ak.planet)}. When ${P(ak.planet)} matures in you, so does your sense of self.`,
      `Ketu in ${S(ketu.sign)} (${hnum(lang, ketu.house)} house), nakshatra ${ketu.nakshatra}, marks what your soul already mastered in the past; it comes easily and can feel "done." There may be a quiet detachment around these ${hnum(lang, ketu.house)}-house matters; the soul has been here before.`,
      `Rahu in ${S(rahu.sign)} (${hnum(lang, rahu.house)} house) is the unfamiliar direction your soul is being pulled toward. It can feel foreign, hungry, even uncomfortable, because it is new growth. Leaning into the ${hnum(lang, rahu.house)}-house lessons rather than retreating to Ketu’s comfort is a central axis of your evolution.`,
      `Your Sun in ${S(sun.sign)} (${hnum(lang, sun.house)} house) is the light of your individuality, where you are meant to shine with integrity. Your 9th house of dharma is ${S(ninth.sign)}, ruled by ${P(ninth.lord)}: higher meaning, teachers and fortune reach you through those themes. Purpose here is the meeting of the Sun’s truth, the 9th house’s dharma, and Rahu’s growth.`,
    ];
  }

  return { atmakaraka: ak.planet, paragraphs: heads.map((heading, i) => ({ heading, text: paras[i] })) };
}

// ── Timing windows ──────────────────────────────────────────────────────────
export interface TimingWindow { label: string; from: string; to: string; }
export interface AreaTiming { area: string; significators: PlanetId[]; windows: TimingWindow[]; note: string; }

function upcomingWindows(chart: RawChart, sig: Set<PlanetId>, lang: Lang, limit = 4): TimingWindow[] {
  const now = new Date();
  const periods = vimshottari(chart);
  const out: TimingWindow[] = [];
  for (const maha of periods) {
    for (const antar of maha.children ?? [] as DashaPeriod[]) {
      if (antar.end < now) continue;
      if (sig.has(maha.lord) || sig.has(antar.lord)) {
        out.push({ label: `${nm(lang, 'pl', maha.lord)} / ${nm(lang, 'pl', antar.lord)}`, from: fmt(antar.start), to: fmt(antar.end) });
      }
    }
    if (out.length >= limit * 2) break;
  }
  return out.slice(0, limit);
}

export function lifeTimings(chart: RawChart, lang: Lang = 'en'): AreaTiming[] {
  const houses = buildHouses(chart);
  const lordOf = (h: number) => houses[h - 1].lord;
  const P = (id: PlanetId) => nm(lang, 'pl', id);
  const marriage = new Set<PlanetId>([lordOf(7), 'Venus']);
  const career = new Set<PlanetId>([lordOf(10), 'Saturn', 'Sun']);
  const children = new Set<PlanetId>([lordOf(5), 'Jupiter']);

  const areaName = {
    en: ['Marriage / partnership', 'Career / profession', 'Children / creativity'],
    hi: ['विवाह / साझेदारी', 'करियर / व्यवसाय', 'संतान / सृजन'],
    ne: ['विवाह / साझेदारी', 'करियर / व्यवसाय', 'सन्तान / सृजना'],
  }[lang];

  const notes = lang === 'hi' ? [
    `परंपरागत रूप से विवाह 7वें भाव के स्वामी (${P(lordOf(7))}) या शुक्र की दशा/अंतर्दशा में प्रबल होता है, विशेषकर जब गोचर भी 7वें भाव को सक्रिय करें। ये सहायक अवधियाँ हैं, समय-सीमाएँ नहीं।`,
    `करियर में उन्नति प्रायः 10वें भाव के स्वामी (${P(lordOf(10))}), शनि (कर्म) या सूर्य (यश) की अवधियों में होती है। इन अवधियों में किया गया प्रयास फलदायी होता है।`,
    `5वें भाव के स्वामी (${P(lordOf(5))}) और गुरु (पुत्रकारक) की अवधियाँ परंपरागत रूप से संतान और सृजन से जुड़ी हैं। पूर्ण चित्र के लिए D7 कुंडली भी देखें।`,
  ] : lang === 'ne' ? [
    `परम्परागत रूपमा विवाह ७औं भावको स्वामी (${P(lordOf(7))}) वा शुक्रको दशा/अन्तर्दशामा प्रबल हुन्छ, विशेषगरी जब गोचरले पनि ७औं भावलाई सक्रिय पार्छ। यी सहायक अवधि हुन्, समयसीमा होइन।`,
    `करियरमा उन्नति प्रायः १०औं भावको स्वामी (${P(lordOf(10))}), शनि (कर्म) वा सूर्य (यश) का अवधिमा हुन्छ। यी अवधिमा गरिएको प्रयास फलदायी हुन्छ।`,
    `५औं भावको स्वामी (${P(lordOf(5))}) र गुरु (पुत्रकारक) का अवधि परम्परागत रूपमा सन्तान र सृजनासँग जोडिएका छन्। पूर्ण चित्रका लागि D7 कुण्डली पनि हेर्नुहोस्।`,
  ] : [
    `Traditionally, marriage tends to come forward during the daśā/antardaśā of the 7th lord (${P(lordOf(7))}) or Venus, especially when transits also activate the 7th house. These are supportive windows, not deadlines.`,
    `Career shifts and rises often align with the periods of the 10th lord (${P(lordOf(10))}), Saturn (karma) or the Sun (status). Effort during these windows tends to be well rewarded.`,
    `The 5th lord (${P(lordOf(5))}) and Jupiter (putra-kāraka) periods are traditionally linked with children and creative fruition. The D7 chart should also be read for a fuller picture.`,
  ];

  return [marriage, career, children].map((sig, i) => ({
    area: areaName[i], significators: [...sig], windows: upcomingWindows(chart, sig, lang), note: notes[i],
  }));
}

// ── Cautions ────────────────────────────────────────────────────────────────
export interface Caution { area: string; finding: string; possibility: string; grace: string; }

export function cautions(chart: RawChart, lang: Lang = 'en'): Caution[] {
  const P = (id: PlanetId) => chart.planets.find((p) => p.planet === id)!;
  const pn = (id: PlanetId) => nm(lang, 'pl', id);
  const houses = buildHouses(chart);
  const lordOf = (h: number) => houses[h - 1].lord;
  const houseOf = (id: PlanetId) => P(id).house;
  const out: Caution[] = [];
  const MAL: PlanetId[] = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
  const T = CAUTION_TEXT[lang];

  const in7 = chart.planets.filter((p) => p.house === 7 && MAL.includes(p.planet)).map((p) => p.planet);
  const l7 = houseOf(lordOf(7));
  const venus = P('Venus');
  if (in7.length || [6, 8, 12].includes(l7) || venus.dignity === 'debilitated' || venus.combust) {
    const bits: string[] = [];
    if (in7.length) bits.push(`${in7.map(pn).join(', ')} ${T.in7}`);
    if ([6, 8, 12].includes(l7)) bits.push(`${T.l7a} (${pn(lordOf(7))}) ${T.l7b} (${l7})`);
    if (venus.dignity === 'debilitated') bits.push(T.venusDeb);
    if (venus.combust) bits.push(T.venusComb);
    out.push({ area: T.relArea, finding: bits.join('; ') + '.', possibility: T.relPoss, grace: T.relGrace });
  }

  if (houseOf('Rahu') === 7 || venus.house === houseOf('Rahu') || houseOf(lordOf(7)) === houseOf('Rahu')) {
    const finding = houseOf('Rahu') === 7 ? T.rahu7 : venus.house === houseOf('Rahu') ? T.venusRahu : `${pn(lordOf(7))} ${T.l7Rahu}`;
    out.push({ area: T.fidArea, finding, possibility: T.fidPoss, grace: T.fidGrace });
  }

  const ll = lordOf(1);
  if (P(ll).dignity === 'debilitated' || P(ll).combust) {
    out.push({ area: T.vitArea, finding: `${T.lagnaLord} (${pn(ll)}) ${P(ll).dignity === 'debilitated' ? T.deb : T.comb}.`, possibility: T.vitPoss, grace: T.vitGrace });
  }

  const moon = P('Moon');
  if (moon.dignity === 'debilitated' || chart.planets.some((p) => MAL.includes(p.planet) && p.house === moon.house)) {
    out.push({ area: T.emoArea, finding: moon.dignity === 'debilitated' ? T.moonDeb : T.moonMal, possibility: T.emoPoss, grace: T.emoGrace });
  }

  const mars = P('Mars');
  if ([1, 4, 7, 8, 12].includes(mars.house) && (mars.dignity === 'debilitated' || chart.planets.some((p) => (p.planet === 'Rahu' || p.planet === 'Saturn') && p.house === mars.house))) {
    out.push({ area: T.tempArea, finding: `${pn('Mars')} ${T.marsIn} ${mars.house}`, possibility: T.tempPoss, grace: T.tempGrace });
  }

  return out;
}

const CAUTION_TEXT: Record<Lang, Record<string, string>> = {
  en: {
    in7: 'in the 7th house', l7a: 'the 7th lord', l7b: 'in a difficult house', venusDeb: 'Venus debilitated', venusComb: 'Venus combust',
    relArea: 'Relationships & marriage', relPoss: 'Traditional texts associate this with a need for extra patience, maturity and clear communication in close partnership; early friction, delays, or lessons through relationship. It does not predict divorce or unhappiness.', relGrace: 'Conscious effort, the right timing, and remedies for Venus markedly soften this. Many such charts enjoy deeply loyal, lasting marriages.',
    rahu7: 'Rahu in the 7th house.', venusRahu: 'Venus conjoined Rahu.', l7Rahu: 'with Rahu.',
    fidArea: 'Fidelity & desire', fidPoss: 'Some classical texts link Rahu’s touch on partnership with restlessness or a wandering pull in desire. This is a tendency to be conscious of, present in countless faithful people; it is never a certainty of disloyalty.', fidGrace: 'Loyalty is a daily choice, not a fate written in the stars. Self-awareness, honest communication and devotion turn this into depth rather than instability.',
    vitArea: 'Vitality & self-confidence', lagnaLord: 'The Lagna lord', deb: 'is debilitated', comb: 'is combust', vitPoss: 'May indicate early self-doubt, or a body/identity that takes time to find its full strength.', vitGrace: 'Debilitation is often cancelled and strengthens with age; disciplined self-care builds lasting confidence.',
    emoArea: 'Emotional wellbeing', moonDeb: 'Moon debilitated.', moonMal: 'Moon conjoined a malefic.', emoPoss: 'Traditionally associated with sensitivity and emotional ups and downs, especially earlier in life. This is astrological language, not a medical diagnosis.', emoGrace: 'A supported routine, devotion, and Moon remedies steady the mind. For real distress, please also reach out to a qualified professional.',
    tempArea: 'Temper & impulse', marsIn: 'in house', tempPoss: 'Can incline toward impatience, sharp words, or impulsive action under stress.', tempGrace: 'Channelled into discipline, sport or a cause, this same Mars becomes courage and drive.',
  },
  hi: {
    in7: '7वें भाव में', l7a: '7वें भाव का स्वामी', l7b: 'कठिन भाव में', venusDeb: 'शुक्र नीच', venusComb: 'शुक्र अस्त',
    relArea: 'संबंध और विवाह', relPoss: 'पारंपरिक ग्रंथ इसे निकट संबंध में अधिक धैर्य, परिपक्वता और स्पष्ट संवाद की आवश्यकता से जोड़ते हैं; आरंभिक टकराव, विलंब, या संबंध के माध्यम से सीख। यह तलाक या दुख का पूर्वानुमान नहीं है।', relGrace: 'सचेत प्रयास, उचित समय, और शुक्र के उपाय इसे बहुत नरम कर देते हैं। ऐसी अनेक कुंडलियाँ गहरे निष्ठावान, स्थायी विवाह का सुख पाती हैं।',
    rahu7: '7वें भाव में राहु।', venusRahu: 'शुक्र राहु के साथ।', l7Rahu: 'राहु के साथ।',
    fidArea: 'निष्ठा और इच्छा', fidPoss: 'कुछ शास्त्रीय ग्रंथ राहु के संबंध-स्पर्श को बेचैनी या इच्छा में भटकाव से जोड़ते हैं। यह सजग रहने योग्य प्रवृत्ति है, असंख्य निष्ठावान लोगों में भी उपस्थित; यह कभी बेवफाई की निश्चितता नहीं।', fidGrace: 'निष्ठा एक दैनिक चुनाव है, तारों में लिखी नियति नहीं। आत्म-जागरूकता, ईमानदार संवाद और भक्ति इसे अस्थिरता के बजाय गहराई में बदल देते हैं।',
    vitArea: 'ओज और आत्मविश्वास', lagnaLord: 'लग्नेश', deb: 'नीच है', comb: 'अस्त है', vitPoss: 'आरंभिक आत्म-संदेह, या ऐसा शरीर/पहचान जिसे पूर्ण बल पाने में समय लगता है, का संकेत दे सकता है।', vitGrace: 'नीचता प्रायः भंग हो जाती है और आयु के साथ बल बढ़ता है; अनुशासित आत्म-देखभाल स्थायी आत्मविश्वास बनाती है।',
    emoArea: 'भावनात्मक कल्याण', moonDeb: 'चंद्र नीच।', moonMal: 'चंद्र पाप ग्रह के साथ।', emoPoss: 'परंपरागत रूप से संवेदनशीलता और भावनात्मक उतार-चढ़ाव से जुड़ा, विशेषकर जीवन के आरंभ में। यह ज्योतिषीय भाषा है, चिकित्सीय निदान नहीं।', emoGrace: 'एक सुदृढ़ दिनचर्या, भक्ति, और चंद्र के उपाय मन को स्थिर करते हैं। वास्तविक कष्ट में कृपया किसी योग्य पेशेवर से भी संपर्क करें।',
    tempArea: 'क्रोध और आवेग', marsIn: 'भाव में', tempPoss: 'तनाव में अधीरता, कटु वचन, या आवेगपूर्ण कार्य की ओर झुका सकता है।', tempGrace: 'अनुशासन, खेल या किसी उद्देश्य में लगाने पर यही मंगल साहस और प्रेरणा बन जाता है।',
  },
  ne: {
    in7: '७औं भावमा', l7a: '७औं भावको स्वामी', l7b: 'कठिन भावमा', venusDeb: 'शुक्र नीच', venusComb: 'शुक्र अस्त',
    relArea: 'सम्बन्ध र विवाह', relPoss: 'परम्परागत ग्रन्थहरूले यसलाई नजिकको सम्बन्धमा बढी धैर्य, परिपक्वता र स्पष्ट संवादको आवश्यकतासँग जोड्छन्; सुरुको टकराव, ढिलाइ, वा सम्बन्धमार्फत सिकाइ। यसले सम्बन्धविच्छेद वा दुःखको पूर्वानुमान गर्दैन।', relGrace: 'सचेत प्रयास, उचित समय, र शुक्रका उपायले यसलाई धेरै नरम बनाउँछन्। यस्ता धेरै कुण्डलीले गहिरो निष्ठावान, दिगो विवाहको सुख पाउँछन्।',
    rahu7: '७औं भावमा राहु।', venusRahu: 'शुक्र राहुसँग।', l7Rahu: 'राहुसँग।',
    fidArea: 'निष्ठा र इच्छा', fidPoss: 'केही शास्त्रीय ग्रन्थले राहुको सम्बन्ध-स्पर्शलाई बेचैनी वा इच्छामा भड्कावसँग जोड्छन्। यो सचेत रहनुपर्ने प्रवृत्ति हो, असंख्य निष्ठावान मानिसमा पनि उपस्थित; यो कहिल्यै बेवफाइको निश्चितता होइन।', fidGrace: 'निष्ठा दैनिक छनोट हो, ताराहरूमा लेखिएको नियति होइन। आत्म-जागरूकता, इमानदार संवाद र भक्तिले यसलाई अस्थिरताभन्दा गहिराइमा बदल्छन्।',
    vitArea: 'ओज र आत्मविश्वास', lagnaLord: 'लग्नेश', deb: 'नीच छ', comb: 'अस्त छ', vitPoss: 'सुरुको आत्म-सन्देह, वा पूर्ण बल पाउन समय लाग्ने शरीर/पहिचानको संकेत दिन सक्छ।', vitGrace: 'नीचता प्रायः भंग हुन्छ र उमेरसँगै बल बढ्छ; अनुशासित आत्म-हेरचाहले दिगो आत्मविश्वास बनाउँछ।',
    emoArea: 'भावनात्मक कल्याण', moonDeb: 'चन्द्र नीच।', moonMal: 'चन्द्र पाप ग्रहसँग।', emoPoss: 'परम्परागत रूपमा संवेदनशीलता र भावनात्मक उतारचढावसँग जोडिएको, विशेषगरी जीवनको सुरुमा। यो ज्योतिषीय भाषा हो, चिकित्सकीय निदान होइन।', emoGrace: 'एक सुदृढ दिनचर्या, भक्ति, र चन्द्रका उपायले मन स्थिर पार्छन्। वास्तविक कष्टमा कृपया कुनै योग्य पेशेवरसँग पनि सम्पर्क गर्नुहोस्।',
    tempArea: 'रिस र आवेग', marsIn: 'भावमा', tempPoss: 'तनावमा अधैर्य, कटु वचन, वा आवेगपूर्ण कार्यतर्फ झुकाउन सक्छ।', tempGrace: 'अनुशासन, खेल वा कुनै उद्देश्यमा लगाउँदा यही मंगल साहस र प्रेरणा बन्छ।',
  },
};
