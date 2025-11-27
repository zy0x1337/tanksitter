import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/language-switcher'

// Auch hier definieren wir den Typ korrekt, auch wenn wir params nicht direkt nutzen
export default function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const t = useTranslations('Index');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4">
      <div className="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
      <div className="text-center max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-blue-950 sm:text-7xl">
            {t('title')}
          </h1>
          <p className="text-xl text-blue-600/80 font-medium">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 rounded-full">
              {t('start_button')}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
