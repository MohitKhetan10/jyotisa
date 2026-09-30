// Per-varga interpretation, language-aware (EN/HI/NE). Reads the varga's
// ascendant, its dignified/weak planets and vargottama, and ties them to the
// varga's domain. Traditional, not deterministic.
import type { RawChart } from '../../types/chart';
import { buildVarga, isVargottama, type VargaId } from '../varga/varga';
import { STRINGS, type Lang } from '../../i18n/strings';

const pn = (lang: Lang, id: string) => STRINGS[lang][`pl.${id}`] ?? id;
const sn = (lang: Lang, s: string) => STRINGS[lang][`sn.${s}`] ?? s;

const SIGN_Q: Record<Lang, string[]> = {
  en: ['bold and pioneering', 'steady and resourceful', 'versatile and communicative', 'nurturing and sensitive', 'dignified and expressive', 'analytical and service-minded', 'harmonious and relational', 'intense and transformative', 'expansive and principled', 'disciplined and enduring', 'unconventional and humane', 'compassionate and imaginative'],
  hi: ['साहसी और अग्रणी', 'स्थिर और साधन-संपन्न', 'बहुमुखी और संवादशील', 'पोषक और संवेदनशील', 'गरिमामय और अभिव्यक्तिपूर्ण', 'विश्लेषणात्मक और सेवाभावी', 'सामंजस्यपूर्ण और संबंधपरक', 'तीव्र और परिवर्तनकारी', 'विस्तृत और सिद्धांतनिष्ठ', 'अनुशासित और सहनशील', 'अपरंपरागत और मानवीय', 'करुणामय और कल्पनाशील'],
  ne: ['साहसी र अग्रणी', 'स्थिर र साधनसम्पन्न', 'बहुमुखी र संवादशील', 'पोषक र संवेदनशील', 'गरिमामय र अभिव्यक्तिपूर्ण', 'विश्लेषणात्मक र सेवाभावी', 'सामंजस्यपूर्ण र सम्बन्धपरक', 'तीव्र र परिवर्तनकारी', 'विस्तृत र सिद्धान्तनिष्ठ', 'अनुशासित र सहनशील', 'अपरम्परागत र मानवीय', 'करुणामय र कल्पनाशील'],
};

// Localised varga purpose lines, keyed by VargaId.
const PURPOSE: Record<Lang, Record<VargaId, string>> = {
  en: { D1: 'the body and overall life', D2: 'wealth and resources', D3: 'siblings, courage and effort', D4: 'home, property and fortune', D7: 'children and progeny', D9: 'marriage, dharma and the inner strength of every planet', D10: 'career and public action', D12: 'parents and ancestry', D16: 'vehicles and comforts', D20: 'spiritual practice and worship', D24: 'education and learning', D27: 'strengths and stamina', D30: 'misfortunes and moral fibre', D40: 'matrilineal effects', D45: 'character and patrilineal effects', D60: 'deep karmic totality' },
  hi: { D1: 'शरीर और समग्र जीवन', D2: 'धन और संसाधन', D3: 'भाई-बहन, साहस और प्रयास', D4: 'घर, संपत्ति और भाग्य', D7: 'संतान', D9: 'विवाह, धर्म और प्रत्येक ग्रह का आंतरिक बल', D10: 'करियर और सार्वजनिक कर्म', D12: 'माता-पिता और वंश', D16: 'वाहन और सुख', D20: 'आध्यात्मिक साधना और उपासना', D24: 'शिक्षा और विद्या', D27: 'बल और सहनशक्ति', D30: 'दुर्भाग्य और चरित्र', D40: 'मातृ-पक्ष के प्रभाव', D45: 'चरित्र और पितृ-पक्ष के प्रभाव', D60: 'गहन कार्मिक समग्रता' },
  ne: { D1: 'शरीर र समग्र जीवन', D2: 'धन र स्रोत', D3: 'दाजुभाइ, साहस र प्रयास', D4: 'घर, सम्पत्ति र भाग्य', D7: 'सन्तान', D9: 'विवाह, धर्म र प्रत्येक ग्रहको आन्तरिक बल', D10: 'करियर र सार्वजनिक कर्म', D12: 'आमाबुबा र वंश', D16: 'सवारी र सुख', D20: 'आध्यात्मिक साधना र उपासना', D24: 'शिक्षा र विद्या', D27: 'बल र सहनशक्ति', D30: 'दुर्भाग्य र चरित्र', D40: 'मातृ-पक्षका प्रभाव', D45: 'चरित्र र पितृ-पक्षका प्रभाव', D60: 'गहन कार्मिक समग्रता' },
};

