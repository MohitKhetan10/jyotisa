import { lazy, Suspense } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import BirthInput from './pages/BirthInput';
import Dashboard from './pages/Dashboard';
import { useT, LanguageToggle } from './i18n/lang';
import { ThemeToggle } from './theme/theme';
import Logo from './components/Logo';

// Analysis pages are lazy-loaded to keep the initial bundle light.
const BirthChart = lazy(() => import('./pages/BirthChart'));
const Houses = lazy(() => import('./pages/Houses'));
const Vargas = lazy(() => import('./pages/Vargas'));
const Dashas = lazy(() => import('./pages/Dashas'));
const YogasDoshas = lazy(() => import('./pages/YogasDoshas'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Life = lazy(() => import('./pages/Life'));
const Today = lazy(() => import('./pages/Today'));
const Panchanga = lazy(() => import('./pages/Panchanga'));
const Remedies = lazy(() => import('./pages/Remedies'));
const Compatibility = lazy(() => import('./pages/Compatibility'));
const Encyclopedia = lazy(() => import('./pages/Encyclopedia'));
const Methodology = lazy(() => import('./pages/Methodology'));

const NAV = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/chart', key: 'nav.chart' },
  { to: '/houses', key: 'nav.houses' },
  { to: '/analysis', key: 'nav.analysis' },
  { to: '/life', key: 'nav.life' },
  { to: '/vargas', key: 'nav.vargas' },
  { to: '/dashas', key: 'nav.dashas' },
  { to: '/yogas', key: 'nav.yogas' },
  { to: '/today', key: 'nav.today' },
  { to: '/panchanga', key: 'nav.panchanga' },
  { to: '/remedies', key: 'nav.remedies' },
  { to: '/match', key: 'nav.match' },
  { to: '/learn', key: 'nav.learn' },
];

function Header() {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-20 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-4 py-3">
          <NavLink to="/" className="flex shrink-0 items-center gap-2 font-serif text-lg tracking-wide text-saffron-600">
            <Logo />
            <span>Jyotiṣa</span>
          </NavLink>
          <nav className="flex flex-1 gap-1 overflow-x-auto text-sm">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                    isActive ? 'bg-saffron-500/12 text-saffron-600' : 'text-parchment-200/70 hover:text-parchment-100'
                  }`
                }
              >
                {t(n.key)}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-ink-700 px-4 py-6 text-center text-xs text-parchment-200/50">
      {t('footer.calc')}{' '}
      <NavLink to="/methodology" className="underline hover:text-saffron-600">{t('footer.how')}</NavLink>.{' '}
      {t('footer.note')}
    </footer>
  );
}

export default function App() {
  const { t } = useT();
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Suspense fallback={<p className="p-8 text-center text-parchment-200/50">{t('common.calculating')}</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/birth" element={<BirthInput />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chart" element={<BirthChart />} />
            <Route path="/houses" element={<Houses />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/life" element={<Life />} />
            <Route path="/vargas" element={<Vargas />} />
            <Route path="/dashas" element={<Dashas />} />
            <Route path="/yogas" element={<YogasDoshas />} />
            <Route path="/today" element={<Today />} />
            <Route path="/panchanga" element={<Panchanga />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/match" element={<Compatibility />} />
            <Route path="/learn" element={<Encyclopedia />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
