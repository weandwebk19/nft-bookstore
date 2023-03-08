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
        source: "/api/pinata/:path*",
        destination: "https://gateway.pinata.cloud/:path*"
      }
    ];
  }
};

module.exports = nextConfig;
