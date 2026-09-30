// Chart state, birth details + computed chart, persisted to LocalStorage so a
// user's chart survives reloads. No server, no account. Birth data never leaves
// the browser.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BirthDetails, CalcSettings, RawChart } from '../types/chart';
import { computeChart } from '../engine/ephemeris/swiss';

interface ChartState {
  birth: BirthDetails | null;
  chart: RawChart | null;
  settings: CalcSettings;
  status: 'idle' | 'computing' | 'ready' | 'error';
  error: string | null;
  generate: (birth: BirthDetails) => Promise<void>;
  clear: () => void;
}

const DEFAULT_SETTINGS: CalcSettings = {
  ayanamsha: 'lahiri',
  houseSystem: 'whole-sign',
};

export const useChart = create<ChartState>()(
  persist(
    (set, get) => ({
      birth: null,
      chart: null,
      settings: DEFAULT_SETTINGS,
      status: 'idle',
      error: null,
      async generate(birth) {
        set({ status: 'computing', error: null, birth });
        try {
          const chart = await computeChart(birth, get().settings);
          set({ chart, status: 'ready' });
        } catch (e) {
          set({ status: 'error', error: (e as Error).message });
        }
      },
      clear() {
        set({ birth: null, chart: null, status: 'idle', error: null });
      },
    }),
    {
      name: 'vedic-astro-chart',
      // Persist only inputs + settings; the chart is recomputed deterministically.
      partialize: (s) => ({ birth: s.birth, settings: s.settings }),
    },
  ),
);
