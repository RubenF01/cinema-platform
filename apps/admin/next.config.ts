import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cimena/ui", "@cimena/api-client"],
};

export default nextConfig;
