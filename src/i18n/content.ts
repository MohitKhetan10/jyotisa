// Trilingual CONTENT for the reading engines (as opposed to UI chrome in
// strings.ts). Planet significations and house meanings in EN / HI / NE, plus
// the sentence templates the interpretation engine uses to compose readings.
import type { Lang } from './strings';
import type { PlanetId } from '../types/chart';

interface PlanetC { title: string; karaka: string; positive: string; challenge: string; soul: string; }

export const PLANET_C: Record<Lang, Record<PlanetId, PlanetC>> = {
  en: {
    Sun: { title: 'The Soul & King', karaka: 'Soul, vitality, father, authority, confidence, health.', positive: 'Dignified confidence, leadership, integrity, radiant health, clarity of purpose.', challenge: 'Pride, ego-friction with authority, low self-worth, strain with father.', soul: 'The impartial light that sustains all, born of Aditi’s prayer for a son free of hatred.' },
    Moon: { title: 'The Mind & Mother', karaka: 'Mind, emotions, mother, comfort, the public, nourishment.', positive: 'Emotional intelligence, adaptability, care, popularity, a settled mind.', challenge: 'Mood swings, over-attachment, restlessness, emotional dependence.', soul: 'An incarnation of Brahmā through the chaste Anasūyā, tenderness that softens fate.' },
    Mars: { title: 'The Warrior', karaka: 'Energy, courage, siblings, land, discipline, drive.', positive: 'Courage, initiative, protective strength, technical skill, decisiveness.', challenge: 'Anger, impatience, conflict, accidents, recklessness.', soul: 'Born of Śiva’s tapas-heat, raised by the Earth; fire that must be disciplined.' },
    Mercury: { title: 'The Prince & Messenger', karaka: 'Intellect, speech, commerce, learning, communication.', positive: 'Wit, clear expression, business sense, versatility, quick learning.', challenge: 'Nervousness, over-analysis, superficiality, indecision.', soul: 'Son of the Moon, intellect born of the mind’s own brilliance.' },
    Jupiter: { title: 'The Guru', karaka: 'Wisdom, dharma, children, wealth, teachers, grace.', positive: 'Wisdom, faith, generosity, protection, good fortune, guidance.', challenge: 'Over-optimism, excess, dogmatism, complacency.', soul: 'Granted by Agni to sage Aṅgiras; the chart’s great protector.' },
    Venus: { title: 'The Poet', karaka: 'Love, beauty, marriage, art, pleasure, refinement.', positive: 'Charm, artistry, harmony, devotion, loving relationships.', challenge: 'Indulgence, vanity, attachment to comfort, relationship drama.', soul: 'Son of Bhṛgu, keeper of the vidyā that revives the dead; draws souls to sweetness.' },
    Saturn: { title: 'The Judge', karaka: 'Time, karma, discipline, longevity, labour, detachment.', positive: 'Endurance, integrity, mastery through effort, humility, justice.', challenge: 'Delay, fear, heaviness, loneliness, chronic strain.', soul: 'Son of the Sun and Shadow; slow, just, the most honest teacher.' },
    Rahu: { title: 'The Shadow of Craving', karaka: 'Desire, ambition, foreign things, obsession, sudden rise.', positive: 'Boldness, innovation, worldly success, breakthrough, unconventional genius.', challenge: 'Obsession, anxiety, deception, insatiable hunger, confusion.', soul: 'The severed head that stole amṛta; the pull toward what the soul has yet to master.' },
    Ketu: { title: 'The Shadow of Release', karaka: 'Detachment, moksha, past mastery, intuition, spirituality.', positive: 'Insight, spiritual depth, mastery, discrimination, liberation.', challenge: 'Confusion, detachment, sudden endings, self-doubt.', soul: 'The severed body turned inward; the doorway past hunger toward liberation.' },
  },
  hi: {
    Sun: { title: 'आत्मा और राजा', karaka: 'आत्मा, ओज, पिता, अधिकार, आत्मविश्वास, स्वास्थ्य।', positive: 'गरिमामय आत्मविश्वास, नेतृत्व, सत्यनिष्ठा, तेजस्वी स्वास्थ्य, उद्देश्य की स्पष्टता।', challenge: 'अहंकार, अधिकारियों से टकराव, आत्म-मूल्य की कमी, पिता से तनाव।', soul: 'सबको धारण करने वाला निष्पक्ष प्रकाश, अदिति की उस प्रार्थना से जन्मा जो द्वेष-रहित पुत्र चाहती थीं।' },
    Moon: { title: 'मन और माता', karaka: 'मन, भावनाएँ, माता, सुख, जनता, पोषण।', positive: 'भावनात्मक बुद्धि, अनुकूलनशीलता, देखभाल, लोकप्रियता, स्थिर मन।', challenge: 'मनोदशा में उतार-चढ़ाव, अति-आसक्ति, बेचैनी, भावनात्मक निर्भरता।', soul: 'सती अनसूया के माध्यम से ब्रह्मा का अवतार, कोमलता जो भाग्य को भी नरम कर देती है।' },
    Mars: { title: 'योद्धा', karaka: 'ऊर्जा, साहस, भाई-बहन, भूमि, अनुशासन, प्रेरणा।', positive: 'साहस, पहल, रक्षक शक्ति, तकनीकी कौशल, निर्णायकता।', challenge: 'क्रोध, अधीरता, संघर्ष, दुर्घटनाएँ, उतावलापन।', soul: 'शिव के तप-ताप से जन्मे, पृथ्वी द्वारा पालित; अग्नि जिसे अनुशासित करना है।' },
    Mercury: { title: 'राजकुमार और दूत', karaka: 'बुद्धि, वाणी, व्यापार, विद्या, संचार।', positive: 'चातुर्य, स्पष्ट अभिव्यक्ति, व्यावसायिक समझ, बहुमुखता, तीव्र सीख।', challenge: 'घबराहट, अति-विश्लेषण, सतहीपन, अनिर्णय।', soul: 'चंद्र के पुत्र, मन की अपनी प्रतिभा से जन्मी बुद्धि।' },
    Jupiter: { title: 'गुरु', karaka: 'ज्ञान, धर्म, संतान, धन, गुरु, कृपा।', positive: 'ज्ञान, श्रद्धा, उदारता, रक्षा, सौभाग्य, मार्गदर्शन।', challenge: 'अति-आशावाद, अति, हठधर्मिता, आत्मसंतोष।', soul: 'अग्नि द्वारा अंगिरस ऋषि को प्रदत्त; कुंडली का महान रक्षक।' },
    Venus: { title: 'कवि', karaka: 'प्रेम, सौंदर्य, विवाह, कला, सुख, परिष्कार।', positive: 'आकर्षण, कलात्मकता, समरसता, भक्ति, प्रेमपूर्ण संबंध।', challenge: 'भोग, अभिमान, सुख से आसक्ति, संबंधों में उलझन।', soul: 'भृगु के पुत्र, मृतसंजीवनी विद्या के धारक; आत्माओं को मधुरता की ओर खींचते हैं।' },
    Saturn: { title: 'न्यायाधीश', karaka: 'समय, कर्म, अनुशासन, आयु, श्रम, वैराग्य।', positive: 'सहनशीलता, सत्यनिष्ठा, परिश्रम से निपुणता, विनम्रता, न्याय।', challenge: 'विलंब, भय, बोझ, अकेलापन, दीर्घकालिक कष्ट।', soul: 'सूर्य और छाया के पुत्र; धीमे, न्यायप्रिय, सबसे सच्चे गुरु।' },
    Rahu: { title: 'लालसा की छाया', karaka: 'इच्छा, महत्वाकांक्षा, विदेशी वस्तुएँ, आसक्ति, आकस्मिक उत्थान।', positive: 'साहस, नवाचार, सांसारिक सफलता, सफलता की छलांग, अपरंपरागत प्रतिभा।', challenge: 'जुनून, चिंता, छल, अतृप्त भूख, भ्रम।', soul: 'अमृत चुराने वाला कटा शीश; जिसे आत्मा ने अभी नहीं साधा उसकी ओर खिंचाव।' },
    Ketu: { title: 'त्याग की छाया', karaka: 'वैराग्य, मोक्ष, पूर्व-दक्षता, अंतर्ज्ञान, अध्यात्म।', positive: 'अंतर्दृष्टि, आध्यात्मिक गहराई, दक्षता, विवेक, मुक्ति।', challenge: 'भ्रम, विरक्ति, आकस्मिक अंत, आत्म-संदेह।', soul: 'अंतर्मुखी कटा धड़; भूख के पार मुक्ति की ओर द्वार।' },
  },
  ne: {
    Sun: { title: 'आत्मा र राजा', karaka: 'आत्मा, ओज, पिता, अधिकार, आत्मविश्वास, स्वास्थ्य।', positive: 'गरिमामय आत्मविश्वास, नेतृत्व, इमानदारी, तेजस्वी स्वास्थ्य, उद्देश्यको स्पष्टता।', challenge: 'अहंकार, अधिकारीसँग टकराव, आत्म-मूल्यको कमी, पितासँग तनाव।', soul: 'सबैलाई धारण गर्ने निष्पक्ष प्रकाश, अदितिको द्वेषरहित पुत्रको प्रार्थनाबाट जन्मेको।' },
    Moon: { title: 'मन र माता', karaka: 'मन, भावना, माता, सुख, जनता, पोषण।', positive: 'भावनात्मक बुद्धि, अनुकूलनशीलता, हेरचाह, लोकप्रियता, स्थिर मन।', challenge: 'मनस्थितिमा उतारचढाव, अति-आसक्ति, बेचैनी, भावनात्मक निर्भरता।', soul: 'सती अनसूयामार्फत ब्रह्माको अवतार, कोमलता जसले भाग्यलाई पनि नरम बनाउँछ।' },
    Mars: { title: 'योद्धा', karaka: 'ऊर्जा, साहस, दाजुभाइ, भूमि, अनुशासन, प्रेरणा।', positive: 'साहस, पहल, रक्षक शक्ति, प्राविधिक सीप, निर्णायकता।', challenge: 'रिस, अधैर्य, द्वन्द्व, दुर्घटना, हतारपन।', soul: 'शिवको तप-तापबाट जन्मेका, पृथ्वीद्वारा पालित; अग्नि जसलाई अनुशासित गर्नुपर्छ।' },
    Mercury: { title: 'राजकुमार र दूत', karaka: 'बुद्धि, वाणी, व्यापार, विद्या, सञ्चार।', positive: 'चातुर्य, स्पष्ट अभिव्यक्ति, व्यावसायिक समझ, बहुमुखता, छिटो सिकाइ।', challenge: 'घबराहट, अति-विश्लेषण, सतहीपन, अनिर्णय।', soul: 'चन्द्रका पुत्र, मनकै प्रतिभाबाट जन्मेको बुद्धि।' },
    Jupiter: { title: 'गुरु', karaka: 'ज्ञान, धर्म, सन्तान, धन, गुरु, कृपा।', positive: 'ज्ञान, श्रद्धा, उदारता, रक्षा, सौभाग्य, मार्गदर्शन।', challenge: 'अति-आशावाद, अति, हठ, आत्मसन्तोष।', soul: 'अग्निद्वारा अंगिरस ऋषिलाई प्रदत्त; कुण्डलीको महान् रक्षक।' },
    Venus: { title: 'कवि', karaka: 'प्रेम, सौन्दर्य, विवाह, कला, सुख, परिष्कार।', positive: 'आकर्षण, कलात्मकता, समरसता, भक्ति, प्रेमपूर्ण सम्बन्ध।', challenge: 'भोग, अभिमान, सुखप्रति आसक्ति, सम्बन्धमा उलझन।', soul: 'भृगुका पुत्र, मृतसञ्जीवनी विद्याका धारक; आत्मालाई मधुरतातर्फ तान्छन्।' },
    Saturn: { title: 'न्यायाधीश', karaka: 'समय, कर्म, अनुशासन, आयु, श्रम, वैराग्य।', positive: 'सहनशीलता, इमानदारी, परिश्रमबाट निपुणता, विनम्रता, न्याय।', challenge: 'ढिलाइ, डर, बोझ, एक्लोपन, दीर्घकालीन कष्ट।', soul: 'सूर्य र छायाका पुत्र; ढिलो, न्यायप्रिय, सबैभन्दा साँचो गुरु।' },
    Rahu: { title: 'लालसाको छाया', karaka: 'इच्छा, महत्वाकांक्षा, विदेशी वस्तु, आसक्ति, आकस्मिक उत्थान।', positive: 'साहस, नवाचार, सांसारिक सफलता, सफलताको फड्को, अपरम्परागत प्रतिभा।', challenge: 'जुनून, चिन्ता, छल, अतृप्त भोक, भ्रम।', soul: 'अमृत चोर्ने कटेको टाउको; आत्माले नसाधेकोतर्फ तानिने।' },
    Ketu: { title: 'त्यागको छाया', karaka: 'वैराग्य, मोक्ष, पूर्व-दक्षता, अन्तर्ज्ञान, अध्यात्म।', positive: 'अन्तर्दृष्टि, आध्यात्मिक गहिराइ, दक्षता, विवेक, मुक्ति।', challenge: 'भ्रम, विरक्ति, आकस्मिक अन्त्य, आत्म-सन्देह।', soul: 'अन्तर्मुखी कटेको धड; भोकको पारि मुक्तितर्फको ढोका।' },
  },
};

