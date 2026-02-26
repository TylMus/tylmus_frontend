/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'Arial', 'sans-serif'],
      },
      colors: {
        // Custom colors for category blocks
        category: {
          yellow: '#ffcc95',
          green: '#aef8cb',
          blue: '#b6ceff',
          purple: '#e0ceff',
        },
      },
      animation: {
        'scramble': 'scramble 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-down': 'slideDown 0.3s ease',
      },
      keyframes: {
        scramble: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-3px)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}