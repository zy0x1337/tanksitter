import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function LegalLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-100 px-4 h-16 flex items-center">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <Link href={`/${locale}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
              <ArrowLeft size={16} /> Back
            </Button>
          </Link>
          <span className="font-bold text-slate-900">TankSitter Legal</span>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          {children}
        </div>
      </main>
      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} TankSitter
      </footer>
    </div>
  )
}
