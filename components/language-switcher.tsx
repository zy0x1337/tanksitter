'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation' // Achtung: next/navigation, nicht next-intl/navigation bei App Router oft tricky
import { ChangeEvent, useTransition } from 'react'
import { Button } from '@/components/ui/button'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggleLanguage = () => {
    const nextLocale = locale === 'de' ? 'en' : 'de'
    
    // Pfad manipulieren: /de/dashboard -> /en/dashboard
    // Wir ersetzen einfach das erste Segment
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`)
    
    startTransition(() => {
      router.replace(newPath)
    })
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      disabled={isPending}
      className="font-semibold text-gray-500 hover:text-blue-600"
    >
      {locale === 'de' ? 'EN' : 'DE'}
    </Button>
  )
}
