export interface DashboardKPI {
  label: string
  value: number
  trend: number
  trendLabel: string
  icon: string
}

export interface AlertTrendPoint {
  date: string
  critical: number
  high: number
  medium: number
  low: number
}

export interface MITRETechnique {
  id: string
  name: string
  count: number
  percentage: number
}

export interface AssetRisk {
  id: string
  name: string
  ip: string
  riskScore: number
  alertCount: number
}

export interface PipelineService {
  name: string
  status: string
  healthy: boolean
}
