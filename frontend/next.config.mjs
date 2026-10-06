/** @type {import('next').NextConfig} */
const nextConfig = {
  // واجهة المنصة الكاملة ملف واحد في public/index.html؛ نعرضها على الرابط الرئيسي "/"
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/index.html" }] };
  },
};

export default nextConfig;
