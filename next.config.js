/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  env: {
    ALCHEMY_URL: process.env.ALCHEMY_URL,
    ADMIN_WALLET: process.env.ADMIN_WALLET,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN
  }
};

module.exports = nextConfig;
