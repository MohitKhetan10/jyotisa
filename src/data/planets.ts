// Natural significations (kāraka) of the nine grahas. Feeds the interpretation
// rules engine. Drawn from the Navagraha tradition and classical significations.
import type { PlanetId } from '../types/chart';

export interface PlanetInfo {
  planet: PlanetId;
  title: string; // role
  karaka: string; // what it signifies (natural significator of…)
  positive: string; // strong/well-placed expression
  challenge: string; // afflicted/weak expression
  soul: string; // Purāṇic soul-nature (from the Navagraha tradition)
}

export const PLANETS: Record<PlanetId, PlanetInfo> = {
  Sun: {
    planet: 'Sun', title: 'The Soul & King (Ātmakāraka by nature)',
    karaka: 'Soul, vitality, father, authority, self-confidence, health, government.',
    positive: 'Dignified confidence, leadership, integrity, radiant health, clarity of purpose.',
    challenge: 'Pride, ego-friction with authority, low self-worth, strain with father.',
    soul: 'Born of Aditi’s prayer for a son "devoid of hatred, who strives for the welfare of all", the impartial light that sustains everything.',
  },
  Moon: {
    planet: 'Moon', title: 'The Mind & Mother',
    karaka: 'Mind, emotions, mother, comfort, the public, nourishment.',
    positive: 'Emotional intelligence, adaptability, care, popularity, a settled mind.',
    challenge: 'Mood swings, over-attachment, restlessness, emotional dependence.',
    soul: 'An incarnation of Brahmā through the supremely chaste Anasūyā, tenderness that can soften even a hardened fate.',
  },
  Mars: {
    planet: 'Mars', title: 'The Warrior & Commander',
    karaka: 'Energy, courage, siblings, land, discipline, drive.',
    positive: 'Courage, initiative, protective strength, technical skill, decisiveness.',
    challenge: 'Anger, impatience, conflict, accidents, recklessness.',
    soul: 'Born from a drop of Śiva’s tapas-heat and raised by Bhūdevī, fire given ground; raw power that must be disciplined.',
  },
  Mercury: {
    planet: 'Mercury', title: 'The Prince & Messenger',
    karaka: 'Intellect, speech, commerce, learning, communication, dexterity.',
    positive: 'Wit, clear expression, business sense, versatility, quick learning.',
    challenge: 'Nervousness, over-analysis, superficiality, indecision.',
    soul: 'Son of Chandra, intellect born of the mind’s own brilliance; the translator between worlds.',
  },
  Jupiter: {
    planet: 'Jupiter', title: 'The Guru & Minister',
    karaka: 'Wisdom, dharma, children, wealth, teachers, expansion, grace.',
    positive: 'Wisdom, faith, generosity, protection, good fortune, guidance.',
    challenge: 'Over-optimism, excess, dogmatism, complacency.',
    soul: 'Granted by Agni to sage Aṅgiras, "matchless intellect, supreme wisdom"; the chart’s great protector.',
  },
  Venus: {
    planet: 'Venus', title: 'The Poet & Preceptor of joy',
    karaka: 'Love, beauty, marriage, art, pleasure, vehicles, refinement.',
    positive: 'Charm, artistry, harmony, devotion, loving relationships.',
    challenge: 'Indulgence, vanity, attachment to comfort, relationship drama.',
    soul: 'Son of sage Bhṛgu, keeper of the vidyā that revives the dead, the force that draws souls toward sweetness and life.',
  },
  Saturn: {
    planet: 'Saturn', title: 'The Judge & Servant of Time',
    karaka: 'Time, karma, discipline, longevity, labour, detachment, the masses.',
    positive: 'Endurance, integrity, mastery through effort, humility, justice.',
    challenge: 'Delay, fear, heaviness, loneliness, chronic strain.',
    soul: 'Son of Sūrya and Chāyā (Shadow), slow, just and unbending; the most honest teacher, who rewards patience.',
  },
  Rahu: {
    planet: 'Rahu', title: 'The Shadow of Craving (North Node)',
    karaka: 'Desire, ambition, foreign things, obsession, sudden rise, illusion.',
    positive: 'Boldness, innovation, worldly success, breakthrough, unconventional genius.',
    challenge: 'Obsession, anxiety, deception, insatiable hunger, confusion.',
    soul: 'The severed head that stole a drop of amṛta, deathless hunger; the karmic pull toward what the soul has yet to master.',
  },
  Ketu: {
    planet: 'Ketu', title: 'The Shadow of Release (South Node)',
    karaka: 'Detachment, moksha, past mastery, intuition, sudden loss, spirituality.',
    positive: 'Insight, spiritual depth, mastery, discrimination, liberation.',
    challenge: 'Confusion, detachment from the world, sudden endings, self-doubt.',
    soul: 'The severed body, turned inward, what the soul already mastered; the doorway past hunger toward liberation.',
  },
};
