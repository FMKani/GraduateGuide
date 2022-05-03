/** @type import("next").NextConfig */
const config = {
  reactStrictMode: true,
  experimental: { outputStandalone: true },
  eslint: { dirs: ["src", "tests"] }
};

module.exports = config;
