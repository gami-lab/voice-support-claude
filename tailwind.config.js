/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Audiogami Brand Colors
        primary: '#F7AA01',        // Spicy Sweetcorn - CTAs, accents
        'rockman-blue': '#34A0ED', // links, interactive elements
        'chunky-bee': '#FDC64B',   // highlights, badges
        'joust-blue': '#51ADFB',   // hover states, decorative
        charcoal: '#1A1A1A',       // primary text
        slate: '#4A4A4A',          // secondary text
        silver: '#9CA3AF',         // placeholders
        'light-gray': '#E5E7EB',   // borders
        'off-white': '#F9FAFB',    // card backgrounds
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'audiogami': '8px',
      },
    },
  },
  plugins: [],
}
