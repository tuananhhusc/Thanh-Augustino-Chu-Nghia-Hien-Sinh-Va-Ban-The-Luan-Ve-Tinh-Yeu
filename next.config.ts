import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', // Required for GitHub Pages
  basePath: isProd ? '/Thanh-Augustino-Chu-Nghia-Hien-Sinh-Va-Ban-The-Luan-Ve-Tinh-Yeu' : '',
  images: {
    unoptimized: true, // Required for static export
  }
};

export default nextConfig;
