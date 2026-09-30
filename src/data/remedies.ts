// Structured remedy database, keyed by planet. Remedies are devotional and
// harmless (mantra, charity, fasting, deity worship). Gemstones are described
// with cautions and are NEVER auto-recommended. No fear-based content.
import type { PlanetId } from '../types/chart';

export interface Mantra {
  sanskrit: string;
  transliteration: string;
  count: number; // traditional japa count
}

export interface PlanetRemedy {
  planet: PlanetId;
  deity: string;
  day: string;
  mantra: Mantra;
  charity: string;
  fasting: string;
  lifestyle: string;
  gemstone: { stone: string; caution: string };
}

export const REMEDIES: Record<PlanetId, PlanetRemedy> = {
  Sun: {
    planet: 'Sun', deity: 'Sūrya / Lord Rāma', day: 'Sunday',
    mantra: { sanskrit: 'ॐ सूर्याय नमः', transliteration: 'Om Sūryāya Namaḥ', count: 7000 },
    charity: 'Wheat, jaggery, copper or red cloth to the needy on Sunday.',
    fasting: 'Sunday fast, one meal without salt.',
    lifestyle: 'Offer water to the rising Sun (Arghya); honour your father and elders.',
    gemstone: { stone: 'Ruby', caution: 'Only if the Sun is a functional benefic and weak, never for an afflicted malefic Sun. Consult a qualified astrologer.' },
  },
  Moon: {
    planet: 'Moon', deity: 'Chandra / Divine Mother', day: 'Monday',
    mantra: { sanskrit: 'ॐ चन्द्राय नमः', transliteration: 'Om Chandrāya Namaḥ', count: 11000 },
    charity: 'Rice, milk, white cloth or silver on Monday.',
    fasting: 'Monday fast; devotion to Śiva/Pārvatī.',
    lifestyle: 'Honour and care for your mother; keep emotional routines gentle.',
    gemstone: { stone: 'Pearl', caution: 'Suits a weak but benefic Moon; avoid if the Moon is afflicted or malefic for your Lagna.' },
  },
  Mars: {
    planet: 'Mars', deity: 'Hanumān / Kārtikeya', day: 'Tuesday',
    mantra: { sanskrit: 'ॐ अङ्गारकाय नमः', transliteration: 'Om Aṅgārakāya Namaḥ', count: 10000 },
    charity: 'Red lentils (masūr), red cloth, or jaggery on Tuesday.',
    fasting: 'Tuesday fast; recite the Hanuman Chalisa.',
    lifestyle: 'Channel energy into discipline and exercise; practise patience.',
    gemstone: { stone: 'Red Coral', caution: 'Powerful and heating, only for a weak benefic Mars; wrong use can increase conflict.' },
  },
  Mercury: {
    planet: 'Mercury', deity: 'Viṣṇu / Budha', day: 'Wednesday',
    mantra: { sanskrit: 'ॐ बुधाय नमः', transliteration: 'Om Budhāya Namaḥ', count: 9000 },
    charity: 'Green gram (mūng), green cloth, or books to students on Wednesday.',
    fasting: 'Wednesday observance; support education.',
    lifestyle: 'Practise clear, truthful speech; study and write.',
    gemstone: { stone: 'Emerald', caution: 'For a weak benefic Mercury; avoid if Mercury is combust or afflicted without guidance.' },
  },
  Jupiter: {
    planet: 'Jupiter', deity: 'Bṛhaspati / Viṣṇu', day: 'Thursday',
    mantra: { sanskrit: 'ॐ गुरवे नमः', transliteration: 'Om Gurave Namaḥ', count: 19000 },
    charity: 'Turmeric, chana dal, yellow cloth, or feeding teachers/priests on Thursday.',
    fasting: 'Thursday fast with yellow food; respect teachers.',
    lifestyle: 'Seek wisdom, study scripture, act with generosity and ethics.',
    gemstone: { stone: 'Yellow Sapphire', caution: 'Generally benefic but still chart-dependent, verify Jupiter’s functional role first.' },
  },
  Venus: {
    planet: 'Venus', deity: 'Śukra / Lakṣmī', day: 'Friday',
    mantra: { sanskrit: 'ॐ शुक्राय नमः', transliteration: 'Om Śukrāya Namaḥ', count: 16000 },
    charity: 'White sweets, curd, sugar, or white cloth on Friday.',
    fasting: 'Friday observance; honour women and the arts.',
    lifestyle: 'Cultivate beauty, harmony and balanced relationships.',
    gemstone: { stone: 'Diamond / White Sapphire', caution: 'Strong stone, only for a weak benefic Venus; costly and easily misused.' },
  },
  Saturn: {
    planet: 'Saturn', deity: 'Śani / Hanumān', day: 'Saturday',
    mantra: { sanskrit: 'ॐ शनैश्चराय नमः', transliteration: 'Om Śanaiścharāya Namaḥ', count: 23000 },
    charity: 'Black sesame, mustard oil, iron, or black cloth to the poor on Saturday.',
    fasting: 'Saturday fast; serve the elderly and labourers.',
    lifestyle: 'Embrace discipline, honesty and service; avoid shortcuts.',
    gemstone: { stone: 'Blue Sapphire', caution: 'The most powerful and unpredictable stone, NEVER wear without careful testing; can act fast either way.' },
  },
  Rahu: {
    planet: 'Rahu', deity: 'Durgā / Rāhu', day: 'Saturday',
    mantra: { sanskrit: 'ॐ राहवे नमः', transliteration: 'Om Rāhave Namaḥ', count: 18000 },
    charity: 'Black/multicoloured cloth, mustard, coconut, or feeding the marginalised.',
    fasting: 'Observe Saturday; devotion to Durgā.',
    lifestyle: 'Cut through illusion; avoid obsession, gambling and shortcuts.',
    gemstone: { stone: 'Hessonite (Gomed)', caution: 'Only under expert guidance; nodes are subtle and stones can amplify obsession.' },
  },
  Ketu: {
    planet: 'Ketu', deity: 'Gaṇeśa / Ketu', day: 'Tuesday',
    mantra: { sanskrit: 'ॐ केतवे नमः', transliteration: 'Om Ketave Namaḥ', count: 17000 },
    charity: 'Multicoloured cloth, sesame, or feeding dogs and ascetics.',
    fasting: 'Devotion to Gaṇeśa; spiritual practice.',
    lifestyle: 'Cultivate detachment, meditation and letting go.',
    gemstone: { stone: 'Cat’s Eye (Lehsunia)', caution: 'Very subtle and sudden in effect, only with expert guidance.' },
  },
};
