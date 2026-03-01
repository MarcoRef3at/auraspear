import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertService } from '@/services'
import type { AlertSearchParams } from '@/types'

export function useAlerts(params?: AlertSearchParams) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => alertService.getAlerts(params),
  })
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ['alerts', id],
    queryFn: () => alertService.getAlertById(id),
    enabled: id.length > 0,
  })
}

export function useInvestigateAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => alertService.investigateAlert(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['alerts', id] })
    },
  })
}
