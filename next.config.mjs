import createNextIntlPlugin from 'next-intl/plugin';

// KEIN Pfad-Argument! Wir verlassen uns auf die Standard-Suche.
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
