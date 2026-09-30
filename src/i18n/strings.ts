// Trilingual strings: English, Hindi (हिन्दी), Nepali (नेपाली).
// Astrological terms are largely shared Sanskrit-derived vocabulary across all
// three. Add keys here; every language object must carry the same keys.
export type Lang = 'en' | 'hi' | 'ne';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ne', label: 'नेपाली' },
];

type Dict = Record<string, string>;

const en: Dict = {
  'nav.home': 'Home', 'nav.dashboard': 'Dashboard', 'nav.chart': 'Chart',
  'nav.houses': 'Houses', 'nav.analysis': 'Analysis', 'nav.life': 'Soul & Timing',
  'nav.vargas': 'Vargas', 'nav.dashas': 'Dashas', 'nav.yogas': 'Yogas & Doshas',
  'nav.today': 'Today', 'nav.panchanga': 'Panchanga', 'nav.remedies': 'Remedies',
  'nav.match': 'Compatibility', 'nav.learn': 'Encyclopedia',

  'common.begin': 'Begin', 'common.cast': 'Cast my birth chart',
  'common.explore': 'Wander the encyclopedia', 'common.generate': 'Generate my chart',
  'common.calculating': 'Calculating…', 'common.noChart': 'No chart yet.',
  'common.createChart': 'Create your birth chart', 'common.export': 'Export JSON',
  'common.print': 'Print', 'common.why': 'Why?', 'common.hideWhy': 'Hide why',

  'home.kicker': 'Vedic Astrology · Jyotiṣa',
  'home.h1a': 'Read the sky you', 'home.h1b': 'were born under.',
  'home.hero': 'Your birth chart, dashās, divisional charts, transits and traditional remedies, drawn from the exact heavens of your birth. Told gently, and told true.',
  'home.pointsTitle': 'Built with care, given with respect',
  'home.p1t': 'Free, and always', 'home.p1b': 'No sign-up, no email, no payment. The whole tool is open to everyone.',
  'home.p2t': 'Yours alone', 'home.p2b': 'Your birth details are worked out inside your own browser and never sent anywhere.',
  'home.p3t': 'Real sky, real maths', 'home.p3b': 'Swiss Ephemeris, the sidereal zodiac and Lahiri ayanāṁśa, the same precision serious jyotiṣīs rely on.',
  'home.p4t': 'Honest, and kind', 'home.p4b': 'Every reading shows its reasoning, names the light and the shadow, and treats you as a whole person.',

  'birth.title': 'Enter your birth details',
  'birth.subtitle': 'No account needed. Everything is calculated privately in your browser.',
  'birth.name': 'Name (optional)', 'birth.namePh': 'Your name',
  'birth.dob': 'Date of birth', 'birth.tob': 'Time of birth',
  'birth.unknown': 'I don’t know my exact birth time',
  'birth.warning': 'Astrological calculations change significantly with birth-time accuracy. Without it, the ascendant, houses, divisional charts and dashā timing may be unreliable. We will use noon as a placeholder and mark reliability as low.',
  'birth.place': 'Birthplace',
  'birth.errDate': 'Please enter your date of birth.',
  'birth.errPlace': 'Please search and select your birthplace.',
  'birth.errTime': 'Please enter your birth time, or mark it as unknown.',

  'dash.ascendant': 'Ascendant (Lagna)', 'dash.moon': 'Moon Sign (Rāśi)',
  'dash.sun': 'Sun Sign', 'dash.reliability': 'Reliability',
  'rel.high': 'High', 'rel.medium': 'Medium', 'rel.low': 'Low',
  'dash.seeChart': 'See full chart & positions',
  'dash.timeUnknown': 'time unknown', 'dash.house': 'House',

  'footer.calc': 'Calculations by Swiss Ephemeris (AGPL-3.0) · Sidereal · Lahiri ayanāṁśa · Your birth data stays in your browser.',
  'footer.how': 'How calculations work', 'footer.note': 'Interpretations are traditional Vedic readings, not scientific claims.',
};

