/** @type {import('tailwindcss').Config} */

// Every colour is driven by a CSS variable (space-separated RGB channels) so a
// single `.dark` class on <html> re-themes the whole app. Token *names* stay
// stable and semantic across the codebase:
//   "ink"       = surfaces (page / cards / inputs / borders)
//   "parchment" = text (headings & body)
//   "saffron"   = primary accent (terracotta in light, gold in dark)
//   "lotus"     = caution rose,  "clay" = positive green
// The actual values live in src/index.css under :root (light) and .dark.
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: v('--ink-950'),
          900: v('--ink-900'),
          800: v('--ink-800'),
          700: v('--ink-700'),
          600: v('--ink-600'),
        },
        parchment: {
          50: v('--parchment-50'),
          100: v('--parchment-100'),
          200: v('--parchment-200'),
        },
        saffron: {
          400: v('--saffron-400'),
          500: v('--saffron-500'),
          600: v('--saffron-600'),
        },
        lotus: {
          400: v('--lotus-400'),
          500: v('--lotus-500'),
        },
        clay: {
          300: v('--clay-300'),
          400: v('--clay-400'),
          500: v('--clay-500'),
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
