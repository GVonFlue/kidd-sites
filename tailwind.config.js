/** @type {import('tailwindcss').Config} */
// Phase 1 tokens. Values are sampled from the client's live sites — see
// Checkpoint 0 §5. Contrast-checked pairs are documented there; `accent` is a
// FILL colour only on light grounds (3.2:1), `accent-ink` is its text-safe form.
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1D1F',
        surface: '#FFFFFF',
        'surface-deep': '#16191B',
        wash: '#F2F3F3',
        line: '#DCDEDF',
        accent: '#C2832A',
        'accent-ink': '#8A5C13',
        'accent-lift': '#D9A648',
        copper: '#9A5F40',
      },
      fontFamily: {
        display: ['"Archivo Variable"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['13px', '1.4'], sm: ['15px', '1.5'], base: ['17px', '1.55'],
        lg: ['21px', '1.4'], xl: ['27px', '1.25'], '2xl': ['36px', '1.15'],
        '3xl': ['48px', '1.05'], '4xl': ['64px', '1.0'],
      },
      maxWidth: { prose: '68ch' },
      borderRadius: { pill: '999px', frame: '28px' },
    },
  },
  plugins: [],
};
