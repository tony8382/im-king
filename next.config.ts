import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const isStatic = process.env.BUILD_MODE === "static";
const BASE_PATH = isStatic ? "/im-king" : "";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: isStatic ? "export" : undefined,
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  }, images: {
    unoptimized: isStatic,
  },
};

export default withPWA(nextConfig);
