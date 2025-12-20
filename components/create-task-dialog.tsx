'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskForm } from './task-form'

interface CreateTaskDialogProps {
  tankId: string
}

export function CreateTaskDialog({ tankId }: CreateTaskDialogProps) {
  const t = useTranslations('Forms')
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {t('add_task_title')}
        </Button>
      </DialogTrigger>
      {/* 
          Hier ist die wichtige Änderung: 
          max-w-2xl für mehr Breite (gut für das Preset-Grid)
          max-h-[90vh] overflow-y-auto damit man auf kleinen Screens scrollen kann
      */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('add_task_title')}</DialogTitle>
          <DialogDescription>
            {/* Optional: Kurze Erklärung */}
          </DialogDescription>
        </DialogHeader>
        
        {/* Task Form wird hier gerendert */}
        <TaskForm tankId={tankId} onSuccess={() => setOpen(false)} />
        
      </DialogContent>
    </Dialog>
  )
}
