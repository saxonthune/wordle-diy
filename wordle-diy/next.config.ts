import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wordle",
  assetPrefix: "/wordle/",
  distDir: "/out/wordle",
  trailingSlash: true,
};

export default nextConfig;
