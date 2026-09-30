import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { RawChart, BirthDetails } from '../types/chart';
import { useEnsuredChart } from '../hooks/useEnsuredChart';

/** Renders children only once a chart exists; otherwise shows a prompt/loader. */
export default function ChartGuard({
  children,
}: {
  children: (chart: RawChart, birth: BirthDetails) => ReactNode;
}) {
  const { birth, chart } = useEnsuredChart();
  if (!birth) {
    return (
      <div className="card p-8 text-center">
        <p className="text-parchment-200/70">No chart yet.</p>
        <Link to="/birth" className="btn-primary mt-4">Create your birth chart</Link>
      </div>
    );
  }
  if (!chart) return <p className="p-8 text-center text-parchment-200/60">Calculating…</p>;
  return <>{children(chart, birth)}</>;
}
