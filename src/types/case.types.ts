import type { CaseSeverity, CaseStatus, CaseTaskStatus } from '@/enums'

export interface CaseTask {
  id: string
  title: string
  status: CaseTaskStatus
  assignee: string
}

export interface CaseTimelineEntry {
  id: string
  timestamp: string
  type: string
  actor: string
  description: string
  metadata?: Record<string, unknown>
}

export interface CaseArtifact {
  id: string
  type: string
  value: string
  source: string
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  description: string
  status: CaseStatus
  severity: CaseSeverity
  assignee: string
  createdAt: string
  updatedAt: string
  closedAt?: string
  linkedAlertIds: string[]
  timeline: CaseTimelineEntry[]
  tasks: CaseTask[]
  artifacts: CaseArtifact[]
  tenantId: string
}

export interface CreateCaseInput {
  title: string
  description: string
  severity: CaseSeverity
  assignee: string
  linkedAlertIds?: string[]
}
