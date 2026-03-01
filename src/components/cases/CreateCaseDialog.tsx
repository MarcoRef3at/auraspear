'use client'

import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CaseSeverity } from '@/enums'
import type { SelectOption } from '@/types'

interface CreateCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCaseFormValues) => void
  assigneeOptions: SelectOption[]
  loading?: boolean
}

const createCaseSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  severity: z.nativeEnum(CaseSeverity),
  assignee: z.string().min(1),
})

type CreateCaseFormValues = z.infer<typeof createCaseSchema>

export type { CreateCaseFormValues }

export function CreateCaseDialog({
  open,
  onOpenChange,
  onSubmit,
  assigneeOptions,
  loading = false,
}: CreateCaseDialogProps) {
  const t = useTranslations('cases')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateCaseFormValues>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: CaseSeverity.MEDIUM,
      assignee: '',
    },
  })

  const handleFormSubmit = (data: CreateCaseFormValues) => {
    onSubmit(data)
    reset()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('createCase')}</DialogTitle>
          <DialogDescription>{t('createCaseDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="case-title">{t('fieldTitle')}</Label>
            <Input
              id="case-title"
              {...register('title')}
              placeholder={t('fieldTitlePlaceholder')}
              aria-invalid={errors.title ? true : undefined}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{t('validationTitleMin')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="case-description">{t('fieldDescription')}</Label>
            <Textarea
              id="case-description"
              {...register('description')}
              placeholder={t('fieldDescriptionPlaceholder')}
              aria-invalid={errors.description ? true : undefined}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{t('validationDescriptionMin')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('fieldSeverity')}</Label>
              <Controller
                name="severity"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('fieldSeverityPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CaseSeverity).map(severity => (
                        <SelectItem key={severity} value={severity} className="capitalize">
                          {severity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.severity && (
                <p className="text-xs text-destructive">{t('validationSeverity')}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t('fieldAssignee')}</Label>
              <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('fieldAssigneePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {assigneeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assignee && (
                <p className="text-xs text-destructive">{t('validationAssignee')}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('creating') : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
