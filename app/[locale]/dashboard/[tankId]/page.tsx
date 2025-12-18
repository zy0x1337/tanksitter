'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Trash2, Plus, Loader2, Image as ImageIcon, AlertTriangle, UploadCloud, X } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useDropzone } from 'react-dropzone'

interface PageProps {
  params: Promise<{ 
    locale: string; 
    tankId: string 
  }>
}

export default function TankDetailPage({ params }: PageProps) {
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
  const [deletingTank, setDeletingTank] = useState(false)
  
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskFreq, setNewTaskFreq] = useState('daily')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: tankData } = await supabase.from('tanks').select('*').eq('id', tankId).single()
      if (tankData) {
          setTank(tankData)
          const { data: taskData } = await supabase.from('tasks').select('*').eq('tank_id', tankId).order('created_at')
          setTasks(taskData || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [tankId, supabase])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1, multiple: false
  })

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImageFile(null)
    setImagePreview(null)
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    const toastId = toast.loading(t('saving'))

    let imagePath = null
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${tankId}/${fileName}`
      const { error: uploadError } = await supabase.storage.from('task-images').upload(filePath, imageFile)
      if (uploadError) {
        toast.dismiss(toastId)
        toast.error('Upload failed: ' + uploadError.message)
        setUploading(false)
        return
      }
      imagePath = filePath
    }

    const { error: dbError } = await supabase.from('tasks').insert({
        tank_id: tankId, title: newTaskTitle, description: newTaskDesc, frequency_type: newTaskFreq, image_path: imagePath, frequency_days: []
    })
    setUploading(false)
    toast.dismiss(toastId)
    if (dbError) {
      toast.error('Error: ' + dbError.message)
    } else {
      toast.success(t('add_task_title') + ' success!')
      setIsAdding(false)
      setNewTaskTitle('')
      setNewTaskDesc('')
      setImageFile(null)
      setImagePreview(null)
      window.location.reload()
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if(!confirm(t('delete_confirm') || 'Delete?')) return
    setTasks(prev => prev.filter(t => t.id !== taskId))
    toast.info("Task deleted")
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) { toast.error("Error deleting task"); window.location.reload() }
  }

  const handleDeleteTank = async () => {
    if (!confirm(locale === 'de' ? `Wirklich löschen?` : `Really delete?`)) return
    setDeletingTank(true)
    const toastId = toast.loading("Deleting tank...")
    const { error } = await supabase.from('tanks').delete().eq('id', tankId)
    if (error) {
      toast.dismiss(toastId)
      toast.error('Error: ' + error.message)
      setDeletingTank(false)
    } else {
      toast.dismiss(toastId)
      toast.success("Tank deleted")
      router.push(`/${locale}/dashboard`)
      router.refresh()
    }
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
  if (!tank) return <div className="p-8 text-center text-muted-foreground">Tank not found (ID: {tankId})</div>

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Link href={`/${locale}/dashboard`} className="bg-card p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{tank.name}</h1>
                    <a href={`/${locale}/s/${tank.share_token}`} target="_blank" className="text-sm text-primary hover:underline font-medium">
                        Public Sitter Link ↗
                    </a>
                </div>
            </div>
            
            <Button 
              onClick={() => setIsAdding(!isAdding)} 
              className={isAdding ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"}
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
            <div className="bg-card rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-blue-900 animate-in slide-in-from-top-4 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
                
                <h2 className="font-bold text-lg mb-6 text-foreground">{t('add_task_title')}</h2>
                
                <form onSubmit={handleAddTask} className="space-y-5">
                    <div>
                        <Label className="mb-1.5 block font-medium">{t('task_title_label')}</Label>
                        <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder={t('task_title_placeholder')} required className="h-11 bg-background" />
                    </div>
                    <div>
                        <Label className="mb-1.5 block font-medium">{t('frequency_label')}</Label>
                        <Select value={newTaskFreq} onValueChange={setNewTaskFreq}>
    <SelectTrigger className="h-11 bg-background">
        <SelectValue />
    </SelectTrigger>
    <SelectContent>
        <SelectItem value="daily">{t('freq_daily')}</SelectItem>
        <SelectItem value="weekly">{t('freq_weekly')}</SelectItem>
        <SelectItem value="once">{t('freq_once')}</SelectItem>
    </SelectContent>
</Select>
                    </div>

                    <div>
                        <Label className="mb-1.5 block font-medium">{t('image_label')}</Label>
                        <div 
                          {...getRootProps()} 
                          className={`
                            relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] text-center
                            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' : 'border-border bg-secondary/50 hover:bg-secondary hover:border-muted-foreground'}
                            ${imagePreview ? 'border-none p-0 overflow-hidden bg-black' : ''}
                          `}
                        >
                          <input {...getInputProps()} />
                          {imagePreview ? (
                            <div className="relative w-full h-64 group">
                              <img src={imagePreview} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                 <Button type="button" variant="destructive" size="icon" className="h-10 w-10 rounded-full" onClick={removeImage}>
                                    <X className="w-5 h-5" />
                                 </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 pointer-events-none">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-background text-muted-foreground shadow-sm'}`}>
                                {isDragActive ? <UploadCloud className="w-8 h-8 animate-bounce" /> : <ImageIcon className="w-8 h-8" />}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-foreground">{isDragActive ? "Drop image here!" : t('upload_hint')}</p>
                                 <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (max. 5MB)</p>
                              </div>
                            </div>
                          )}
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1.5 block font-medium">Description</Label>
                        <Textarea value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Details..." className="resize-none bg-background" rows={3} />
                    </div>
                    <Button type="submit" disabled={uploading} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2">
                        {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : t('save_button')}
                    </Button>
                </form>
            </div>
        )}

        {/* Task Liste */}
        <div className="space-y-4">
            {tasks.map(task => (
                <div key={task.id} className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4 group hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800">
                    <div className="h-20 w-20 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border relative">
                        {task.image_path ? (
                             <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate">{task.title}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide ${
                            task.frequency_type === 'daily' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-secondary text-secondary-foreground'
                          }`}>
                              {task.frequency_type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{task.description || "No description"}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl h-10 w-10">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            ))}

            {tasks.length === 0 && !isAdding && (
                <div className="text-center py-16 px-4 text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                    <p className="font-medium">No tasks yet.</p>
                </div>
            )}
        </div>

        {/* DANGER ZONE */}
        <div className="mt-20 pt-10 border-t border-border">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-red-900 dark:text-red-400 font-bold flex items-center gap-2 mb-1">
                <AlertTriangle className="h-5 w-5" />
                {t('delete_tank')}
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                This action permanently removes the tank.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTank} 
              disabled={deletingTank}
              className="bg-red-600 hover:bg-red-700 text-white shrink-0 shadow-sm"
            >
              {deletingTank ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {t('delete_tank')}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
