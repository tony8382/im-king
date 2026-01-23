import type { NextConfig } from "next";

const isStatic = process.env.BUILD_MODE === "static";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: isStatic ? "export" : undefined,
  images: {
    unoptimized: isStatic,
  },
};

export default nextConfig;
