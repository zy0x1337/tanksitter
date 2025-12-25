'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTransition } from 'react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleCreate = (newLocale: string) => {
    startTransition(() => {
      // router.replace tauscht das Locale im aktuellen Pfad aus
      router.replace(pathname, { locale: newLocale })
      router.refresh()
    })
  }

  return (
    <Select defaultValue={locale} onValueChange={handleCreate} disabled={isPending}>
      <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm border-muted">
        <SelectValue placeholder="Sprache" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
        <SelectItem value="en">🇺🇸 English</SelectItem>
      </SelectContent>
    </Select>
  )
}
