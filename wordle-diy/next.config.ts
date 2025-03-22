import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wordle",
  trailingSlash: true,
};

export default nextConfig;
