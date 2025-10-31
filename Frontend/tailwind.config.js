// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");
const { mtConfig } = require("@material-tailwind/react");
module.exports = withMT(
 mtConfig({
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
         animationPlayState: ['hover', 'group-hover'],
        keyframes: {
          slideLeft: {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
        },
        animation: {
         
          slideLeft: "slideLeft 10s linear infinite",
        },
      },
    },
    plugins: [require("tailwindcss-animate"),
      function ({ addUtilities }) {
    addUtilities({
      ".animation-pause": { "animation-play-state": "paused" },
    }, ["responsive", "hover", "group-hover"]);
  },
    ],
  })
);

