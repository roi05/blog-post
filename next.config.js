/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');

const nextConfig = {
  // ...existing Next.js configuration...
  webpack: (config, { isServer }) => {
    if (isServer) {
      execSync('npx prisma generate');
    }

    return config;
  },
};

module.exports = nextConfig;
