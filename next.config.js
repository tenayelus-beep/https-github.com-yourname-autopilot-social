/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    VIDEO_STORAGE_PATH: process.env.VIDEO_STORAGE_PATH,
  },
};

module.exports = nextConfig;
