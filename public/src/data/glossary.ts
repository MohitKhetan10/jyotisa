// Core Jyotiṣa glossary for the encyclopedia. Plain, honest explanations.
export interface GlossaryEntry { term: string; category: string; text: string; }

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Lagna (Ascendant)', category: 'Concept', text: 'The sign rising on the eastern horizon at birth. It becomes the 1st house and is the experiencer of the whole chart, every other house is counted from it.' },
  { term: 'Rāśi', category: 'Concept', text: 'A zodiac sign (30°). The “role” a planet plays, how it expresses. There are 12, from Aries to Pisces.' },
  { term: 'Bhāva', category: 'Concept', text: 'A house, a field of life experience (the “scene”). Read together with its sign, its lord and its occupants.' },
  { term: 'Graha', category: 'Concept', text: 'A planet, the “actor.” The nine grahas are the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rāhu and Ketu.' },
  { term: 'Nakṣatra', category: 'Concept', text: 'One of 27 lunar mansions (13°20′ each). The Moon’s nakṣatra drives the Vimśottarī daśā and reveals deep temperament.' },
  { term: 'Ayanāṁśa', category: 'Calculation', text: 'The offset between the tropical and sidereal zodiacs, caused by precession. This app uses Lahiri by default. It is subtracted from tropical longitudes to get sidereal ones.' },
  { term: 'Sidereal zodiac', category: 'Calculation', text: 'A zodiac fixed to the stars (used in Vedic astrology), as opposed to the tropical zodiac fixed to the seasons.' },
  { term: 'Whole-sign houses', category: 'Calculation', text: 'The house system where the ascendant’s entire sign is the 1st house and each following sign is the next house. The classical Vedic default.' },
  { term: 'Vimśottarī Daśā', category: 'Timing', text: 'The principal 120-year planetary-period system, driven by the Moon’s nakṣatra at birth. Maha → antar → pratyantar sub-periods time life events.' },
  { term: 'Varga', category: 'Charts', text: 'A divisional (harmonic) chart derived from the D1, magnifying a specific area of life, e.g. D9 (navāṁśa) for marriage and inner strength, D10 for career.' },
  { term: 'Vargottama', category: 'Charts', text: 'A planet in the same sign in both D1 and D9, a mark of strength and consistency.' },
  { term: 'Retrograde (Vakrī)', category: 'Concept', text: 'Apparent backward motion of a planet. In Jyotiṣa it intensifies and internalises the planet’s energy; the nodes are always retrograde.' },
  { term: 'Combust (Asta)', category: 'Concept', text: 'A planet too close to the Sun, its outer expression dimmed by the Sun’s glare. The orb differs per planet.' },
  { term: 'Exaltation / Debilitation', category: 'Dignity', text: 'The sign of a planet’s greatest strength (exaltation / uccha) or greatest weakness (debilitation / nīcha). Debilitation can be cancelled (nīcha-bhaṅga).' },
  { term: 'Kendra / Trikoṇa', category: 'Houses', text: 'Kendras (1,4,7,10) are the angular pillars of the chart; trikoṇas (1,5,9) are the trines of dharma and grace. Their lords combining forms Rāja yoga.' },
  { term: 'Duḥsthāna', category: 'Houses', text: 'The difficult houses 6, 8 and 12 (conflict, crisis, loss). Their afflictions are workable, and their lords can form Viparīta Rāja yoga.' },
  { term: 'Sade Sati', category: 'Timing', text: 'The ~7½-year transit of Saturn over the 12th, 1st and 2nd from the natal Moon. A maturing, responsibility-bearing phase, demanding, not a punishment.' },
  { term: 'Daśā balance', category: 'Timing', text: 'The unelapsed portion of the first Vimśottarī period at birth, from how far the Moon has moved through its nakṣatra.' },
];
