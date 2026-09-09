import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Workbench palette: near-black ground, warm off-white ink, one green
        // accent. Tag colours live in index.css as CSS classes.
        bg: '#0c0d10',
        panel: '#131519',
        line: '#24272e',
        ink: '#e8e6e1',
        dim: '#8e929b',
        faint: '#5c606a',
        accent: '#8fe3a8',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            '--tw-prose-body': theme('colors.ink'),
            '--tw-prose-headings': theme('colors.ink'),
            '--tw-prose-links': theme('colors.accent'),
            '--tw-prose-bold': theme('colors.ink'),
            '--tw-prose-code': theme('colors.accent'),
            '--tw-prose-pre-bg': theme('colors.panel'),
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
          },
        },
      }),
    },
  },
  plugins: [typography],
};