export interface VargaReading { id: VargaId; text: string; }

export function interpretVarga(id: VargaId, chart: RawChart, lang: Lang = 'en'): VargaReading {
  const v = buildVarga(id, chart);
  const strong = v.planets.filter((p) => p.dignity === 'exalted' || p.dignity === 'own');
  const weak = v.planets.filter((p) => p.dignity === 'debilitated');
  const vargottama = v.planets.filter((p) =>
    isVargottama(chart.planets.find((x) => x.planet === p.planet)!.longitude));
  const quality = SIGN_Q[lang][v.ascSignIndex];
  const asc = sn(lang, v.ascSign);
  const purpose = PURPOSE[lang][id];
  const P = (s: string) => pn(lang, s);
  const S = (s: string) => sn(lang, s);

  const parts: string[] = [];
  if (lang === 'hi') {
    parts.push(`${purpose} के लिए पढ़ा जाता है। ${v.meta.name} लग्न ${asc} है, जो इस जीवन-क्षेत्र को ${quality} स्वर देता है।`);
    if (strong.length) parts.push(`यहाँ शक्ति: ${strong.map((p) => `${P(p.planet)} (${S(p.sign)} में ${p.dignity === 'exalted' ? 'उच्च' : 'स्वराशि'})`).join(', ')}, ये इस चार्ट के विषयों को अच्छी तरह सहारा देते हैं।`);
    if (weak.length) parts.push(`सचेत ध्यान चाहिए: ${weak.map((p) => `${P(p.planet)} (${S(p.sign)} में नीच)`).join(', ')}, परंपरागत रूप से प्रयास और उपाय से सशक्त करने का क्षेत्र, कोई स्थायी दोष नहीं।`);
    if (id === 'D9' && vargottama.length) parts.push(`वर्गोत्तम: ${vargottama.map((p) => P(p.planet)).join(', ')}, दबाव में टिकने वाली स्थिरता और आंतरिक बल का चिह्न।`);
    if (!strong.length && !weak.length) parts.push('कोई ग्रह उच्च या नीच नहीं, यह चार्ट भाव-स्वामित्व और स्थितियों से कार्य करता है।');
  } else if (lang === 'ne') {
    parts.push(`${purpose} का लागि पढिन्छ। ${v.meta.name} लग्न ${asc} हो, जसले यस जीवन-क्षेत्रलाई ${quality} स्वर दिन्छ।`);
    if (strong.length) parts.push(`यहाँ शक्ति: ${strong.map((p) => `${P(p.planet)} (${S(p.sign)} मा ${p.dignity === 'exalted' ? 'उच्च' : 'स्वराशि'})`).join(', ')}, यीले यस चार्टका विषयलाई राम्ररी सहारा दिन्छन्।`);
    if (weak.length) parts.push(`सचेत ध्यान चाहिन्छ: ${weak.map((p) => `${P(p.planet)} (${S(p.sign)} मा नीच)`).join(', ')}, परम्परागत रूपमा प्रयास र उपायले सशक्त पार्ने क्षेत्र, कुनै स्थायी दोष होइन।`);
    if (id === 'D9' && vargottama.length) parts.push(`वर्गोत्तम: ${vargottama.map((p) => P(p.planet)).join(', ')}, दबाबमा टिक्ने स्थिरता र आन्तरिक बलको चिन्ह।`);
    if (!strong.length && !weak.length) parts.push('कुनै ग्रह उच्च वा नीच छैन, यो चार्ट भाव-स्वामित्व र स्थितिबाट काम गर्छ।');
  } else {
    parts.push(`Read for ${purpose}. The ${v.meta.name} ascendant is ${asc}, giving this area of life a ${quality} tone.`);
    if (strong.length) parts.push(`Strength here: ${strong.map((p) => `${P(p.planet)} (${p.dignity} in ${S(p.sign)})`).join(', ')}, these support the matters of this chart well.`);
    if (weak.length) parts.push(`Needs conscious care: ${weak.map((p) => `${P(p.planet)} (debilitated in ${S(p.sign)})`).join(', ')}, an area to strengthen through effort and remedy, not a fixed flaw.`);
    if (id === 'D9' && vargottama.length) parts.push(`Vargottama: ${vargottama.map((p) => P(p.planet)).join(', ')}, a mark of consistency and inner strength that holds under pressure.`);
    if (!strong.length && !weak.length) parts.push('No planet is exalted or debilitated here; the chart works through house lordships and placements.');
  }
  return { id, text: parts.join(' ') };
}
