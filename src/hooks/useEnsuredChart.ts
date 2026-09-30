import { useEffect } from 'react';
import { useChart } from '../store/chart';

/** Ensures the chart is computed (recomputes from persisted inputs on reload). */
export function useEnsuredChart() {
  const { birth, chart, status, generate } = useChart();
  useEffect(() => {
    if (birth && !chart && status === 'idle') void generate(birth);
  }, [birth, chart, status, generate]);
  return { birth, chart, status };
}