const hi: Dict = {
  'nav.home': 'मुख्य', 'nav.dashboard': 'डैशबोर्ड', 'nav.chart': 'कुंडली',
  'nav.houses': 'भाव', 'nav.analysis': 'विश्लेषण', 'nav.life': 'आत्मा और समय',
  'nav.vargas': 'वर्ग कुंडली', 'nav.dashas': 'दशा', 'nav.yogas': 'योग और दोष',
  'nav.today': 'आज', 'nav.panchanga': 'पंचांग', 'nav.remedies': 'उपाय',
  'nav.match': 'गुण मिलान', 'nav.learn': 'ज्ञानकोश',

  'common.begin': 'शुरू करें', 'common.cast': 'मेरी कुंडली बनाएँ',
  'common.explore': 'ज्ञानकोश देखें', 'common.generate': 'कुंडली बनाएँ',
  'common.calculating': 'गणना हो रही है…', 'common.noChart': 'अभी कोई कुंडली नहीं।',
  'common.createChart': 'अपनी कुंडली बनाएँ', 'common.export': 'JSON निर्यात',
  'common.print': 'प्रिंट', 'common.why': 'क्यों?', 'common.hideWhy': 'छिपाएँ',

  'home.kicker': 'वैदिक ज्योतिष · ज्योतिष',
  'home.h1a': 'उस आकाश को पढ़ें जिसके', 'home.h1b': 'नीचे आपका जन्म हुआ।',
  'home.hero': 'आपकी कुंडली, दशाएँ, वर्ग कुंडलियाँ, गोचर और पारंपरिक उपाय, आपके जन्म के ठीक आकाश से निकाले गए। सौम्यता से, और सच्चाई से कहे गए।',
  'home.pointsTitle': 'श्रद्धा से बनाया, सम्मान से दिया',
  'home.p1t': 'नि:शुल्क, हमेशा', 'home.p1b': 'कोई साइन-अप नहीं, कोई ईमेल नहीं, कोई शुल्क नहीं। यह पूरा साधन सबके लिए खुला है।',
  'home.p2t': 'केवल आपका', 'home.p2b': 'आपका जन्म विवरण आपके ही ब्राउज़र में गणना होता है और कहीं नहीं भेजा जाता।',
  'home.p3t': 'सच्चा आकाश, सच्ची गणना', 'home.p3b': 'स्विस एफेमेरिस, निरयन राशिचक्र और लाहिरी अयनांश, वही सटीकता जिस पर गंभीर ज्योतिषी भरोसा करते हैं।',
  'home.p4t': 'सच्चा, और सौम्य', 'home.p4b': 'हर पठन अपना तर्क दिखाता है, प्रकाश और छाया दोनों बताता है, और आपको एक संपूर्ण व्यक्ति मानता है।',

  'birth.title': 'अपना जन्म विवरण भरें',
  'birth.subtitle': 'किसी खाते की आवश्यकता नहीं। सब कुछ आपके ब्राउज़र में निजी रूप से गणना होता है।',
  'birth.name': 'नाम (वैकल्पिक)', 'birth.namePh': 'आपका नाम',
  'birth.dob': 'जन्म तिथि', 'birth.tob': 'जन्म समय',
  'birth.unknown': 'मुझे अपना सटीक जन्म समय नहीं पता',
  'birth.warning': 'जन्म समय की सटीकता से गणनाएँ काफी बदल जाती हैं। इसके बिना लग्न, भाव, वर्ग कुंडलियाँ और दशा का समय अविश्वसनीय हो सकता है। हम दोपहर को स्थानापन्न मानेंगे और विश्वसनीयता निम्न अंकित करेंगे।',
  'birth.place': 'जन्म स्थान',
  'birth.errDate': 'कृपया अपनी जन्म तिथि भरें।',
  'birth.errPlace': 'कृपया अपना जन्म स्थान खोजकर चुनें।',
  'birth.errTime': 'कृपया जन्म समय भरें, या इसे अज्ञात अंकित करें।',

  'dash.ascendant': 'लग्न', 'dash.moon': 'चंद्र राशि',
  'dash.sun': 'सूर्य राशि', 'dash.reliability': 'विश्वसनीयता',
  'rel.high': 'उच्च', 'rel.medium': 'मध्यम', 'rel.low': 'निम्न',
  'dash.seeChart': 'पूरी कुंडली और स्थितियाँ देखें',
  'dash.timeUnknown': 'समय अज्ञात', 'dash.house': 'भाव',

  'footer.calc': 'गणना स्विस एफेमेरिस (AGPL-3.0) द्वारा · निरयन · लाहिरी अयनांश · आपका जन्म विवरण आपके ब्राउज़र में ही रहता है।',
  'footer.how': 'गणना कैसे होती है', 'footer.note': 'व्याख्याएँ पारंपरिक वैदिक पठन हैं, वैज्ञानिक दावे नहीं।',
};

