import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Foto produk diunggah admin ke Cloudinary, jadi `next/image` perlu izin
     * mengambil gambar dari sana. Dibatasi ke folder akun kita saja
     * (`/lkx4drmd/...`) supaya bukan endpoint publik terbuka untuk semua gambar.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/lkx4drmd/**",
      },
    ],
  },
};

export default nextConfig;
