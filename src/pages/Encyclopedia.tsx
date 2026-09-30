import { useMemo, useState } from 'react';
import { GLOSSARY } from '../data/glossary';
import { PLANETS } from '../data/planets';
import { HOUSES } from '../data/houses';
import { NAKSHATRA_DATA } from '../data/nakshatras';
import { VARGAS } from '../engine/varga/varga';
import { useT } from '../i18n/lang';
import { PLANET_C, HOUSE_C } from '../i18n/content';
import { getNakshatra } from '../i18n/nakshatraContent';
import type { Lang } from '../i18n/strings';
import type { PlanetId } from '../types/chart';

interface Entry { term: string; category: string; text: string; }

// nakshatra description connective words per language
const NW: Record<Lang, { deity: string; lord: string; symbol: string; gana: string; yoni: string; nadi: string; str: string; chal: string }> = {
  en: { deity: 'Deity', lord: 'lord', symbol: 'symbol', gana: 'gaṇa', yoni: 'yoni', nadi: 'nāḍī', str: 'Strengths', chal: 'Challenges' },
  hi: { deity: 'देवता', lord: 'स्वामी', symbol: 'चिह्न', gana: 'गण', yoni: 'योनि', nadi: 'नाड़ी', str: 'शक्तियाँ', chal: 'चुनौतियाँ' },
  ne: { deity: 'देवता', lord: 'स्वामी', symbol: 'चिन्ह', gana: 'गण', yoni: 'योनि', nadi: 'नाडी', str: 'शक्तिहरू', chal: 'चुनौतीहरू' },
};

function buildEntries(lang: Lang, tp: (s: string) => string): Entry[] {
  const cP = PLANET_C[lang];
  const nwl = NW[lang];
  return [
    ...GLOSSARY, // core concepts remain in English (glossary is a later wave)
    ...(Object.keys(PLANETS) as PlanetId[]).map((id) => ({
      term: tp(id), category: 'Planet',
      text: `${cP[id].title}. ${cP[id].karaka} ${cP[id].positive} ${cP[id].challenge} ${cP[id].soul}`,
    })),
    ...HOUSES.map((h) => ({
      term: `${h.house} · ${HOUSE_C[lang][h.house].title}`, category: 'House',
      text: `${HOUSE_C[lang][h.house].sig}. (${h.sanskrit.join(', ')})`,
    })),
    ...NAKSHATRA_DATA.map((n) => {
      const k = getNakshatra(n.index, lang);
      return {
        term: k.name, category: 'Nakshatra',
        text: `${nwl.deity} ${k.deity}, ${nwl.lord} ${tp(n.lord)}, ${nwl.symbol} ${k.symbol}, ${k.gana} ${nwl.gana}, ${k.yoni} ${nwl.yoni}, ${k.nadi} ${nwl.nadi}. ${nwl.str}: ${k.strengths} ${nwl.chal}: ${k.challenges}`,
      };
    }),
    ...VARGAS.map((v) => ({ term: `${v.id} · ${v.name}`, category: 'Varga', text: `${v.sanskrit}. ${v.purpose}` })),
  ];
}

const CATS = ['All', 'Concept', 'Planet', 'House', 'Nakshatra', 'Varga', 'Calculation', 'Timing', 'Charts', 'Dignity', 'Houses'];

export default function Encyclopedia() {
  const { t, tp, lang } = useT();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const all = useMemo(() => buildEntries(lang, tp), [lang, tp]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return all.filter((e) =>
      (cat === 'All' || e.category === cat) &&
      (!s || e.term.toLowerCase().includes(s) || e.text.toLowerCase().includes(s)),
    );
  }, [q, cat, all]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-parchment-100">{t('p.learn.t')}</h1>
        <p className="mt-1 text-sm text-parchment-200/70">{t('p.learn.s')}</p>
      </div>
      <input className="field" placeholder="Search… e.g. navamsa, Saturn, 7th house"
             value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-lg px-2.5 py-1 text-xs ${cat === c ? 'bg-saffron-500 text-ink-950' : 'bg-ink-800 text-parchment-200/70 hover:bg-ink-700'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {results.map((e, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-saffron-600">{e.term}</h3>
              <span className="text-[10px] uppercase tracking-wide text-parchment-200/40">{e.category}</span>
            </div>
            <p className="mt-1 text-sm text-parchment-200/75">{e.text}</p>
          </div>
        ))}
        {results.length === 0 && <p className="text-sm text-parchment-200/50">No matches.</p>}
      </div>
    </div>
  );
}
