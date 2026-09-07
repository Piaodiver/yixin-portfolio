/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--paper)',
          sunk:    'var(--paper-sunk)',
          raise:   'var(--paper-raise)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          400: 'var(--ink-400)',
          300: 'var(--ink-300)',
          100: 'var(--ink-100)',
          50:  'var(--ink-050)',
        },
        wash: {
          indigo: 'var(--wash-indigo)',
          sage:   'var(--wash-sage)',
          ochre:  'var(--wash-ochre)',
          'sage-ink':  'var(--sage-ink)',
          'ochre-ink': 'var(--ochre-ink)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        label: '0.14em',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        ink: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
