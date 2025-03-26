/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Partial Prerendering for incremental adoption
  experimental: {
    ppr: 'incremental',
    after: true,
    // Optimize bundling of external packages
    bundlePagesRouterDependencies: true,
    // Opt specific packages out of bundling if needed
    // serverExternalPackages: ['package-name'],
  },
};

export default nextConfig;

