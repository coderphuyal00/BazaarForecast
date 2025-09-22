import { Config } from "tailwindcss";

import { mtConfig } from "@material-tailwind/react";
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [],
  theme: {
    extend: {
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
  plugins: [],
});
