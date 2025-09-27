/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use remotePatterns to specify allowed external image domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "th.bing.com",
        port: "",
        pathname: "/**", // Allows any path on this domain
      },
      // You can add other domains here in the future
      // For example, if you use Cloudinary:
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      // },
    ],
  },
};

export default nextConfig;
