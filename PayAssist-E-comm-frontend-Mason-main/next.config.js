/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained .next/standalone (minimal traced node_modules) so the
  // Docker runner ships only what's used — no full production node_modules copy.
  output: "standalone",
  images: {
    // The storefront currently renders plain <img>; this allow-list is kept for
    // any future migration to next/image.
    remotePatterns: [
      // Seeded catalogue imagery.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      // Admin-dashboard uploads / legacy backend image conventions.
      { protocol: "https", hostname: "i.ibb.co", pathname: "**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
    ],
  },
};

module.exports = nextConfig;
