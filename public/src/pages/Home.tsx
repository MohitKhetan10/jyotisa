import { Link } from 'react-router-dom';
import { useT } from '../i18n/lang';

export default function Home() {
  const { t } = useT();
  const points = [
    [t('home.p1t'), t('home.p1b')], [t('home.p2t'), t('home.p2b')],
    [t('home.p3t'), t('home.p3b')], [t('home.p4t'), t('home.p4b')],
  ];
  return (
    <div className="space-y-16">
      <section className="mx-auto max-w-2xl pt-10 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-saffron-600/90">
          {t('home.kicker')}
        </p>
        <h1 className="font-serif text-4xl leading-[1.15] text-parchment-100 sm:text-5xl">
          {t('home.h1a')} {t('home.h1b')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-parchment-200/80">{t('home.hero')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/birth" className="btn-primary">{t('common.cast')}</Link>
          <Link to="/learn" className="btn-ghost">{t('common.explore')}</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center font-serif text-2xl text-parchment-100">
          {t('home.pointsTitle')}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {points.map(([title, body]) => (
            <div key={title} className="card p-6">
              <h3 className="font-serif text-lg text-saffron-600">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-parchment-200/80">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
