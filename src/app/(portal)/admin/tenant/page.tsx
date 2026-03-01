'use client'

import { useTranslations } from 'next-intl'
import { PageHeader, LoadingSpinner, ErrorMessage } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TenantUserTable } from '@/components/admin'
import { useTenantUsers } from '@/hooks'
import { useTenantStore } from '@/stores'

export default function TenantConfigPage() {
  const t = useTranslations('admin')
  const currentTenantId = useTenantStore(state => state.currentTenantId)

  const { data, isLoading, isError } = useTenantUsers(currentTenantId)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tenant.title')}
        description={t('tenant.description')}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('users.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorMessage message={t('users.loadError')} />
          ) : (
            <TenantUserTable
              users={data?.data ?? []}
              loading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