// Short house meaning (title + a few significations) per language.
export const HOUSE_C: Record<Lang, Record<number, { title: string; sig: string }>> = {
  en: {
    1: { title: 'Self & Body', sig: 'body, appearance, vitality, identity' },
    2: { title: 'Wealth, Family & Speech', sig: 'wealth, family, speech, food' },
    3: { title: 'Courage & Effort', sig: 'courage, effort, siblings, skills' },
    4: { title: 'Home & Mother', sig: 'mother, home, property, inner happiness' },
    5: { title: 'Children & Intelligence', sig: 'children, creativity, intelligence, devotion' },
    6: { title: 'Conflict & Service', sig: 'enemies, disease, debt, service' },
    7: { title: 'Partnership & Marriage', sig: 'marriage, spouse, partnership' },
    8: { title: 'Longevity & Transformation', sig: 'longevity, sudden events, secrets, transformation' },
    9: { title: 'Dharma & Fortune', sig: 'dharma, wisdom, guru, fortune' },
    10: { title: 'Action & Profession', sig: 'profession, status, authority, public action' },
    11: { title: 'Gains & Fulfilment', sig: 'income, gains, networks, ambitions' },
    12: { title: 'Loss & Liberation', sig: 'expenditure, foreign lands, spirituality, liberation' },
  },
  hi: {
    1: { title: 'तन और शरीर', sig: 'शरीर, रूप, ओज, पहचान' },
    2: { title: 'धन, परिवार और वाणी', sig: 'धन, परिवार, वाणी, भोजन' },
    3: { title: 'साहस और प्रयास', sig: 'साहस, प्रयास, भाई-बहन, कौशल' },
    4: { title: 'घर और माता', sig: 'माता, घर, संपत्ति, आंतरिक सुख' },
    5: { title: 'संतान और बुद्धि', sig: 'संतान, सृजन, बुद्धि, भक्ति' },
    6: { title: 'शत्रु और सेवा', sig: 'शत्रु, रोग, ऋण, सेवा' },
    7: { title: 'साझेदारी और विवाह', sig: 'विवाह, जीवनसाथी, साझेदारी' },
    8: { title: 'आयु और परिवर्तन', sig: 'आयु, आकस्मिक घटनाएँ, रहस्य, रूपांतरण' },
    9: { title: 'धर्म और भाग्य', sig: 'धर्म, ज्ञान, गुरु, भाग्य' },
    10: { title: 'कर्म और व्यवसाय', sig: 'व्यवसाय, यश, अधिकार, सार्वजनिक कर्म' },
    11: { title: 'लाभ और पूर्ति', sig: 'आय, लाभ, संपर्क, महत्वाकांक्षा' },
    12: { title: 'हानि और मोक्ष', sig: 'व्यय, विदेश, अध्यात्म, मोक्ष' },
  },
  ne: {
    1: { title: 'तन र शरीर', sig: 'शरीर, रूप, ओज, पहिचान' },
    2: { title: 'धन, परिवार र वाणी', sig: 'धन, परिवार, वाणी, भोजन' },
    3: { title: 'साहस र प्रयास', sig: 'साहस, प्रयास, दाजुभाइ, सीप' },
    4: { title: 'घर र माता', sig: 'माता, घर, सम्पत्ति, आन्तरिक सुख' },
    5: { title: 'सन्तान र बुद्धि', sig: 'सन्तान, सृजना, बुद्धि, भक्ति' },
    6: { title: 'शत्रु र सेवा', sig: 'शत्रु, रोग, ऋण, सेवा' },
    7: { title: 'साझेदारी र विवाह', sig: 'विवाह, जीवनसाथी, साझेदारी' },
    8: { title: 'आयु र परिवर्तन', sig: 'आयु, आकस्मिक घटना, रहस्य, रूपान्तरण' },
    9: { title: 'धर्म र भाग्य', sig: 'धर्म, ज्ञान, गुरु, भाग्य' },
    10: { title: 'कर्म र व्यवसाय', sig: 'व्यवसाय, यश, अधिकार, सार्वजनिक कर्म' },
    11: { title: 'लाभ र पूर्ति', sig: 'आय, लाभ, सम्पर्क, महत्वाकांक्षा' },
    12: { title: 'हानि र मोक्ष', sig: 'व्यय, विदेश, अध्यात्म, मोक्ष' },
  },
};
