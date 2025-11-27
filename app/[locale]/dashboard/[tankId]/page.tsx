import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, QrCode, Share2 } from 'lucide-react'
import { CreateTaskDialog } from '@/components/create-task-dialog'
import { ShareDialog } from '@/components/share-dialog'

// Wir brauchen auch eine Komponente für die Task-Liste und das Erstell-Formular.
// Die bauen wir gleich. Hier erst mal das Gerüst.

export default async function TankDetails({
  params
}: {
  params: Promise<{ locale: string; tankId: string }>
}) {
  const { tankId } = await params
  const supabase = await createClient()
  
  // Tank laden & prüfen ob er dem User gehört
  const { data: tank } = await supabase
    .from('tanks')
    .select('*')
    .eq('id', tankId)
    .single()

  if (!tank) notFound()

  // Tasks laden
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('tank_id', tankId)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="h-4 w-4" /> Zurück
            </Button>
          </Link>
          
          <div className="flex gap-2">
             {/* Platzhalter für Share & QR Code Buttons */}
            <ShareDialog tankName={tank.name} shareToken={tank.share_token} />
            <Button variant="outline" size="icon"><QrCode className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Tank Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tank.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            ID: <span className="font-mono bg-gray-100 px-1 rounded">{tank.share_token}</span>
            <br/>(Dieser Token ist dein Sitter-Schlüssel)
          </p>
        </div>

        {/* HIER KOMMT DIE TASK LISTE */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Aufgaben & Pflegeplan</h2>
            {/* Hier kommt der "Neue Aufgabe" Button */}
            <CreateTaskDialog tankId={tankId} />
          </div>

          {tasks && tasks.length > 0 ? (
            <ul className="space-y-4">
              {tasks.map(task => (
                <li key={task.id} className="flex gap-4 p-4 rounded-lg border bg-gray-50/50">
                  {/* Bild Vorschau */}
                  {task.image_path ? (
                     <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden relative shrink-0">
                       {/* Wir brauchen später eine Public URL Helper Function */}
                       <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
                        alt={task.title}
                        className="h-full w-full object-cover"
                       />
                     </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">📷</div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {task.frequency_type === 'daily' ? 'Täglich' : task.frequency_type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
              <p>Noch keine Aufgaben erstellt.</p>
              <p className="text-sm mt-2">Erstelle die erste Aufgabe (z.B. "Füttern") für deinen Sitter.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
