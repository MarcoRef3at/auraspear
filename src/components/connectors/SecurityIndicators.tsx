'use client'

import { Shield, KeyRound, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConnectorType } from '@/lib/types/connectors'

interface SecurityPosture {
  mTLS: boolean
  iam: boolean
  encryption: boolean
}

const SECURITY_POSTURE: Record<ConnectorType, SecurityPosture> = {
  wazuh: { mTLS: true, iam: false, encryption: true },
  graylog: { mTLS: false, iam: false, encryption: true },
  velociraptor: { mTLS: true, iam: false, encryption: true },
  grafana: { mTLS: false, iam: false, encryption: true },
  influxdb: { mTLS: false, iam: false, encryption: true },
  misp: { mTLS: false, iam: false, encryption: true },
  shuffle: { mTLS: false, iam: false, encryption: true },
  bedrock: { mTLS: true, iam: true, encryption: true },
}

interface SecurityIndicatorsProps {
  type: ConnectorType
}

export function SecurityIndicators({ type }: SecurityIndicatorsProps) {
  const posture = SECURITY_POSTURE[type]

  const indicators = [
    {
      label: 'mTLS',
      enabled: posture.mTLS,
      icon: Shield,
    },
    {
      label: 'IAM',
      enabled: posture.iam,
      icon: KeyRound,
    },
    {
      label: 'Encryption',
      enabled: posture.encryption,
      icon: Lock,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Security Posture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {indicators.map(ind => {
            const Icon = ind.icon
            return (
              <Badge
                key={ind.label}
                variant="outline"
                className={
                  ind.enabled
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }
              >
                <Icon className="mr-1 h-3 w-3" />
                {ind.label}: {ind.enabled ? 'Active' : 'N/A'}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
