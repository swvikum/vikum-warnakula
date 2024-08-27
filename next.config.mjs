/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vikumwarnakula.com",
        port: "", // optional
        pathname: "/**", // optional
      },
    ],
  },
};

export default nextConfig;