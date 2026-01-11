/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. "Content" tells Tailwind which files to scan for class names.
  // We want it to look at our HTML in 'public' and our logic in 'src' and 'server.js'.
  content: ["./public/**/*.html", "./src/**/*.{js,ts,jsx,tsx}", "./server.js"],

  theme: {
    // 2. "Extend" lets you add custom colors/fonts WITHOUT breaking the default Tailwind ones.
    extend: {
      colors: {
        brand: {
          light: "#3b82f6", // A nice bright blue
          dark: "#1e3a8a", // A deep professional navy
        },
      },
      // This adds a cool "glow" effect we can use for our buttons
      boxShadow: {
        glow: "0 0 15px -3px rgba(59, 130, 246, 0.5)",
      },
    },
  },

  // 3. Plugins are for extra features (like fancy forms or typography),
  // we'll keep this empty for now to keep it simple.
  plugins: [],
};
