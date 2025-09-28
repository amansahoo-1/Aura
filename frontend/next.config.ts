/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // this are temporary, will move to cloudinary later
    // Use remotePatterns to specify allowed external image domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "th.bing.com",
        port: "",
        pathname: "/**", // Allows any path on this domain
      },
      {
        protocol: "https",
        hostname: "www.caratlane.com",
        port: "",
        pathname: "/**",
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
