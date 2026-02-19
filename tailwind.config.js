/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F29F05',
          light: '#F7B733',
          dark: '#C97F04',
          hover: '#E28F05',
          active: '#B86F03',
          foreground: '#fefce8', // text on primary
        },
        secondary: {
          DEFAULT: '#003B6B',
          light: '#1A5A8A',
          dark: '#002A4D',
          hover: '#004A84',
          active: '#001F3A',
          foreground: '#FFFFFF',
        },
        background: {
          DEFAULT: '#F8FAFC', // mainBg (light mode)
          light: '#FFFFFF',
          soft: '#E1EDF9', // bgLight
          dark: '#0F172A', // dark mode main background
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F1F5F9',
          dark: '#1E293B', // cards in dark mode
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}