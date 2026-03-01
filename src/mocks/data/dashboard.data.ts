import type {
  DashboardKPI,
  AlertTrendPoint,
  MITRETechnique,
  AssetRisk,
  PipelineService,
} from '@/types'

export const mockKPIs: DashboardKPI[] = [
  { label: 'Total Alerts', value: 1247, trend: 12.5, trendLabel: 'vs last week', icon: 'shield' },
  {
    label: 'Critical Alerts',
    value: 23,
    trend: -8.3,
    trendLabel: 'vs last week',
    icon: 'alert-triangle',
  },
  {
    label: 'Open Cases',
    value: 8,
    trend: 3.2,
    trendLabel: 'vs last week',
    icon: 'briefcase',
  },
  {
    label: 'Mean Response Time',
    value: 14,
    trend: -5.1,
    trendLabel: 'minutes vs last week',
    icon: 'clock',
  },
]

export const mockAlertTrends: AlertTrendPoint[] = [
  { date: '2026-02-23', critical: 5, high: 12, medium: 28, low: 45 },
  { date: '2026-02-24', critical: 3, high: 15, medium: 32, low: 52 },
  { date: '2026-02-25', critical: 8, high: 18, medium: 25, low: 48 },
  { date: '2026-02-26', critical: 2, high: 10, medium: 30, low: 55 },
  { date: '2026-02-27', critical: 6, high: 14, medium: 27, low: 42 },
  { date: '2026-02-28', critical: 4, high: 11, medium: 35, low: 50 },
  { date: '2026-03-01', critical: 7, high: 16, medium: 22, low: 38 },
]

export const mockMITRETechniques: MITRETechnique[] = [
  { id: 'T1059', name: 'Command and Scripting Interpreter', count: 142, percentage: 85 },
  { id: 'T1110', name: 'Brute Force', count: 98, percentage: 65 },
  { id: 'T1071', name: 'Application Layer Protocol', count: 76, percentage: 52 },
  { id: 'T1053', name: 'Scheduled Task/Job', count: 54, percentage: 38 },
  { id: 'T1078', name: 'Valid Accounts', count: 41, percentage: 28 },
]

export const mockAssetRisks: AssetRisk[] = [
  { id: 'asset-1', name: 'web-server-01', ip: '10.0.1.15', riskScore: 92, alertCount: 34 },
  { id: 'asset-2', name: 'db-primary', ip: '10.0.2.10', riskScore: 87, alertCount: 28 },
  { id: 'asset-3', name: 'api-gateway', ip: '10.0.1.5', riskScore: 74, alertCount: 19 },
  { id: 'asset-4', name: 'mail-server', ip: '10.0.3.20', riskScore: 68, alertCount: 15 },
  { id: 'asset-5', name: 'file-server-02', ip: '10.0.4.8', riskScore: 55, alertCount: 11 },
]

export const mockPipelineServices: PipelineService[] = [
  { name: 'Wazuh Manager', status: 'healthy', healthy: true },
  { name: 'Wazuh Indexer', status: 'healthy', healthy: true },
  { name: 'MISP', status: 'healthy', healthy: true },
  { name: 'Shuffle SOAR', status: 'degraded', healthy: false },
  { name: 'TheHive', status: 'healthy', healthy: true },
]
