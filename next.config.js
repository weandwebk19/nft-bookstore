const { i18n } = require("./next-i18next.config");

/* eslint-disable prettier/prettier */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://gateway.pinata.cloud/:path*"
      }
    ];
  },
  i18n,
  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  }
  // react: { useSuspense: false }
};

module.exports = nextConfig;
