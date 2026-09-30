// ─────────────────────────────────────────────────────────────────────────
//  PAÑCĀṄGA ENGINE, the five limbs of the day, computed from the Sun and Moon
//  for a given date & location, plus sunrise/sunset-derived inauspicious
//  windows (Rāhu Kālam, Yamagaṇḍa, Gulika) and Abhijit Muhūrta.
//
//  Tithi/Yoga/Karaṇa use the Sun-Moon elongation, where the ayanāṁśa cancels,
//  so they are identical in sidereal and tropical frames.
// ─────────────────────────────────────────────────────────────────────────
import { getEngine } from '../ephemeris/swiss';
import { NAKSHATRAS, norm360 } from '../zodiac/zodiac';
import type { Lang } from '../../i18n/strings';

// Devanagari names (shared by Hindi and Nepali, being Sanskrit terms).
const TITHI: Record<'en' | 'deva', string[]> = {
  en: ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'],
  deva: ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'],
};
const YOGA: Record<'en' | 'deva', string[]> = {
  en: ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'],
  deva: ['विष्कम्भ', 'प्रीति', 'आयुष्मान्', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान्', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'],
};
const NAK: Record<'en' | 'deva', string[]> = {
  en: NAKSHATRAS,
  deva: ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढा', 'उत्तराषाढा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'],
};
const VARA_L: Record<'en' | 'deva', string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  deva: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'बृहस्पतिवार', 'शुक्रवार', 'शनिवार'],
};
const PAKSHA_L = { en: { Shukla: 'Shukla', Krishna: 'Krishna' }, deva: { Shukla: 'शुक्ल', Krishna: 'कृष्ण' } };
const KARANA_W = { en: 'Karana', deva: 'करण' };

// Rāhu Kālam / Yamagaṇḍa / Gulika occupy fixed 1/8 slots of the day, by weekday.
const RAHU_SLOT = [8, 2, 7, 5, 6, 4, 3]; // Sun..Sat (1-based eighth of daytime)
const YAMA_SLOT = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SLOT = [7, 6, 5, 4, 3, 2, 1];

export interface Panchanga {
  date: Date;
  vara: string;
  tithi: { index: number; name: string; paksha: string };
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: Date | null;
  sunset: Date | null;
  rahuKalam: [Date, Date] | null;
  yamaganda: [Date, Date] | null;
  gulika: [Date, Date] | null;
  abhijit: [Date, Date] | null;
}

const jdToDate = (jd: number) => new Date((jd - 2440587.5) * 86_400_000);
const dateToJd = (d: Date) => d.getTime() / 86_400_000 + 2440587.5;

export async function computePanchanga(date: Date, lat: number, lon: number, lang: Lang = 'en'): Promise<Panchanga> {
  const L = lang === 'en' ? 'en' : 'deva';
  const swe = await getEngine();
  const jd = dateToJd(date);
  const flags = swe.SEFLG_SWIEPH;
  const sun = norm360(swe.calc_ut(jd, 0, flags)[0]);
  const moon = norm360(swe.calc_ut(jd, 1, flags)[0]);

  const elong = norm360(moon - sun);
  const tithiNum = Math.floor(elong / 12); // 0..29
  const paksha = tithiNum < 15 ? 'Shukla' : 'Krishna';
  const karanaNum = Math.floor(elong / 6); // 0..59 (11 named karanas cycle)

  const nakIndex = Math.floor(norm360(moon) / (360 / 27));
  const yogaIndex = Math.floor(norm360(sun + moon) / (360 / 27));

  // Sunrise / sunset via rise_trans (graceful if unavailable).
  let sunrise: Date | null = null, sunset: Date | null = null;
  try {
    const geopos = [lon, lat, 0];
    const startJd = Math.floor(jd - 0.5) + 0.5; // local midnight-ish anchor
    // SE_CALC_RISE = 1, SE_CALC_SET = 2 (not exposed on the wrapper's type).
    const rise = swe.rise_trans(startJd, 0, '', flags, 1, geopos, 0, 0);
    const set = swe.rise_trans(startJd, 0, '', flags, 2, geopos, 0, 0);
    if (rise) sunrise = jdToDate(rise[0]);
    if (set) sunset = jdToDate(set[0]);
  } catch { /* rise/set unavailable, leave null, do not fake */ }

  const vara = VARA_L[L][date.getUTCDay()];
  const slots = (sr: Date, ss: Date, slot: number): [Date, Date] => {
    const dayMs = ss.getTime() - sr.getTime();
    const eighth = dayMs / 8;
    const startI = slot - 1;
    return [new Date(sr.getTime() + startI * eighth), new Date(sr.getTime() + slot * eighth)];
  };

  let rahuKalam: [Date, Date] | null = null, yamaganda: [Date, Date] | null = null,
      gulika: [Date, Date] | null = null, abhijit: [Date, Date] | null = null;
  if (sunrise && sunset) {
    const wd = date.getUTCDay();
    rahuKalam = slots(sunrise, sunset, RAHU_SLOT[wd]);
    yamaganda = slots(sunrise, sunset, YAMA_SLOT[wd]);
    gulika = slots(sunrise, sunset, GULIKA_SLOT[wd]);
    // Abhijit: the 8th of 15 muhurtas of daytime (midday), ~48 min around noon.
    const mid = (sunrise.getTime() + sunset.getTime()) / 2;
    const muhurta = (sunset.getTime() - sunrise.getTime()) / 15;
    abhijit = [new Date(mid - muhurta / 2), new Date(mid + muhurta / 2)];
  }

  return {
    date, vara,
    tithi: { index: tithiNum + 1, name: TITHI[L][tithiNum % 15], paksha: PAKSHA_L[L][paksha] },
    nakshatra: NAK[L][nakIndex],
    yoga: YOGA[L][yogaIndex],
    karana: `${KARANA_W[L]} ${((karanaNum % 60) % 11) + 1}`,
    sunrise, sunset, rahuKalam, yamaganda, gulika, abhijit,
  };
}
