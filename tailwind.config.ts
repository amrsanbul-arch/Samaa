import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#04060c',
          900: '#070b14',
          800: '#0c1220',
          700: '#141c2f',
        },
        sand: {
          100: '#fdf6e9',
          200: '#f7e7c6',
          300: '#eccf9b',
          400: '#dcae63',
          500: '#c9903c',
        },
        sky: {
          300: '#9fd8ff',
          400: '#6cc2ff',
          500: '#3fa9f5',
        },
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
        display: ['var(--font-tajawal)', 'var(--font-cairo)', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 24px 80px -24px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255,255,255,0.08)',
        glow: '0 0 40px -8px rgba(108, 194, 255, 0.55)',
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
        kenburns: {
          '0%': { transform: 'scale(1.05) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.16) translate3d(-1.5%, -1%, 0)' },
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
        kenburns: 'kenburns 28s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
