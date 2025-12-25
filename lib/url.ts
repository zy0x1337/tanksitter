export function getBaseUrl() {
  // Prod-URL manuell gesetzt
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) return site.replace(/\/$/, '');
  // Vercel Preview Fallback
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, '');
  // Lokal
  return 'http://localhost:3000';
}
