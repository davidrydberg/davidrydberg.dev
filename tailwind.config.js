import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mirrors the CSS variables in src/index.css. Black, white, grey only.
        bg: '#ffffff',
        panel: '#ffffff',
        line: '#e6e6e6',
        ink: '#111111',
        dim: '#555555',
        faint: '#6b6b6b',
        accent: '#111111',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            '--tw-prose-body': theme('colors.ink'),
            '--tw-prose-headings': theme('colors.ink'),
            '--tw-prose-links': theme('colors.ink'),
            '--tw-prose-bold': theme('colors.ink'),
            '--tw-prose-code': theme('colors.ink'),
            '--tw-prose-pre-bg': '#f6f6f6',
            '--tw-prose-pre-code': theme('colors.ink'),
            '--tw-prose-hr': theme('colors.line'),
            '--tw-prose-quotes': theme('colors.dim'),
            '--tw-prose-quote-borders': theme('colors.line'),
            '--tw-prose-bullets': theme('colors.faint'),
            '--tw-prose-counters': theme('colors.faint'),
            fontFamily: theme('fontFamily.sans').join(', '),
            a: { textDecoration: 'underline', textUnderlineOffset: '3px' },
            'a:hover': { color: theme('colors.ink') },
            code: { fontWeight: '400' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            h2: { fontSize: '1.05rem', fontWeight: '500', letterSpacing: '-0.02em' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
