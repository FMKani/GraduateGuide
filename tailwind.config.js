// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("./src/common/utils/colors");

module.exports = {
  content: ["src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "sans-serif"] },
      colors
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
