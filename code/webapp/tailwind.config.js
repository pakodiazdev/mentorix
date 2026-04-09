/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mentorix: {
          primary: "#4F46E5",
          secondary: "#7C3AED",
          accent: "#06B6D4",
          dark: "#1E1B4B",
          light: "#EEF2FF",
        },
      },
    },
  },
  plugins: [],
};
