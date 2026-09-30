// ─────────────────────────────────────────────────────────────────────────
//  YOGA ENGINE, language-aware (EN/HI/NE). Rules-based detection; each hit
//  reports WHY it fired, a strength note, the traditional effect, and what can
//  modify the result. Conditions are checked against the computed chart.
// ─────────────────────────────────────────────────────────────────────────
import type { PlanetId, RawChart } from '../../types/chart';
import { buildHouses } from '../houses/houses';
import { signLordOf } from '../../data/dignities';
import { STRINGS, type Lang } from '../../i18n/strings';

export interface YogaHit {
  name: string;
  sanskrit?: string;
  category: 'raja' | 'dhana' | 'mahapurusha' | 'lunar' | 'viparita' | 'exchange' | 'other';
  why: string;
  strength: 'strong' | 'moderate' | 'note';
  effect: string;
  canModify: string;
}

const KENDRA = [1, 4, 7, 10];
const TRIKONA = [1, 5, 9];
const OWN: Record<PlanetId, number[]> = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [], Ketu: [] };
const EXALT: Partial<Record<PlanetId, number>> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
const MAHAPURUSHA: Partial<Record<PlanetId, string>> = { Mars: 'Ruchaka', Mercury: 'Bhadra', Jupiter: 'Hamsa', Venus: 'Malavya', Saturn: 'Sasa' };

const pn = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;
const sn = (lang: Lang, s: string) => STRINGS[lang][`sn.${s}`] ?? s;

