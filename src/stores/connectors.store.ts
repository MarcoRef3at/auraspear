import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ConnectorType,
  ConnectorRecord,
  ConnectorStatus,
  RBACRole,
  AuditLogEntry,
  AIAuditEntry,
} from '@/lib/types/connectors'
import { CONNECTOR_TYPES, CONNECTOR_META, DEMO_TENANTS } from '@/lib/types/connectors'

function defaultConfig(): Record<string, unknown> {
  return {
    baseUrl: '',
    authType: 'apiKey',
    apiKey: '',
    username: '',
    password: '',
    token: '',
    verifyTLS: true,
    timeoutSeconds: 30,
    tags: [],
    notes: '',
    // MISP
    mispUrl: '',
    mispAuthKey: '',
    // Shuffle
    webhookUrl: '',
    workflowId: '',
    shuffleApiKey: '',
    // Bedrock
    modelId: '',
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    nlHuntingEnabled: false,
    explainableAiEnabled: false,
    auditLoggingEnabled: false,
  }
}

function createSeedForTenant(tenantId: string): ConnectorRecord[] {
  const now = new Date().toISOString()
  return CONNECTOR_TYPES.map(type => ({
    id: crypto.randomUUID(),
    type,
    name: CONNECTOR_META[type].label,
    enabled: false,
    config: defaultConfig(),
    status: 'not_configured' as ConnectorStatus,
    lastTestAt: null,
    lastTestOk: null,
    lastError: null,
    lastLogs: [],
    tenantId,
    createdAt: now,
    updatedAt: now,
  }))
}

function createSeedConnectors(): Record<string, ConnectorRecord[]> {
  const result: Record<string, ConnectorRecord[]> = {}
  for (const t of DEMO_TENANTS) {
    result[t.id] = createSeedForTenant(t.id)
  }
  return result
}

function createSeedAuditLogs(): AuditLogEntry[] {
  const now = Date.now()
  const tenants = DEMO_TENANTS.map(t => t.id)
  const actions: AuditLogEntry['action'][] = ['create', 'update', 'test', 'enable', 'disable']
  const actors = ['admin@aura.io', 'analyst@aura.io', 'viewer@aura.io']
  const roles: RBACRole[] = ['Admin', 'SOC_Analyst', 'Viewer']
  const types: ConnectorType[] = ['wazuh', 'graylog', 'misp', 'bedrock', 'shuffle']

  return Array.from({ length: 15 }, (_, i) => ({
    id: crypto.randomUUID(),
    tenantId: tenants[i % tenants.length] ?? tenants[0] ?? '',
    timestamp: new Date(now - i * 3600000).toISOString(),
    actor: actors[i % actors.length] ?? actors[0] ?? '',
    role: roles[i % roles.length] ?? roles[0] ?? 'Viewer',
    action: actions[i % actions.length] ?? actions[0] ?? 'update',
    connectorType: types[i % types.length] ?? types[0] ?? 'wazuh',
    details: `${actions[i % actions.length] ?? 'update'} connector ${types[i % types.length] ?? 'wazuh'}`,
  }))
}

function createSeedAIAuditLogs(): AIAuditEntry[] {
  const now = Date.now()
  const models = [
    'anthropic.claude-3-sonnet',
    'anthropic.claude-3-haiku',
    'amazon.titan-text-express',
  ]
  const aiActions = ['threat_analysis', 'nl_hunting', 'alert_summary', 'ioc_enrichment']

  return Array.from({ length: 10 }, (_, i) => ({
    id: crypto.randomUUID(),
    tenantId: DEMO_TENANTS[i % DEMO_TENANTS.length]?.id ?? DEMO_TENANTS[0]?.id ?? '',
    timestamp: new Date(now - i * 1800000).toISOString(),
    model: models[i % models.length] ?? models[0] ?? '',
    action: aiActions[i % aiActions.length] ?? aiActions[0] ?? 'threat_analysis',
    inputTokens: 200 + Math.floor(Math.random() * 800),
    outputTokens: 100 + Math.floor(Math.random() * 400),
    latencyMs: 300 + Math.floor(Math.random() * 2000),
    status: i === 3 ? ('error' as const) : ('success' as const),
  }))
}

