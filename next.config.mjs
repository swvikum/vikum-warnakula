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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-syntax-highlighter/styles/prism": "react-syntax-highlighter/dist/styles/monokai",
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "react-syntax-highlighter/styles/prism": "react-syntax-highlighter/dist/styles/monokai",
    },
  },
};

export default nextConfig;