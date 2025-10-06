const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const withNextIntl = require("next-intl/plugin")(
  "./src/i18n.ts"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@studentdeals/ui', '@studentdeals/types'],
  images: {
    domains: ["localhost"],
  },
};

module.exports = withNextIntl(withPWA(nextConfig));