interface ConnectorsState {
  connectorsByTenant: Record<string, ConnectorRecord[]>
  activeTenantId: string
  role: RBACRole
  auditLogs: AuditLogEntry[]
  aiAuditLogs: AIAuditEntry[]

  // Derived accessors
  connectors: ConnectorRecord[]
  getByType: (type: ConnectorType) => ConnectorRecord | undefined

  // Tenant / Role
  setActiveTenant: (id: string) => void
  setRole: (role: RBACRole) => void

  // CRUD
  upsert: (type: ConnectorType, data: Partial<ConnectorRecord>) => void
  setStatus: (
    type: ConnectorType,
    status: ConnectorStatus,
    extra?: {
      lastTestAt: string
      lastTestOk: boolean
      lastError: string | null
      lastLogs: string[]
    }
  ) => void
  resetConnector: (type: ConnectorType) => void
  deleteConnector: (type: ConnectorType) => void

  // Audit
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void
  addAIAuditLog: (entry: Omit<AIAuditEntry, 'id' | 'timestamp'>) => void

  // Seed
  seedDefaults: () => void
}

export const useConnectorsStore = create<ConnectorsState>()(
  persist(
    (set, get) => ({
      connectorsByTenant: createSeedConnectors(),
      activeTenantId: DEMO_TENANTS[0]?.id ?? 'tenant-1',
      role: 'Admin' as RBACRole,
      auditLogs: createSeedAuditLogs(),
      aiAuditLogs: createSeedAIAuditLogs(),

      get connectors() {
        const state = get()
        return state.connectorsByTenant[state.activeTenantId] ?? []
      },

      getByType: type => {
        const state = get()
        const list = state.connectorsByTenant[state.activeTenantId] ?? []
        return list.find(c => c.type === type)
      },

      setActiveTenant: id => set({ activeTenantId: id }),
      setRole: role => set({ role }),

      upsert: (type, data) =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.map(c =>
                c.type === type ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
              ),
            },
          }
        }),

      setStatus: (type, status, extra) =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.map(c =>
                c.type === type
                  ? {
                      ...c,
                      status,
                      lastTestAt: extra ? extra.lastTestAt : c.lastTestAt,
                      lastTestOk: extra ? extra.lastTestOk : c.lastTestOk,
                      lastError: extra ? extra.lastError : c.lastError,
                      lastLogs: extra ? extra.lastLogs : c.lastLogs,
                      updatedAt: new Date().toISOString(),
                    }
                  : c
              ),
            },
          }
        }),

      resetConnector: type =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.map(c =>
                c.type === type
                  ? {
                      ...c,
                      enabled: false,
                      config: defaultConfig(),
                      status: 'not_configured' as ConnectorStatus,
                      lastTestAt: null,
                      lastTestOk: null,
                      lastError: null,
                      lastLogs: [],
                      updatedAt: new Date().toISOString(),
                    }
                  : c
              ),
            },
          }
        }),

      deleteConnector: type =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.filter(c => c.type !== type),
            },
          }
        }),

      addAuditLog: entry =>
        set(state => ({
          auditLogs: [
            { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
            ...state.auditLogs,
          ],
        })),

      addAIAuditLog: entry =>
        set(state => ({
          aiAuditLogs: [
            { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
            ...state.aiAuditLogs,
          ],
        })),

      seedDefaults: () =>
        set({
          connectorsByTenant: createSeedConnectors(),
          auditLogs: createSeedAuditLogs(),
          aiAuditLogs: createSeedAIAuditLogs(),
        }),
    }),
    {
      name: 'auraspear-connectors',
    }
  )
)
