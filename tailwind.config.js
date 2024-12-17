/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: '#F66803', // Your primary color
      white: '#ffffff',    // White color
      black: '#000000',    // Black color
      gray: {
        50: '#f9fafb', // Lightest gray
        100: '#f3f4f6', 
        200: '#e5e7eb', 
        300: '#d1d5db', 
        400: '#9ca3af', 
        500: '#6b7280', // Default gray
        600: '#4b5563', 
        700: '#374151', 
        800: '#1f2937', 
        900: '#111827',  
      },
      blue: {
        50: '#eff6ff',
        600: '#3182ce',
      },
      green: {
        50: '#f0fff4',
        600: '#38a169',
      },
      yellow: {
        50: '#fefcbf',
        600: '#ecc94b',
      },
      purple: {
        50: '#f7e8ff',
        600: '#9b2c2c',
      },
      red: {
        50: '#fee2e2',
        600: '#e53e3e',
      },
    },
  },
  plugins: [],
}
