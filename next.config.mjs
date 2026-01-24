/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Luôn giữ dòng này để tối ưu RAM 2GB
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        // Sử dụng biến môi trường SCADA_API_URL
        destination: `${process.env.SCADA_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
