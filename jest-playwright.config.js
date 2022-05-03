/** @type import("jest-playwright-preset").JestPlaywrightConfig */
const config = {
  launchOptions: { headless: true },
  browsers: ["chromium", "firefox"]
};

module.exports = config;
