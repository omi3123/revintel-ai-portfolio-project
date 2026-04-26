/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d8e6ff',
          200: '#b8d0ff',
          400: '#5c8dff',
          500: '#356dff',
          600: '#245bff',
          700: '#1948d8',
          900: '#102b75'
        },
        ink: '#0f172a',
        slateblue: '#13213f'
      },
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.08)',
        glow: '0 20px 60px rgba(53, 109, 255, 0.18)',
        panel: '0 30px 80px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,.18) 1px, transparent 0)',
        hero: 'linear-gradient(135deg, rgba(36,91,255,0.10), rgba(16,185,129,0.10) 48%, rgba(15,23,42,0.04))',
        panel: 'linear-gradient(160deg, rgba(15,23,42,0.96), rgba(30,41,59,0.95))'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      animation: {
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    }
  },
  plugins: []
};