// Fixed effect / canModify text per yoga type, per language.
const YT: Record<Lang, Record<string, { effect: string; canModify: string }>> = {
  en: {
    mahapurusha: { effect: 'One of the five Pañca Mahāpuruṣa yogas, conferring prominence, strength of character and success in this planet’s domain.', canModify: 'Affliction by malefics or combustion tempers the result.' },
    gajakesari: { effect: 'Intelligence, respect, lasting reputation and the support of good people.', canModify: 'Stronger when Jupiter and Moon are unafflicted; weak if either is debilitated or combust.' },
    budhaditya: { effect: 'Sharp intelligence, learning, communication skill and administrative capacity.', canModify: 'Best when Mercury is not deeply combust (too close to the Sun).' },
    chandramangala: { effect: 'Drive to earn, resourcefulness and financial enterprise.', canModify: 'Manage emotional volatility; benefic aspects steady it.' },
    raja: { effect: 'A combination for status, authority and rise in life, the union of power (kendra) and grace (trikoṇa).', canModify: 'Its fruit unfolds in the daśā of the involved planets; affliction reduces it.' },
    viparita: { effect: 'Unexpected rise through adversity, difficulties turn to advantage, especially in their daśā.', canModify: 'Works best when the duḥsthāna lords relate only to each other.' },
    parivartana: { effect: 'The two houses and planets become strongly linked, blending their significations.', canModify: 'Benefic between good houses; challenging when a duḥsthāna is involved.' },
    sunapha: { effect: 'Supports the Moon, giving self-earned wealth, intelligence and good standing.', canModify: 'Depends on the supporting planets’ dignity.' },
    anapha: { effect: 'Supports the Moon, giving good health, character and a pleasant nature.', canModify: 'Depends on the supporting planets’ dignity.' },
    durudhura: { effect: 'Supports the Moon on both sides, giving wealth, comforts and generosity.', canModify: 'Depends on the supporting planets’ dignity.' },
    kemadruma: { effect: 'Traditionally linked with phases of struggle or isolation; the Moon lacks support.', canModify: 'Cancelled when the Moon is in a kendra from the Lagna, aspected by benefics, or strong in navamsa. Very often cancelled, do not read it as doom.' },
  },
  hi: {
    mahapurusha: { effect: 'पंच महापुरुष योगों में से एक, इस ग्रह के क्षेत्र में प्रमुखता, चरित्र-बल और सफलता देता है।', canModify: 'पाप ग्रहों की दृष्टि या अस्त होने से फल कम होता है।' },
    gajakesari: { effect: 'बुद्धि, सम्मान, स्थायी कीर्ति और सज्जनों का सहयोग।', canModify: 'गुरु और चंद्र अनाहत हों तो प्रबल; कोई नीच या अस्त हो तो निर्बल।' },
    budhaditya: { effect: 'तीव्र बुद्धि, विद्या, संचार-कौशल और प्रशासनिक क्षमता।', canModify: 'बुध अत्यधिक अस्त (सूर्य के बहुत निकट) न हो तो श्रेष्ठ।' },
    chandramangala: { effect: 'अर्जन की प्रेरणा, साधन-संपन्नता और आर्थिक उद्यम।', canModify: 'भावनात्मक अस्थिरता संभालें; शुभ दृष्टि इसे स्थिर करती है।' },
    raja: { effect: 'स्थिति, अधिकार और उन्नति का योग, शक्ति (केंद्र) और कृपा (त्रिकोण) का मिलन।', canModify: 'इसका फल संबंधित ग्रहों की दशा में खुलता है; पीड़ा से घटता है।' },
    viparita: { effect: 'प्रतिकूलता से अप्रत्याशित उन्नति, कठिनाइयाँ लाभ में बदलती हैं, विशेषकर उनकी दशा में।', canModify: 'दुःस्थान-स्वामी केवल आपस में संबंधित हों तो श्रेष्ठ।' },
    parivartana: { effect: 'दोनों भाव और ग्रह प्रबलता से जुड़ते हैं, अपने अर्थ मिलाते हैं।', canModify: 'शुभ भावों के बीच शुभ; दुःस्थान शामिल हो तो चुनौतीपूर्ण।' },
    sunapha: { effect: 'चंद्र को सहारा, स्व-अर्जित धन, बुद्धि और प्रतिष्ठा।', canModify: 'सहायक ग्रहों की गरिमा पर निर्भर।' },
    anapha: { effect: 'चंद्र को सहारा, अच्छा स्वास्थ्य, चरित्र और सुखद स्वभाव।', canModify: 'सहायक ग्रहों की गरिमा पर निर्भर।' },
    durudhura: { effect: 'चंद्र को दोनों ओर सहारा, धन, सुख और उदारता।', canModify: 'सहायक ग्रहों की गरिमा पर निर्भर।' },
    kemadruma: { effect: 'परंपरागत रूप से संघर्ष या एकाकीपन के चरणों से जुड़ा; चंद्र को सहारा नहीं।', canModify: 'चंद्र लग्न से केंद्र में हो, शुभ दृष्टि हो, या नवांश में बली हो तो भंग। प्रायः भंग हो जाता है, इसे विनाश न समझें।' },
  },
  ne: {
    mahapurusha: { effect: 'पञ्च महापुरुष योगमध्ये एक, यस ग्रहको क्षेत्रमा प्रमुखता, चरित्र-बल र सफलता दिन्छ।', canModify: 'पाप ग्रहको दृष्टि वा अस्त हुँदा फल घट्छ।' },
    gajakesari: { effect: 'बुद्धि, सम्मान, दिगो कीर्ति र सज्जनको सहयोग।', canModify: 'गुरु र चन्द्र अनाहत भए प्रबल; कुनै नीच वा अस्त भए कमजोर।' },
    budhaditya: { effect: 'तीव्र बुद्धि, विद्या, सञ्चार-कौशल र प्रशासनिक क्षमता।', canModify: 'बुध अत्यधिक अस्त (सूर्यको धेरै नजिक) नभए उत्तम।' },
    chandramangala: { effect: 'आर्जनको प्रेरणा, साधनसम्पन्नता र आर्थिक उद्यम।', canModify: 'भावनात्मक अस्थिरता सम्हाल्नुहोस्; शुभ दृष्टिले स्थिर पार्छ।' },
    raja: { effect: 'स्थिति, अधिकार र उन्नतिको योग, शक्ति (केन्द्र) र कृपा (त्रिकोण) को मिलन।', canModify: 'यसको फल सम्बन्धित ग्रहका दशामा खुल्छ; पीडाले घट्छ।' },
    viparita: { effect: 'प्रतिकूलताबाट अप्रत्याशित उन्नति, कठिनाइ लाभमा बदलिन्छन्, विशेषगरी तिनको दशामा।', canModify: 'दुःस्थान-स्वामी आपसमै सम्बन्धित भए उत्तम।' },
    parivartana: { effect: 'दुवै भाव र ग्रह प्रबल रूपमा जोडिन्छन्, आफ्ना अर्थ मिसाउँछन्।', canModify: 'शुभ भावबीच शुभ; दुःस्थान समावेश भए चुनौतीपूर्ण।' },
    sunapha: { effect: 'चन्द्रलाई सहारा, स्व-आर्जित धन, बुद्धि र प्रतिष्ठा।', canModify: 'सहायक ग्रहको गरिमामा निर्भर।' },
    anapha: { effect: 'चन्द्रलाई सहारा, राम्रो स्वास्थ्य, चरित्र र सुखद स्वभाव।', canModify: 'सहायक ग्रहको गरिमामा निर्भर।' },
    durudhura: { effect: 'चन्द्रलाई दुवैतिर सहारा, धन, सुख र उदारता।', canModify: 'सहायक ग्रहको गरिमामा निर्भर।' },
    kemadruma: { effect: 'परम्परागत रूपमा संघर्ष वा एक्लोपनका चरणसँग जोडिएको; चन्द्रलाई सहारा छैन।', canModify: 'चन्द्र लग्नबाट केन्द्रमा भए, शुभ दृष्टि भए, वा नवांशमा बली भए भंग। प्रायः भंग हुन्छ, यसलाई विनाश नठान्नुहोस्।' },
  },
};

