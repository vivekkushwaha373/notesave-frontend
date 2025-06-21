// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    // Add these for stability
    darkMode: 'class', // or 'media' if you prefer
    important: false, // Don't make everything !important
  }