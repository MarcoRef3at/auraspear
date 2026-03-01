export type ConnectorType =
  | 'wazuh'
  | 'graylog'
  | 'velociraptor'
  | 'grafana'
  | 'influxdb'
  | 'misp'
  | 'shuffle'
  | 'bedrock'

export type ConnectorStatus = 'not_configured' | 'connected' | 'disconnected' | 'testing'

export type AuthType = 'apiKey' | 'basic' | 'bearer' | 'iam'

export type RBACRole = 'Admin' | 'SOC_Analyst' | 'Viewer'

export const CONNECTOR_TYPES: ConnectorType[] = [
  'wazuh',
  'graylog',
  'velociraptor',
  'grafana',
  'influxdb',
  'misp',
  'shuffle',
  'bedrock',
]

export interface ConnectorRecord {
  id: string
  type: ConnectorType
  name: string
  enabled: boolean
  config: Record<string, unknown>
  status: ConnectorStatus
  lastTestAt: string | null
  lastTestOk: boolean | null
  lastError: string | null
  lastLogs: string[]
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface ConnectorMeta {
  label: string
  description: string
  category: 'siem' | 'edr' | 'observability' | 'threat_intel' | 'soar' | 'ai'
}

export const CONNECTOR_META: Record<ConnectorType, ConnectorMeta> = {
  wazuh: { label: 'Wazuh', description: 'Security monitoring & SIEM', category: 'siem' },
  graylog: { label: 'Graylog', description: 'Log management & analysis', category: 'siem' },
  velociraptor: {
    label: 'Velociraptor',
    description: 'Endpoint visibility & response',
    category: 'edr',
  },
  grafana: {
    label: 'Grafana',
    description: 'Observability & dashboards',
    category: 'observability',
  },
  influxdb: { label: 'InfluxDB', description: 'Time series database', category: 'observability' },
  misp: { label: 'MISP', description: 'Threat intelligence platform', category: 'threat_intel' },
  shuffle: {
    label: 'Shuffle SOAR',
    description: 'Security orchestration & automation',
    category: 'soar',
  },
  bedrock: { label: 'AWS Bedrock AI', description: 'AI-powered security analysis', category: 'ai' },
}

export function isConnectorType(value: string): value is ConnectorType {
  return CONNECTOR_TYPES.includes(value as ConnectorType)
}

export interface AuditLogEntry {
  id: string
  tenantId: string
  timestamp: string
  actor: string
  role: RBACRole
  action: 'create' | 'update' | 'delete' | 'test' | 'enable' | 'disable' | 'reset'
  connectorType: ConnectorType
  details: string
}

export interface AIAuditEntry {
  id: string
  tenantId: string
  timestamp: string
  model: string
  action: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
  status: 'success' | 'error'
}

export const BEDROCK_MODELS = [
  { id: 'anthropic.claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { id: 'anthropic.claude-3-haiku', label: 'Claude 3 Haiku' },
  { id: 'amazon.titan-text-express', label: 'Titan Text Express' },
  { id: 'meta.llama3-70b-instruct', label: 'Llama 3 70B' },
] as const

export const AWS_REGIONS = [
  { id: 'us-east-1', label: 'US East (N. Virginia)' },
  { id: 'us-west-2', label: 'US West (Oregon)' },
  { id: 'eu-west-1', label: 'EU (Ireland)' },
  { id: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
] as const

export interface SecurityPosture {
  mTLS: boolean
  iam: boolean
  encryption: boolean
}

export function canEdit(role: RBACRole): boolean {
  return role === 'Admin' || role === 'SOC_Analyst'
}

export function canDelete(role: RBACRole): boolean {
  return role === 'Admin'
}

export const DEMO_TENANTS = [
  { id: 'aura-finance', name: 'Aura Finance', environment: 'production' as const },
  { id: 'aura-health', name: 'Aura Health', environment: 'production' as const },
  { id: 'aura-enterprise', name: 'Aura Enterprise', environment: 'staging' as const },
] as const