const ne: Dict = {
  'nav.home': 'गृह', 'nav.dashboard': 'ड्यासबोर्ड', 'nav.chart': 'कुण्डली',
  'nav.houses': 'भाव', 'nav.analysis': 'विश्लेषण', 'nav.life': 'आत्मा र समय',
  'nav.vargas': 'वर्ग कुण्डली', 'nav.dashas': 'दशा', 'nav.yogas': 'योग र दोष',
  'nav.today': 'आज', 'nav.panchanga': 'पञ्चाङ्ग', 'nav.remedies': 'उपाय',
  'nav.match': 'गुण मिलान', 'nav.learn': 'ज्ञानकोश',

  'common.begin': 'सुरु गर्नुहोस्', 'common.cast': 'मेरो कुण्डली बनाउनुहोस्',
  'common.explore': 'ज्ञानकोश हेर्नुहोस्', 'common.generate': 'कुण्डली बनाउनुहोस्',
  'common.calculating': 'गणना हुँदैछ…', 'common.noChart': 'अहिलेसम्म कुनै कुण्डली छैन।',
  'common.createChart': 'आफ्नो कुण्डली बनाउनुहोस्', 'common.export': 'JSON निर्यात',
  'common.print': 'प्रिन्ट', 'common.why': 'किन?', 'common.hideWhy': 'लुकाउनुहोस्',

  'home.kicker': 'वैदिक ज्योतिष · ज्योतिष',
  'home.h1a': 'तपाईं जन्मनुभएको', 'home.h1b': 'आकाश पढ्नुहोस्।',
  'home.hero': 'तपाईंको कुण्डली, दशा, वर्ग कुण्डली, गोचर र परम्परागत उपाय, तपाईंको जन्मको ठ्याक्कै आकाशबाट निकालिएको। नरम रूपमा, र सत्य रूपमा भनिएको।',
  'home.pointsTitle': 'यत्नले बनाइएको, सम्मानले दिइएको',
  'home.p1t': 'नि:शुल्क, सधैं', 'home.p1b': 'कुनै साइन-अप छैन, इमेल छैन, शुल्क छैन। यो सम्पूर्ण साधन सबैका लागि खुला छ।',
  'home.p2t': 'केवल तपाईंको', 'home.p2b': 'तपाईंको जन्म विवरण तपाईंकै ब्राउजरमा गणना हुन्छ र कहीँ पठाइँदैन।',
  'home.p3t': 'साँचो आकाश, साँचो गणित', 'home.p3b': 'स्विस एफेमेरिस, निरयन राशिचक्र र लाहिरी अयनांश, गम्भीर ज्योतिषीहरूले भरोसा गर्ने त्यही शुद्धता।',
  'home.p4t': 'इमानदार, र दयालु', 'home.p4b': 'हरेक पठनले आफ्नो तर्क देखाउँछ, उज्यालो र छाया दुवै भन्छ, र तपाईंलाई सिंगो व्यक्तिका रूपमा हेर्छ।',

  'birth.title': 'आफ्नो जन्म विवरण भर्नुहोस्',
  'birth.subtitle': 'कुनै खाता आवश्यक छैन। सबै कुरा तपाईंको ब्राउजरमा निजी रूपमा गणना हुन्छ।',
  'birth.name': 'नाम (वैकल्पिक)', 'birth.namePh': 'तपाईंको नाम',
  'birth.dob': 'जन्म मिति', 'birth.tob': 'जन्म समय',
  'birth.unknown': 'मलाई मेरो ठ्याक्कै जन्म समय थाहा छैन',
  'birth.warning': 'जन्म समयको शुद्धताले गणना धेरै फरक पार्छ। यसबिना लग्न, भाव, वर्ग कुण्डली र दशाको समय अविश्वसनीय हुन सक्छ। हामी मध्यान्हलाई स्थानापन्न मान्नेछौं र विश्वसनीयता न्यून अङ्कित गर्नेछौं।',
  'birth.place': 'जन्म स्थान',
  'birth.errDate': 'कृपया आफ्नो जन्म मिति भर्नुहोस्।',
  'birth.errPlace': 'कृपया आफ्नो जन्म स्थान खोजेर छान्नुहोस्।',
  'birth.errTime': 'कृपया जन्म समय भर्नुहोस्, वा यसलाई अज्ञात अङ्कित गर्नुहोस्।',

  'dash.ascendant': 'लग्न', 'dash.moon': 'चन्द्र राशि',
  'dash.sun': 'सूर्य राशि', 'dash.reliability': 'विश्वसनीयता',
  'rel.high': 'उच्च', 'rel.medium': 'मध्यम', 'rel.low': 'न्यून',
  'dash.seeChart': 'पूरा कुण्डली र स्थिति हेर्नुहोस्',
  'dash.timeUnknown': 'समय अज्ञात', 'dash.house': 'भाव',

  'footer.calc': 'गणना स्विस एफेमेरिस (AGPL-3.0) द्वारा · निरयन · लाहिरी अयनांश · तपाईंको जन्म विवरण तपाईंकै ब्राउजरमा रहन्छ।',
  'footer.how': 'गणना कसरी हुन्छ', 'footer.note': 'व्याख्याहरू परम्परागत वैदिक पठन हुन्, वैज्ञानिक दाबी होइनन्।',
};

import { STRINGS2 } from './strings2';

export const STRINGS: Record<Lang, Dict> = {
  en: { ...en, ...STRINGS2.en },
  hi: { ...hi, ...STRINGS2.hi },
  ne: { ...ne, ...STRINGS2.ne },
};
