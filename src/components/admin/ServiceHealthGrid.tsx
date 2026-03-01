'use client'

import { useTranslations } from 'next-intl'
import { ServiceHealthCard } from './ServiceHealthCard'
import type { ServiceHealth } from '@/types'

interface ServiceHealthGridProps {
  services: ServiceHealth[]
}

export function ServiceHealthGrid({ services }: ServiceHealthGridProps) {
  const t = useTranslations('admin')

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">{t('services.noServices')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map(service => (
        <ServiceHealthCard key={service.id} service={service} />
      ))}
    </div>
  )
}
