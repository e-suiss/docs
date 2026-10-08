import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // The suiss UI stories double as live previews; their Storybook imports resolve to stand-ins.
    resolveAlias: {
      "storybook/test": "./lib/storybook/test.ts",
      "@storybook/react-vite": "./lib/storybook/react-vite.ts",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
