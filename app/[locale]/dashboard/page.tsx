import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { CreateTankDialog } from '@/components/create-tank-dialog'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Trash2 } from 'lucide-react' // Falls du lucide-react installiert hast, sonst installier es: npm install lucide-react
import { deleteTank } from '@/actions/tanks'
import { Button } from '@/components/ui/button'

// Helper Component für den Löschen-Button (muss Client sein für onClick, oder wir nutzen Form)
function DeleteButton({ id }: { id: string }) {
  return (
    <form action={async () => {
      'use server'
      await deleteTank(id)
    }}>
      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="h-5 w-5" />
      </Button>
    </form>
  )
}

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Dashboard')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Tanks laden
  const { data: tanks } = await supabase
    .from('tanks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('welcome', { email: user.email?.split('@')[0] ?? 'User' })}
            </h1>
            <p className="text-gray-500 mt-2">{t('your_tanks')}</p>
          </div>
          <CreateTankDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tank Liste */}
          {tanks?.map((tank) => (
            <div key={tank.id} className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden flex flex-col">
              
              {/* Card Header */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                  🐠
                </div>
                <DeleteButton id={tank.id} />
              </div>

              {/* Card Body */}
              <div className="px-6 pb-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{tank.name}</h3>
                <p className="text-sm text-gray-500">
                  {/* Hier könnte später stehen: "3 Aufgaben fällig" */}
                  Alles ruhig.
                </p>
              </div>

              {/* Card Footer (Action) */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 group-hover:bg-blue-50/50 transition-colors">
                <Link 
                  href={`/dashboard/${tank.id}`} 
                  className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Verwalten & Aufgaben →
                </Link>
              </div>
            </div>
          ))}

                    {/* Empty State */}
          {(!tanks || tanks.length === 0) && (
            <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white rounded-3xl border-2 border-dashed border-blue-200 shadow-sm">
              <div className="bg-blue-50 p-6 rounded-full mb-6 animate-in zoom-in duration-500">
                <span className="text-5xl">🐠</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Willkommen bei TankSitter!
              </h3>
              
              <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                Dein Dashboard ist noch leer. Erstelle jetzt dein erstes Aquarium, 
                um den <strong>Sitter-Link</strong> zu generieren.
              </p>
              
              <CreateTankDialog 
                trigger={
                  <Button size="lg" className="text-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 rounded-full transition-transform hover:scale-105 active:scale-95">
                    Erstes Becken anlegen 🚀
                  </Button>
                }
              />
              
              <p className="text-xs text-slate-400 mt-6">
                Dauert nur 10 Sekunden. Kein Technik-Wissen nötig.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
