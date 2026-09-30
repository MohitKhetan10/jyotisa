/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, hand-crafted palette. Token names kept stable across the app;
        // "ink" = warm surfaces (light), "parchment" = burgundy ink (text),
        // "saffron" = terracotta accent, "lotus" = deep rose for cautions.
        ink: {
          950: '#faf6f0', // page background (cream)
          900: '#fffdfa', // card
          800: '#f3e9dd', // inputs / hover
          700: '#e7d8c6', // border
          600: '#d8c3ad', // stronger border
        },
        parchment: {
          50: '#3d1210',
          100: '#4a1512', // primary text & headings (deep burgundy)
          200: '#6b3b34', // muted body text
        },
        saffron: {
          400: '#d14a3f',
          500: '#c82a21', // primary terracotta
          600: '#a8231b',
        },
        lotus: {
          400: '#9c3a55',
          500: '#7e2e44',
        },
        clay: {
          300: '#8a9b68', // muted olive for "positive/strong" (warm-friendly green)
          400: '#7a8b5a',
          500: '#5f6f42',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
