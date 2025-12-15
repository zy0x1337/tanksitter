import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // Im Dev-Mode deaktivieren
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deine anderen Configs (z.B. images domain)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mqgunkcpqxigwgbzbpgu.supabase.co', // DEINE Supabase Domain hier anpassen!
      },
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));
