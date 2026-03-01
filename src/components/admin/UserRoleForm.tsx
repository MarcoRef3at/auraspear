'use client'

import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@/enums'

const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
  permissions: z.array(z.string()).min(1),
})

type UserRoleFormValues = z.infer<typeof userRoleSchema>

interface UserRoleFormProps {
  defaultValues?: Partial<UserRoleFormValues>
  availablePermissions: string[]
  onSubmit: (values: UserRoleFormValues) => void
  onCancel: () => void
  loading?: boolean
}

export function UserRoleForm({
  defaultValues,
  availablePermissions,
  onSubmit,
  onCancel,
  loading = false,
}: UserRoleFormProps) {
  const t = useTranslations('admin')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: defaultValues?.role ?? UserRole.VIEWER,
      permissions: defaultValues?.permissions ?? [],
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>{t('roles.role')}</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('roles.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>{t('roles.admin')}</SelectItem>
                <SelectItem value={UserRole.ANALYST}>{t('roles.analyst')}</SelectItem>
                <SelectItem value={UserRole.MANAGER}>{t('roles.manager')}</SelectItem>
                <SelectItem value={UserRole.VIEWER}>{t('roles.viewer')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-sm text-destructive">{t('roles.roleRequired')}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>{t('roles.permissions')}</Label>
        <Controller
          name="permissions"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availablePermissions.map(permission => {
                const isChecked = field.value.includes(permission)
                return (
                  <label
                    key={permission}
                    className="flex items-center gap-2 rounded-md border p-3 text-sm hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={checked => {
                        if (checked === true) {
                          field.onChange([...field.value, permission])
                        } else {
                          field.onChange(field.value.filter(p => p !== permission))
                        }
                      }}
                    />
                    <span>{permission}</span>
                  </label>
                )
              })}
            </div>
          )}
        />
        {errors.permissions && (
          <p className="text-sm text-destructive">{t('roles.permissionsRequired')}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}
