/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // Khi gọi /api-proxy/..., Next.js sẽ tự hiểu là gọi đến IP 113.164.80.153
        source: "/api-proxy/:path*",
        destination: "http://113.164.80.153:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
