//tailwind css config file

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [

    //add more content here to expand
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customRed: "#cc4744",
        customGreen: "#1f883d",
        customBlue: "#333cfa",
      },
    },
  },
  plugins: [],
};
