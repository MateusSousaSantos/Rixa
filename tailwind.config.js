/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'koulen': ['Koulen', 'cursive'],
        'nunito': ['Nunito Sans', 'sans-serif'],
        'sans': ['Nunito Sans', 'system-ui', 'sans-serif'], // Set as default sans font
      },
      colors: {
        'rixa': {
          'dark': '#003049',
          'dark-shadow': '#001d2e',
          'blue': '#669BBC',
          'cream': '#FCF6F5FF',
          'red': '#D62828',
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}