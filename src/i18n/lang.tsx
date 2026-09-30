import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { STRINGS, LANGS, type Lang } from './strings';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  /** Localise a planet name (e.g. "Sun" → "सूर्य"). */
  tp: (name: string) => string;
  /** Localise a sign name (e.g. "Aries" → "मेष"). */
  ts: (name: string) => string;
}
const LangContext = createContext<Ctx>({
  lang: 'en', setLang: () => {}, t: (k) => k, tp: (n) => n, ts: (n) => n,
});

const KEY = 'vedic-astro-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(KEY) as Lang | null;
    return saved && STRINGS[saved] ? saved : 'en';
  });
  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  const tp = (name: string) => t(`pl.${name}`) === `pl.${name}` ? name : t(`pl.${name}`);
  const ts = (name: string) => t(`sn.${name}`) === `sn.${name}` ? name : t(`sn.${name}`);
  return <LangContext.Provider value={{ lang, setLang: setLangState, t, tp, ts }}>{children}</LangContext.Provider>;
}

export const useT = () => useContext(LangContext);

export function LanguageToggle() {
  const { lang, setLang } = useT();
  return (
    <div className="flex shrink-0 overflow-hidden rounded-full border border-ink-600 text-xs">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2.5 py-1 transition ${
            lang === l.code ? 'bg-saffron-500 text-ink-950' : 'text-parchment-200/70 hover:bg-ink-800'
          }`}
          aria-pressed={lang === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
