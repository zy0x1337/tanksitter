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
        ÄNDERUNG: sm:max-w-2xl sorgt für mehr Breite.
        max-h-[90vh] und overflow-y-auto sorgen dafür, dass man scrollen kann, 
        falls die Presets den Bildschirm füllen.
      */}
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
            <DialogHeader className="mb-4">
            <DialogTitle>{t('add_task_title')}</DialogTitle>
            <DialogDescription className="hidden">New Task</DialogDescription>
            </DialogHeader>
            
            <TaskForm tankId={tankId} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
