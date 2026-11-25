import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        scrim: 'rgb(var(--scrim-rgb) / <alpha-value>)',
        cream: 'rgb(var(--cream-rgb) / <alpha-value>)',
        panel: 'rgb(var(--panel-rgb) / <alpha-value>)',
        extra: 'rgb(var(--extra-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        sheetUp: {
          from: { opacity: '0', transform: 'translateY(48px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1.03) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.1) translate3d(-1%, -0.5%, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        fadeIn: 'fadeIn 0.6s ease-out both',
        fadeOut: 'fadeOut 0.6s ease-in both',
        sheetUp: 'sheetUp 0.55s cubic-bezier(0.16,1,0.3,1) both',
        kenburns: 'kenburns 28s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
