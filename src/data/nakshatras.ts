// The 27 Nakṣatras with classical attributes. Data drives the nakshatra engine
// and the encyclopedia. Interpretations are traditional, not scientific claims.
import type { PlanetId } from '../types/chart';

export interface NakshatraInfo {
  index: number; // 0-26
  name: string;
  deity: string;
  lord: PlanetId; // dasha lord
  symbol: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  yoni: string; // animal symbol
  nadi: 'Adi' | 'Madhya' | 'Antya';
  strengths: string;
  challenges: string;
}

// lord follows the Vimśottarī cycle (Ketu, Venus, Sun, Moon, Mars, Rahu, Jup, Sat, Mer)
export const NAKSHATRA_DATA: NakshatraInfo[] = [
  { index: 0, name: 'Ashwini', deity: 'Ashwini Kumaras', lord: 'Ketu', symbol: 'Horse’s head', gana: 'Deva', yoni: 'Horse', nadi: 'Adi', strengths: 'Speed, healing, fresh starts, pioneering energy.', challenges: 'Impulsiveness, impatience, restlessness.' },
  { index: 1, name: 'Bharani', deity: 'Yama', lord: 'Venus', symbol: 'Yoni', gana: 'Manushya', yoni: 'Elephant', nadi: 'Madhya', strengths: 'Endurance, creative power, capacity to bear and transform.', challenges: 'Extremes, jealousy, burden of restraint.' },
  { index: 2, name: 'Krittika', deity: 'Agni', lord: 'Sun', symbol: 'Razor / flame', gana: 'Rakshasa', yoni: 'Sheep', nadi: 'Antya', strengths: 'Sharp focus, purification, courage to cut through.', challenges: 'Criticism, temper, cutting words.' },
  { index: 3, name: 'Rohini', deity: 'Brahma / Prajapati', lord: 'Moon', symbol: 'Chariot / ox-cart', gana: 'Manushya', yoni: 'Serpent', nadi: 'Adi', strengths: 'Beauty, fertility, magnetism, material growth.', challenges: 'Attachment, possessiveness, indulgence.' },
  { index: 4, name: 'Mrigashira', deity: 'Soma', lord: 'Mars', symbol: 'Deer’s head', gana: 'Deva', yoni: 'Serpent', nadi: 'Madhya', strengths: 'Curiosity, gentleness, the seeker’s search.', challenges: 'Restlessness, suspicion, never satisfied.' },
  { index: 5, name: 'Ardra', deity: 'Rudra', lord: 'Rahu', symbol: 'Teardrop / diamond', gana: 'Manushya', yoni: 'Dog', nadi: 'Antya', strengths: 'Transformative intensity, breakthrough after storm.', challenges: 'Turbulence, grief, destructive moods.' },
  { index: 6, name: 'Punarvasu', deity: 'Aditi', lord: 'Jupiter', symbol: 'Quiver of arrows', gana: 'Deva', yoni: 'Cat', nadi: 'Adi', strengths: 'Renewal, return, wisdom, safe haven.', challenges: 'Repetition, over-idealism, letting go too easily.' },
  { index: 7, name: 'Pushya', deity: 'Brihaspati', lord: 'Saturn', symbol: 'Cow’s udder / lotus', gana: 'Deva', yoni: 'Sheep', nadi: 'Madhya', strengths: 'Nourishment, devotion, the most auspicious nakshatra.', challenges: 'Rigidity, over-caution, clinging to security.' },
  { index: 8, name: 'Ashlesha', deity: 'Nagas', lord: 'Mercury', symbol: 'Coiled serpent', gana: 'Rakshasa', yoni: 'Cat', nadi: 'Antya', strengths: 'Insight, hypnotic depth, kundalini wisdom.', challenges: 'Manipulation, entanglement, hidden venom.' },
  { index: 9, name: 'Magha', deity: 'Pitris (ancestors)', lord: 'Ketu', symbol: 'Throne', gana: 'Rakshasa', yoni: 'Rat', nadi: 'Adi', strengths: 'Dignity, leadership, honouring lineage.', challenges: 'Pride, entitlement, living in the past.' },
  { index: 10, name: 'Purva Phalguni', deity: 'Bhaga', lord: 'Venus', symbol: 'Front legs of a bed', gana: 'Manushya', yoni: 'Rat', nadi: 'Madhya', strengths: 'Enjoyment, romance, creativity, rest.', challenges: 'Laziness, vanity, over-indulgence.' },
  { index: 11, name: 'Uttara Phalguni', deity: 'Aryaman', lord: 'Sun', symbol: 'Back legs of a bed', gana: 'Manushya', yoni: 'Cow', nadi: 'Antya', strengths: 'Generosity, reliable friendship, noble contracts.', challenges: 'Over-giving, need for recognition.' },
  { index: 12, name: 'Hasta', deity: 'Savitr (Sun)', lord: 'Moon', symbol: 'Hand', gana: 'Deva', yoni: 'Buffalo', nadi: 'Adi', strengths: 'Skill, craft, dexterity, manifestation.', challenges: 'Restlessness, manipulation, over-control.' },
  { index: 13, name: 'Chitra', deity: 'Vishwakarma / Tvashtar', lord: 'Mars', symbol: 'Bright jewel', gana: 'Rakshasa', yoni: 'Tiger', nadi: 'Madhya', strengths: 'Brilliance, design, artistry, charisma.', challenges: 'Ego in appearance, illusion, restlessness.' },
  { index: 14, name: 'Swati', deity: 'Vayu', lord: 'Rahu', symbol: 'Young shoot in wind / coral', gana: 'Deva', yoni: 'Buffalo', nadi: 'Antya', strengths: 'Independence, adaptability, balance, trade.', challenges: 'Indecision, scattering, restlessness.' },
  { index: 15, name: 'Vishakha', deity: 'Indra-Agni', lord: 'Jupiter', symbol: 'Triumphal arch', gana: 'Rakshasa', yoni: 'Tiger', nadi: 'Adi', strengths: 'Goal-focus, determination, triumphant effort.', challenges: 'Obsession, impatience for results, jealousy.' },
  { index: 16, name: 'Anuradha', deity: 'Mitra', lord: 'Saturn', symbol: 'Lotus / staff', gana: 'Deva', yoni: 'Deer', nadi: 'Madhya', strengths: 'Friendship, devotion, success abroad, cooperation.', challenges: 'Melancholy, dependence on others, jealousy.' },
  { index: 17, name: 'Jyeshtha', deity: 'Indra', lord: 'Mercury', symbol: 'Earring / umbrella', gana: 'Rakshasa', yoni: 'Deer', nadi: 'Antya', strengths: 'Seniority, protection, occult power, responsibility.', challenges: 'Arrogance, secrecy, burden of being eldest.' },
  { index: 18, name: 'Mula', deity: 'Nirriti', lord: 'Ketu', symbol: 'Bunch of roots', gana: 'Rakshasa', yoni: 'Dog', nadi: 'Adi', strengths: 'Getting to the root, research, spiritual dissolution.', challenges: 'Upheaval, destruction before renewal, extremes.' },
  { index: 19, name: 'Purva Ashadha', deity: 'Apas (waters)', lord: 'Venus', symbol: 'Fan / winnowing basket', gana: 'Manushya', yoni: 'Monkey', nadi: 'Madhya', strengths: 'Invincible conviction, influence, purification.', challenges: 'Pride, stubbornness, over-ambition.' },
  { index: 20, name: 'Uttara Ashadha', deity: 'Vishwadevas', lord: 'Sun', symbol: 'Elephant tusk / planks', gana: 'Manushya', yoni: 'Mongoose', nadi: 'Antya', strengths: 'Lasting victory, integrity, leadership with virtue.', challenges: 'Rigidity, over-seriousness, isolation.' },
  { index: 21, name: 'Shravana', deity: 'Vishnu', lord: 'Moon', symbol: 'Ear / three footprints', gana: 'Deva', yoni: 'Monkey', nadi: 'Adi', strengths: 'Listening, learning, wisdom through hearing, connection.', challenges: 'Over-thinking, gossip, rigidity of belief.' },
  { index: 22, name: 'Dhanishta', deity: 'Vasus', lord: 'Mars', symbol: 'Drum', gana: 'Rakshasa', yoni: 'Lion', nadi: 'Madhya', strengths: 'Rhythm, wealth, music, group prosperity.', challenges: 'Materialism, over-drive, insensitivity.' },
  { index: 23, name: 'Shatabhisha', deity: 'Varuna', lord: 'Rahu', symbol: 'Empty circle / 100 healers', gana: 'Rakshasa', yoni: 'Horse', nadi: 'Antya', strengths: 'Healing, mysticism, independence, secrecy of the sage.', challenges: 'Isolation, stubbornness, hidden struggles.' },
  { index: 24, name: 'Purva Bhadrapada', deity: 'Aja Ekapada', lord: 'Jupiter', symbol: 'Front of a funeral cot / two-faced man', gana: 'Manushya', yoni: 'Lion', nadi: 'Adi', strengths: 'Intensity of purpose, spiritual fire, idealism.', challenges: 'Extremism, anxiety, duality of nature.' },
  { index: 25, name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', lord: 'Saturn', symbol: 'Back of a funeral cot / serpent of the deep', gana: 'Manushya', yoni: 'Cow', nadi: 'Madhya', strengths: 'Depth, wisdom, endurance, compassion, calm.', challenges: 'Withdrawal, sloth, suppressed anger.' },
  { index: 26, name: 'Revati', deity: 'Pushan', lord: 'Mercury', symbol: 'Fish / drum', gana: 'Deva', yoni: 'Elephant', nadi: 'Antya', strengths: 'Nourishing guidance, safe passage, compassion, completion.', challenges: 'Over-sensitivity, difficulty with endings, being taken advantage of.' },
];
