import { create } from 'zustand'
import type { AlertSeverity } from '@/enums'

interface FilterState {
  severity: AlertSeverity[]
  timeRange: string
  agents: string[]
  kqlQuery: string
  setSeverity: (severity: AlertSeverity[]) => void
  setTimeRange: (timeRange: string) => void
  setAgents: (agents: string[]) => void
  setKqlQuery: (query: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>(set => ({
  severity: [],
  timeRange: '24h',
  agents: [],
  kqlQuery: '',
  setSeverity: severity => set({ severity }),
  setTimeRange: timeRange => set({ timeRange }),
  setAgents: agents => set({ agents }),
  setKqlQuery: kqlQuery => set({ kqlQuery }),
  resetFilters: () => set({ severity: [], timeRange: '24h', agents: [], kqlQuery: '' }),
}))
