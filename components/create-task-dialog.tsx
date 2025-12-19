'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { TaskForm } from "@/components/task-form"

interface CreateTaskDialogProps {
  tankId: string
  triggerButton?: React.ReactNode
}

export function CreateTaskDialog({ tankId, triggerButton }: CreateTaskDialogProps) {
  const t = useTranslations('Forms')
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
           <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
             <Plus className="w-4 h-4 mr-2" />
             {t('add_task_title')}
           </Button>
        )}
      </DialogTrigger>
      
      {/* 
          Wichtig: overflow-visible erlaubt es dem Select (Dropdown) über den Dialog-Rand hinauszuragen 
          oder nutzt Portals korrekt. sm:max-w-[500px] für mehr Platz.
      */}
      <DialogContent className="sm:max-w-[500px] bg-background overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('add_task_title')}</DialogTitle>
          <DialogDescription>
             Add a new maintenance task for your sitter.
          </DialogDescription>
        </DialogHeader>
        
        {/* Task Form Component integrieren */}
        <div className="py-4">
            <TaskForm tankId={tankId} onSuccess={handleSuccess} />
        </div>

      </DialogContent>
    </Dialog>
  )
}
