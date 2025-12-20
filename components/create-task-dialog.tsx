'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TaskForm } from './task-form'

// Interface erweitern
interface CreateTaskDialogProps {
  tankId: string
  onSuccess?: () => void  // <-- Das hier hat gefehlt
}

export function CreateTaskDialog({ tankId, onSuccess }: CreateTaskDialogProps) {
  const t = useTranslations('Forms')
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
      setOpen(false) // Dialog schließen
      if (onSuccess) onSuccess() // Liste neu laden lassen
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          {t('add_task_title')}
        </Button>
      </DialogTrigger>
      
      {/* max-w-2xl für mehr Breite wegen den Presets */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
         {/* Titel für Accessibility */}
        <div className="sr-only">Create New Task</div> 
        
        <TaskForm tankId={tankId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