// "why" sentence per type, composed per language.
function whyText(lang: Lang, type: string, d: Record<string, string | number>): string {
  const W = {
    en: {
      mahapurusha: `${d.p} is ${d.dig} in ${d.sign} in kendra house ${d.h}.`,
      gajakesari: `Jupiter is in a kendra (${d.rel}th) from the Moon.`,
      budhaditya: `Sun and Mercury share ${d.sign} (house ${d.h}).`,
      chandramangala: `Moon and Mars are together in ${d.sign}.`,
      raja: `Kendra lord ${d.k} and trikoṇa lord ${d.t} are together in house ${d.h}.`,
      viparita: `Lord of the ${d.h}th (${d.p}) is placed in a duḥsthāna (house ${d.h2}).`,
      parivartana: `${d.a} and ${d.b} occupy each other’s signs (mutual exchange).`,
      lunar: `Planet(s) other than the Sun occupy the ${d.where} from the Moon.`,
      kemadruma: `No planets (other than Sun/nodes) occupy the 2nd or 12th from the Moon, nor conjoin it.`,
    },
    hi: {
      mahapurusha: `${d.p} केंद्र भाव ${d.h} में ${d.sign} में ${d.dig} है।`,
      gajakesari: `गुरु चंद्र से केंद्र (${d.rel}वें) में है।`,
      budhaditya: `सूर्य और बुध ${d.sign} (भाव ${d.h}) में साथ हैं।`,
      chandramangala: `चंद्र और मंगल ${d.sign} में साथ हैं।`,
      raja: `केंद्रेश ${d.k} और त्रिकोणेश ${d.t} भाव ${d.h} में साथ हैं।`,
      viparita: `${d.h}वें का स्वामी (${d.p}) दुःस्थान (भाव ${d.h2}) में है।`,
      parivartana: `${d.a} और ${d.b} एक-दूसरे की राशियों में हैं (परस्पर परिवर्तन)।`,
      lunar: `सूर्य के अतिरिक्त ग्रह चंद्र से ${d.where} में स्थित हैं।`,
      kemadruma: `सूर्य/राहु-केतु के अतिरिक्त कोई ग्रह चंद्र से 2रे या 12वें में नहीं, न ही युति में।`,
    },
    ne: {
      mahapurusha: `${d.p} केन्द्र भाव ${d.h} मा ${d.sign} मा ${d.dig} छ।`,
      gajakesari: `गुरु चन्द्रबाट केन्द्र (${d.rel} औं) मा छ।`,
      budhaditya: `सूर्य र बुध ${d.sign} (भाव ${d.h}) मा सँगै छन्।`,
      chandramangala: `चन्द्र र मंगल ${d.sign} मा सँगै छन्।`,
      raja: `केन्द्रेश ${d.k} र त्रिकोणेश ${d.t} भाव ${d.h} मा सँगै छन्।`,
      viparita: `${d.h}औं को स्वामी (${d.p}) दुःस्थान (भाव ${d.h2}) मा छ।`,
      parivartana: `${d.a} र ${d.b} एकअर्काका राशिमा छन् (परस्पर परिवर्तन)।`,
      lunar: `सूर्यबाहेकका ग्रह चन्द्रबाट ${d.where} मा छन्।`,
      kemadruma: `सूर्य/राहु-केतुबाहेक कुनै ग्रह चन्द्रबाट २रो वा १२औं मा छैन, न त युतिमा।`,
    },
  }[lang] as Record<string, string>;
  return W[type];
}

