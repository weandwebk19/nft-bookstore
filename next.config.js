const { i18n } = require("./next-i18next.config");

/* eslint-disable prettier/prettier */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  staticPageGenerationTimeout: 100,
  devIndicators: {
    buildActivity: false
  },
  async rewrites() {
    return [
      {
        source: "/api/pinata/:path*",
        destination: "https://gateway.pinata.cloud/:path*"
      }
    ];
  },
  i18n,
  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  // react: { useSuspense: false }
  images: {
    domains: ["gateway.pinata.cloud", "res.cloudinary.com"]
  },

  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
