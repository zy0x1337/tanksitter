'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Wichtig: Interface passend zum Dateinamen [tankId]
interface PageProps {
  params: Promise<{ 
    locale: string; 
    tankId: string 
  }>
}

export default function TankDetailPage({ params }: PageProps) {
  // Params "unwrap" (Next.js 15 Standard)
  const { locale, tankId } = use(params)
  
  const t = useTranslations('Forms')
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [tank, setTank] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  
  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskFreq, setNewTaskFreq] = useState('daily')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 1. Daten laden (Nutzt tankId aus URL)
  useEffect(() => {
    const fetchData = async () => {
      // Tank laden
      const { data: tankData } = await supabase
        .from('tanks')
        .select('*')
        .eq('id', tankId) // Hier tankId nutzen!
        .single()
      
      if (tankData) {
          setTank(tankData)
          // Tasks laden
          const { data: taskData } = await supabase
            .from('tasks')
            .select('*')
            .eq('tank_id', tankId) // Hier tankId nutzen!
            .order('created_at')
          
          setTasks(taskData || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [tankId, supabase]) // Dependency Array angepasst

  // 2. Bild Vorschau
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // 3. Task Speichern
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    let imagePath = null

    // A. Bild Upload
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      // Ordner-Struktur: tankId/random.jpg
      const filePath = `${tankId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('task-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        alert('Upload Error: ' + uploadError.message)
        setUploading(false)
        return
      }
      imagePath = filePath
    }

    // B. DB Insert
    const { error: dbError } = await supabase
      .from('tasks')
      .insert({
        tank_id: tankId, // Hier tankId nutzen!
        title: newTaskTitle,
        description: newTaskDesc,
        frequency_type: newTaskFreq,
        image_path: imagePath,
        frequency_days: []
      })

    setUploading(false)

    if (dbError) {
      alert(dbError.message)
    } else {
      setIsAdding(false)
      setNewTaskTitle('')
      setNewTaskDesc('')
      setImageFile(null)
      setImagePreview(null)
      window.location.reload()
    }
  }

  // 4. Löschen
  const handleDeleteTask = async (taskId: string) => {
    if(!confirm(t('delete_confirm') || 'Delete?')) return
    await supabase.from('tasks').delete().eq('id', taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
  if (!tank) return <div className="p-8 text-center text-slate-500">Tank not found (ID: {tankId})</div>

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                {/* Zurück zum Dashboard */}
                <Link href={`/${locale}/dashboard`} className="bg-white p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{tank.name}</h1>
                    <a href={`/${locale}/s/${tank.share_token}`} target="_blank" className="text-sm text-blue-600 hover:underline font-medium">
                        Public Sitter Link ↗
                    </a>
                </div>
            </div>
            
            <Button 
              onClick={() => setIsAdding(!isAdding)} 
              className={isAdding ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"}
            >
                {isAdding ? t('cancel') : (
                    <>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('add_task_title')}
                    </>
                )}
            </Button>
        </div>

        {/* Add Task Formular */}
        {isAdding && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 animate-in slide-in-from-top-4 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
                
                <h2 className="font-bold text-lg mb-6 text-slate-800">{t('add_task_title')}</h2>
                
                <form onSubmit={handleAddTask} className="space-y-5">
                    
                    {/* Titel */}
                    <div>
                        <Label className="mb-1.5 block font-medium">{t('task_title_label')}</Label>
                        <Input 
                            value={newTaskTitle} 
                            onChange={e => setNewTaskTitle(e.target.value)} 
                            placeholder={t('task_title_placeholder')}
                            required 
                            className="h-11"
                        />
                    </div>

                    {/* Frequenz Select */}
                    <div>
                        <Label className="mb-1.5 block font-medium">{t('frequency_label')}</Label>
                        <Select value={newTaskFreq} onValueChange={setNewTaskFreq}>
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily / Täglich</SelectItem>
                                <SelectItem value="weekly">Weekly / Wöchentlich</SelectItem>
                                <SelectItem value="once">Once / Einmalig</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image Upload Area */}
                    <div>
                        <Label className="mb-1.5 block font-medium">{t('image_label')}</Label>
                        <div className="group border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            
                            {imagePreview ? (
                                <div className="relative w-full h-48">
                                  <img src={imagePreview} className="w-full h-full object-cover rounded-lg shadow-sm" />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                                  </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                                      <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-medium">{t('upload_hint')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Beschreibung */}
                    <div>
                        <Label className="mb-1.5 block font-medium">Description (Optional)</Label>
                        <Textarea 
                            value={newTaskDesc}
                            onChange={e => setNewTaskDesc(e.target.value)}
                            placeholder="Details, warnings, amounts..."
                            className="resize-none"
                            rows={3}
                        />
                    </div>

                    <Button type="submit" disabled={uploading} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 font-bold rounded-xl mt-2">
                        {uploading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin w-5 h-5" /> Uploading...
                          </span>
                        ) : t('save_button')}
                    </Button>
                </form>
            </div>
        )}

        {/* Task Liste */}
        <div className="space-y-4">
            {tasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all hover:border-blue-100">
                    {/* Thumbnail */}
                    <div className="h-20 w-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
                        {task.image_path ? (
                             <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-300" /></div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 truncate">{task.title}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide ${
                            task.frequency_type === 'daily' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                              {task.frequency_type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1">{task.description || "No description"}</p>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 w-10">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            ))}

            {tasks.length === 0 && !isAdding && (
                <div className="text-center py-16 px-4 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <p className="font-medium">No tasks yet.</p>
                    <p className="text-sm mt-1">Click the <span className="text-blue-500 font-bold">+ New Task</span> button to add one.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  )
}
