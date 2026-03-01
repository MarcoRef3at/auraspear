import type { HuntStatus, MessageRole, ReasoningStepStatus, AlertSeverity } from '@/enums'

export interface ReasoningStep {
  id: string
  label: string
  status: ReasoningStepStatus
}

export interface HuntMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  reasoningSteps?: ReasoningStep[]
  actions?: string[]
}

export interface HuntSession {
  id: string
  status: HuntStatus
  createdAt: string
  messages: HuntMessage[]
  eventsFound: number
}

export interface HuntEvent {
  id: string
  timestamp: string
  severity: AlertSeverity
  eventId: string
  sourceIp: string
  user: string
  description: string
}