const DIGW: Record<Lang, { exalted: string; own: string }> = {
  en: { exalted: 'exalted', own: 'in own sign' }, hi: { exalted: 'उच्च', own: 'स्वराशि में' }, ne: { exalted: 'उच्च', own: 'स्वराशिमा' },
};

export function detectYogas(chart: RawChart, lang: Lang = 'en'): YogaHit[] {
  const hits: YogaHit[] = [];
  const P = (id: PlanetId) => chart.planets.find((p) => p.planet === id)!;
  const houses = buildHouses(chart);
  const houseOf = (id: PlanetId) => P(id).house;
  const sameSign = (a: PlanetId, b: PlanetId) => P(a).signIndex === P(b).signIndex;
  const fromHouse = (base: number, target: number) => ((target - base + 12) % 12) + 1;
  const lordOfHouse = (h: number): PlanetId => houses[h - 1].lord;
  const yt = YT[lang];
  const nameOf: Record<Lang, Record<string, string>> = {
    en: { gajakesari: 'Gaja-Kesari Yoga', budhaditya: 'Budha-Aditya Yoga', chandramangala: 'Chandra-Mangala Yoga', raja: 'Raja Yoga', viparita: 'Viparita Raja Yoga', parivartana: 'Parivartana Yoga', sunapha: 'Sunapha Yoga', anapha: 'Anapha Yoga', durudhura: 'Durudhura Yoga', kemadruma: 'Kemadruma Yoga' },
    hi: { gajakesari: 'गजकेसरी योग', budhaditya: 'बुधादित्य योग', chandramangala: 'चंद्र-मंगल योग', raja: 'राज योग', viparita: 'विपरीत राज योग', parivartana: 'परिवर्तन योग', sunapha: 'सुनफा योग', anapha: 'अनफा योग', durudhura: 'दुरुधरा योग', kemadruma: 'केमद्रुम योग' },
    ne: { gajakesari: 'गजकेसरी योग', budhaditya: 'बुधादित्य योग', chandramangala: 'चन्द्र-मंगल योग', raja: 'राज योग', viparita: 'विपरीत राज योग', parivartana: 'परिवर्तन योग', sunapha: 'सुनफा योग', anapha: 'अनफा योग', durudhura: 'दुरुधरा योग', kemadruma: 'केमद्रुम योग' },
  };
  const nm = nameOf[lang];

  // Pañca Mahāpuruṣa
  (['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as PlanetId[]).forEach((pl) => {
    const p = P(pl);
    if ((OWN[pl].includes(p.signIndex) || EXALT[pl] === p.signIndex) && KENDRA.includes(p.house)) {
      hits.push({
        name: `${MAHAPURUSHA[pl]} Yoga`, sanskrit: MAHAPURUSHA[pl], category: 'mahapurusha',
        why: whyText(lang, 'mahapurusha', { p: pn(lang, pl), dig: EXALT[pl] === p.signIndex ? DIGW[lang].exalted : DIGW[lang].own, sign: sn(lang, p.sign), h: p.house }),
        strength: 'strong', effect: yt.mahapurusha.effect, canModify: yt.mahapurusha.canModify,
      });
    }
  });

  if (KENDRA.includes(fromHouse(houseOf('Moon'), houseOf('Jupiter')))) {
    hits.push({ name: nm.gajakesari, sanskrit: 'Gaja-Kesarī', category: 'lunar', why: whyText(lang, 'gajakesari', { rel: fromHouse(houseOf('Moon'), houseOf('Jupiter')) }), strength: 'moderate', ...yt.gajakesari });
  }
  if (sameSign('Sun', 'Mercury')) {
    hits.push({ name: nm.budhaditya, sanskrit: 'Budhāditya', category: 'other', why: whyText(lang, 'budhaditya', { sign: sn(lang, P('Sun').sign), h: houseOf('Sun') }), strength: P('Mercury').combust ? 'note' : 'moderate', ...yt.budhaditya });
  }
  if (sameSign('Moon', 'Mars')) {
    hits.push({ name: nm.chandramangala, sanskrit: 'Candra-Maṅgala', category: 'dhana', why: whyText(lang, 'chandramangala', { sign: sn(lang, P('Moon').sign) }), strength: 'moderate', ...yt.chandramangala });
  }

  const around = (rel: number) => (['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as PlanetId[]).some((pl) => fromHouse(houseOf('Moon'), houseOf(pl)) === rel);
  const in2 = around(2), in12 = around(12);
  const whereWord = { en: { a: '2nd', b: '12th', c: '2nd & 12th' }, hi: { a: '2रे', b: '12वें', c: '2रे और 12वें' }, ne: { a: '२रो', b: '१२औं', c: '२रो र १२औं' } }[lang];
  if (in2 && !in12) hits.push({ name: nm.sunapha, sanskrit: 'Sunāphā', category: 'lunar', why: whyText(lang, 'lunar', { where: whereWord.a }), strength: 'moderate', ...yt.sunapha });
  if (in12 && !in2) hits.push({ name: nm.anapha, sanskrit: 'Anāphā', category: 'lunar', why: whyText(lang, 'lunar', { where: whereWord.b }), strength: 'moderate', ...yt.anapha });
  if (in2 && in12) hits.push({ name: nm.durudhura, sanskrit: 'Durudhurā', category: 'lunar', why: whyText(lang, 'lunar', { where: whereWord.c }), strength: 'moderate', ...yt.durudhura });
  if (!in2 && !in12 && !hasConjunctionWithMoon(chart)) {
    hits.push({ name: nm.kemadruma, sanskrit: 'Kemadruma', category: 'lunar', why: whyText(lang, 'kemadruma', {}), strength: 'note', ...yt.kemadruma });
  }

  // Rāja yoga
  const kendraLords = new Set(KENDRA.map(lordOfHouse));
  const trikonaLords = new Set(TRIKONA.map(lordOfHouse));
  for (let h = 1; h <= 12; h++) {
    const occ = chart.planets.filter((p) => p.house === h).map((p) => p.planet);
    const k = occ.find((p) => kendraLords.has(p));
    const t = occ.find((p) => trikonaLords.has(p) && p !== k);
    if (k && t) hits.push({ name: nm.raja, sanskrit: 'Rāja', category: 'raja', why: whyText(lang, 'raja', { k: pn(lang, k), t: pn(lang, t), h }), strength: 'strong', ...yt.raja });
  }

  // Viparīta Rāja yoga
  [6, 8, 12].forEach((h) => {
    const lord = lordOfHouse(h);
    if ([6, 8, 12].includes(houseOf(lord))) hits.push({ name: nm.viparita, sanskrit: 'Viparīta Rāja', category: 'viparita', why: whyText(lang, 'viparita', { h, p: pn(lang, lord), h2: houseOf(lord) }), strength: 'moderate', ...yt.viparita });
  });

  // Parivartana
  const seen = new Set<string>();
  chart.planets.forEach((a) => {
    if (a.planet === 'Rahu' || a.planet === 'Ketu') return;
    const lordOfA = signLordOf(a.signIndex);
    const b = chart.planets.find((x) => x.planet === lordOfA);
    if (b && signLordOf(b.signIndex) === a.planet && a.planet !== b.planet) {
      const key = [a.planet, b.planet].sort().join('-');
      if (seen.has(key)) return; seen.add(key);
      hits.push({ name: nm.parivartana, sanskrit: 'Parivartana', category: 'exchange', why: whyText(lang, 'parivartana', { a: pn(lang, a.planet), b: pn(lang, b.planet) }), strength: 'moderate', ...yt.parivartana });
    }
  });

  return hits;
}

function hasConjunctionWithMoon(chart: RawChart): boolean {
  const moonHouse = chart.planets.find((p) => p.planet === 'Moon')!.house;
  return chart.planets.some((p) => p.planet !== 'Moon' && p.planet !== 'Sun' && p.planet !== 'Rahu' && p.planet !== 'Ketu' && p.house === moonHouse);
}
