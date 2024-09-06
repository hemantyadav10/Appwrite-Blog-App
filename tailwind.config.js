/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        customPulse: {
          '0%, 100%': {
            opacity: 0.8,
          },
          '50%': {
            opacity: 0.4,
          },
        },
        customSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        customPulse: 'customPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite ',
        customSpin: 'customSpin 0.6s linear infinite'
      },
    },
  },
  plugins: [],
}