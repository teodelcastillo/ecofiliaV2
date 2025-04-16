/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.resolve.alias["pdfjs-dist/build/pdf"] = "pdfjs-dist/legacy/build/pdf";
      return config;
    },
  };
  
  module.exports = nextConfig;
  