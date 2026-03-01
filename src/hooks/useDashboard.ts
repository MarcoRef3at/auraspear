import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services'
import { POLLING_INTERVAL } from '@/lib/constants'

export function useKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => dashboardService.getKPIs(),
    refetchInterval: POLLING_INTERVAL,
  })
}

export function useAlertTrends() {
  return useQuery({
    queryKey: ['dashboard', 'alert-trends'],
    queryFn: () => dashboardService.getAlertTrends(),
  })
}

export function useMITREStats() {
  return useQuery({
    queryKey: ['dashboard', 'mitre-stats'],
    queryFn: () => dashboardService.getMITREStats(),
  })
}

export function useAssetRisks() {
  return useQuery({
    queryKey: ['dashboard', 'asset-risks'],
    queryFn: () => dashboardService.getAssetRisks(),
  })
}

export function usePipelineHealth() {
  return useQuery({
    queryKey: ['dashboard', 'pipeline-health'],
    queryFn: () => dashboardService.getPipelineHealth(),
    refetchInterval: POLLING_INTERVAL,
  })
}
