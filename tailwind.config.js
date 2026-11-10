import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mirrors the CSS variables in src/index.css. Dark ground, one lime accent.
        bg: '#0a0b0a',
        panel: '#0e100c',
        line: '#262a20',
        ink: '#ecefe6',
        dim: '#d5d9cb',
        faint: '#8b9080',
        accent: '#c8ff2e',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            '--tw-prose-body': theme('colors.dim'),
            '--tw-prose-headings': theme('colors.ink'),
            '--tw-prose-links': theme('colors.ink'),
            '--tw-prose-bold': theme('colors.ink'),
            '--tw-prose-code': theme('colors.ink'),
            '--tw-prose-pre-bg': theme('colors.panel'),
            '--tw-prose-pre-code': theme('colors.ink'),
            '--tw-prose-hr': theme('colors.line'),
            '--tw-prose-quotes': theme('colors.dim'),
            '--tw-prose-quote-borders': theme('colors.line'),
            '--tw-prose-bullets': theme('colors.faint'),
            '--tw-prose-counters': theme('colors.faint'),
            fontFamily: theme('fontFamily.sans').join(', '),
            a: { textDecoration: 'underline', textUnderlineOffset: '3px' },
            'a:hover': { color: theme('colors.accent') },
            code: { fontWeight: '400' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            h2: {
              fontFamily: '"Space Grotesk", Inter, system-ui, sans-serif',
              fontSize: '1.5rem',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              lineHeight: '1.2',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
