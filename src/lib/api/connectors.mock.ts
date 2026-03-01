import type { ConnectorType, ConnectorRecord } from '@/lib/types/connectors'
import { useConnectorsStore } from '@/stores/connectors.store'

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function listConnectors(): ConnectorRecord[] {
  const state = useConnectorsStore.getState()
  return state.connectorsByTenant[state.activeTenantId] ?? []
}

export function getConnectorByType(type: ConnectorType): ConnectorRecord | undefined {
  return useConnectorsStore.getState().getByType(type)
}

export function upsertConnectorByType(type: ConnectorType, data: Partial<ConnectorRecord>): void {
  useConnectorsStore.getState().upsert(type, data)
}

export function resetConnector(type: ConnectorType): void {
  useConnectorsStore.getState().resetConnector(type)
}

export function deleteConnector(type: ConnectorType): void {
  useConnectorsStore.getState().deleteConnector(type)
}

export async function testConnector(type: ConnectorType): Promise<void> {
  const store = useConnectorsStore.getState()
  const connector = store.getByType(type)
  if (!connector) return

  const logs: string[] = []
  const { config } = connector
  const baseUrl = String(config['baseUrl'] ?? '')
  const authType = String(config['authType'] ?? 'apiKey')

  // Set testing status immediately
  store.setStatus(type, 'testing', {
    lastTestAt: connector.lastTestAt ?? '',
    lastTestOk: false,
    lastError: null,
    lastLogs: [],
  })

  logs.push(`[${timestamp()}] Validating configuration...`)
  logs.push(`[${timestamp()}] Checking URL format...`)
  logs.push(`[${timestamp()}] Auth type: ${authType}`)

  // Simulate network delay (800–1200ms)
  const delayMs = 800 + Math.random() * 400
  await delay(delayMs)

  const now = new Date().toISOString()

  // Bedrock uses region-based endpoints, not baseUrl
  if (type === 'bedrock') {
    const region = String(config['region'] ?? '')
    const modelId = String(config['modelId'] ?? '')

    if (!region || !modelId) {
      logs.push(`[${timestamp()}] ERROR: Region and Model are required`)
      store.setStatus(type, 'disconnected', {
        lastTestAt: now,
        lastTestOk: false,
        lastError: 'Missing region or model configuration',
        lastLogs: logs,
      })
      return
    }

    if (!connector.enabled) {
      logs.push(`[${timestamp()}] ERROR: Connector is disabled`)
      store.setStatus(type, 'disconnected', {
        lastTestAt: now,
        lastTestOk: false,
        lastError: 'Connector disabled',
        lastLogs: logs,
      })
      return
    }

    logs.push(`[${timestamp()}] Region: ${region}`)
    logs.push(`[${timestamp()}] Model: ${modelId}`)
    logs.push(`[${timestamp()}] IAM authentication verified`)
    logs.push(`[${timestamp()}] Bedrock endpoint reachable`)
    logs.push(`[${timestamp()}] AI model health check OK`)

    // Generate mock AI audit log
    store.addAIAuditLog({
      tenantId: store.activeTenantId,
      model: modelId,
      action: 'health_check',
      inputTokens: 12,
      outputTokens: 8,
      latencyMs: Math.floor(delayMs),
      status: 'success',
    })

    store.setStatus(type, 'connected', {
      lastTestAt: now,
      lastTestOk: true,
      lastError: null,
      lastLogs: logs,
    })
    return
  }

  // Check: missing or invalid baseUrl
  if (!baseUrl || (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://'))) {
    logs.push(`[${timestamp()}] ERROR: Invalid or missing base URL`)
    store.setStatus(type, 'disconnected', {
      lastTestAt: now,
      lastTestOk: false,
      lastError: 'Invalid or missing base URL',
      lastLogs: logs,
    })
    return
  }

  // Check: connector disabled
  if (!connector.enabled) {
    logs.push(`[${timestamp()}] ERROR: Connector is disabled`)
    store.setStatus(type, 'disconnected', {
      lastTestAt: now,
      lastTestOk: false,
      lastError: 'Connector disabled',
      lastLogs: logs,
    })
    return
  }

  // Type-specific log lines
  if (type === 'misp') {
    logs.push(`[${timestamp()}] Checking MISP API connectivity...`)
    logs.push(`[${timestamp()}] Verifying auth key...`)
  } else if (type === 'shuffle') {
    logs.push(`[${timestamp()}] Validating webhook endpoint...`)
    logs.push(`[${timestamp()}] Workflow ID verified`)
  } else {
    logs.push(`[${timestamp()}] Simulated handshake OK`)
  }

  // Success
  logs.push(`[${timestamp()}] Connection established successfully`)
  store.setStatus(type, 'connected', {
    lastTestAt: now,
    lastTestOk: true,
    lastError: null,
    lastLogs: logs,
  })
}
