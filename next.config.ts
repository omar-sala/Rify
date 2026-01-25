import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // الـ Hostname ده بيغطي كل مشاريع سوبابيز
        hostname: '**.supabase.co',
      },
    ],
  },
}

export default nextConfig
