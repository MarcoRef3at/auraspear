'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { ConnectorType, ConnectorRecord } from '@/lib/types/connectors'
import { CONNECTOR_META, BEDROCK_MODELS, AWS_REGIONS, canEdit } from '@/lib/types/connectors'
import { getConnectorSchema, type ConnectorFormValues } from '@/lib/validation/connectors.schema'
import { useConnectorsStore } from '@/stores/connectors.store'

function recordToFormValues(record: ConnectorRecord): ConnectorFormValues {
  const c = record.config
  return {
    name: record.name,
    enabled: record.enabled,
    baseUrl: String(c['baseUrl'] ?? ''),
    authType: (['apiKey', 'basic', 'bearer', 'iam'].includes(String(c['authType'] ?? ''))
      ? String(c['authType'])
      : 'apiKey') as 'apiKey' | 'basic' | 'bearer' | 'iam',
    apiKey: String(c['apiKey'] ?? ''),
    username: String(c['username'] ?? ''),
    password: String(c['password'] ?? ''),
    token: String(c['token'] ?? ''),
    verifyTLS: c['verifyTLS'] !== false,
    timeoutSeconds: Number(c['timeoutSeconds'] ?? 30) || 30,
    tags: Array.isArray(c['tags']) ? (c['tags'] as string[]).join(', ') : '',
    notes: String(c['notes'] ?? ''),
    // Wazuh
    managerUrl: String(c['managerUrl'] ?? ''),
    indexerUrl: String(c['indexerUrl'] ?? ''),
    indexerUsername: String(c['indexerUsername'] ?? ''),
    indexerPassword: String(c['indexerPassword'] ?? ''),
    tenant: String(c['tenant'] ?? ''),
    // Graylog + Velociraptor
    apiUrl: String(c['apiUrl'] ?? ''),
    streamId: String(c['streamId'] ?? ''),
    indexSetId: String(c['indexSetId'] ?? ''),
    // Velociraptor
    orgId: String(c['orgId'] ?? ''),
    clientCert: String(c['clientCert'] ?? ''),
    clientKey: String(c['clientKey'] ?? ''),
    // Grafana
    grafanaUrl: String(c['grafanaUrl'] ?? ''),
    folderId: String(c['folderId'] ?? ''),
    datasourceUid: String(c['datasourceUid'] ?? ''),
    // InfluxDB
    org: String(c['org'] ?? ''),
    bucket: String(c['bucket'] ?? ''),
    // MISP
    mispUrl: String(c['mispUrl'] ?? ''),
    mispAuthKey: String(c['mispAuthKey'] ?? ''),
    // Shuffle
    webhookUrl: String(c['webhookUrl'] ?? ''),
    workflowId: String(c['workflowId'] ?? ''),
    shuffleApiKey: String(c['shuffleApiKey'] ?? ''),
    // Bedrock
    modelId: String(c['modelId'] ?? ''),
    region: String(c['region'] ?? ''),
    accessKeyId: String(c['accessKeyId'] ?? ''),
    secretAccessKey: String(c['secretAccessKey'] ?? ''),
    nlHuntingEnabled: c['nlHuntingEnabled'] === true,
    explainableAiEnabled: c['explainableAiEnabled'] === true,
    auditLoggingEnabled: c['auditLoggingEnabled'] === true,
  }
}

interface ConnectorFormProps {
  type: ConnectorType
  connector: ConnectorRecord
  readOnly?: boolean
}

export function ConnectorForm({ type, connector, readOnly }: ConnectorFormProps) {
  const upsert = useConnectorsStore(s => s.upsert)
  const role = useConnectorsStore(s => s.role)
  const addAuditLog = useConnectorsStore(s => s.addAuditLog)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)
  const meta = CONNECTOR_META[type]

  const disabled = readOnly || !canEdit(role)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ConnectorFormValues>({
    resolver: zodResolver(getConnectorSchema(type)),
    defaultValues: recordToFormValues(connector),
  })

  const authType = watch('authType')

  const onSubmit = (values: ConnectorFormValues) => {
    const { name, enabled, tags, ...configFields } = values
    upsert(type, {
      name,
      enabled,
      config: {
        ...configFields,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      },
    })
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'update',
      connectorType: type,
      details: `Updated ${meta.label} configuration`,
    })
    toast.success(`${meta.label} configuration saved`)
  }

  function FieldError({ name }: { name: keyof ConnectorFormValues }) {
    const error = errors[name]
    if (!error?.message) return null
    return <p className="text-destructive text-sm">{String(error.message)}</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* General */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          General
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" disabled={disabled} {...register('name')} />
            <FieldError name="name" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Controller
              control={control}
              name="enabled"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Label>Enabled</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Connection - hide for Bedrock which uses IAM */}
      {type !== 'bedrock' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Connection
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('baseUrl')}
                />
                <FieldError name="baseUrl" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Auth Type</Label>
                  <Controller
                    control={control}
                    name="authType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apiKey">API Key</SelectItem>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {authType === 'apiKey' && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      disabled={disabled}
                      {...register('apiKey')}
                    />
                    <FieldError name="apiKey" />
                  </div>
                )}

                {authType === 'basic' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" disabled={disabled} {...register('username')} />
                      <FieldError name="username" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        disabled={disabled}
                        {...register('password')}
                      />
                      <FieldError name="password" />
                    </div>
                  </>
                )}

                {authType === 'bearer' && (
                  <div className="space-y-2">
                    <Label htmlFor="token">Token</Label>
                    <Input id="token" type="password" disabled={disabled} {...register('token')} />
                    <FieldError name="token" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Advanced
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="verifyTLS"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
                <Label>Verify TLS</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeoutSeconds">Timeout (seconds)</Label>
                <Input
                  id="timeoutSeconds"
                  type="number"
                  min={1}
                  max={120}
                  disabled={disabled}
                  {...register('timeoutSeconds', { valueAsNumber: true })}
                />
                <FieldError name="timeoutSeconds" />
              </div>
            </div>
          </div>

          <Separator />
        </>
      )}

      {/* Wazuh fields */}
      {type === 'wazuh' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Wazuh
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="indexerUrl">Indexer URL</Label>
                <Input
                  id="indexerUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('indexerUrl')}
                />
                <FieldError name="indexerUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerUrl">Manager URL (optional)</Label>
                <Input
                  id="managerUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('managerUrl')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexerUsername">Indexer Username</Label>
                <Input id="indexerUsername" disabled={disabled} {...register('indexerUsername')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexerPassword">Indexer Password</Label>
                <Input
                  id="indexerPassword"
                  type="password"
                  disabled={disabled}
                  {...register('indexerPassword')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant">Tenant (optional)</Label>
                <Input id="tenant" disabled={disabled} {...register('tenant')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Graylog fields */}
      {type === 'graylog' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Graylog
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input
                  id="apiUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('apiUrl')}
                />
                <FieldError name="apiUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamId">Stream ID (optional)</Label>
                <Input id="streamId" disabled={disabled} {...register('streamId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexSetId">Index Set ID (optional)</Label>
                <Input id="indexSetId" disabled={disabled} {...register('indexSetId')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Velociraptor fields */}
      {type === 'velociraptor' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Velociraptor
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input
                  id="apiUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('apiUrl')}
                />
                <FieldError name="apiUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgId">Org ID (optional)</Label>
                <Input id="orgId" disabled={disabled} {...register('orgId')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientCert">Client Certificate</Label>
                <Textarea
                  id="clientCert"
                  rows={3}
                  disabled={disabled}
                  {...register('clientCert')}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientKey">Client Key</Label>
                <Textarea id="clientKey" rows={3} disabled={disabled} {...register('clientKey')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Grafana fields */}
      {type === 'grafana' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Grafana
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grafanaUrl">Grafana URL</Label>
                <Input
                  id="grafanaUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('grafanaUrl')}
                />
                <FieldError name="grafanaUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folderId">Folder ID (optional)</Label>
                <Input id="folderId" disabled={disabled} {...register('folderId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datasourceUid">Datasource UID (optional)</Label>
                <Input id="datasourceUid" disabled={disabled} {...register('datasourceUid')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* InfluxDB fields */}
      {type === 'influxdb' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              InfluxDB
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Input id="org" disabled={disabled} {...register('org')} />
                <FieldError name="org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bucket">Bucket</Label>
                <Input id="bucket" disabled={disabled} {...register('bucket')} />
                <FieldError name="bucket" />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              InfluxDB uses token authentication. Set Auth Type to &quot;Bearer Token&quot; above
              and provide your InfluxDB token.
            </p>
          </div>
          <Separator />
        </>
      )}

      {/* MISP fields */}
      {type === 'misp' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              MISP
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mispUrl">MISP URL</Label>
                <Input
                  id="mispUrl"
                  placeholder="https://misp.example.com"
                  disabled={disabled}
                  {...register('mispUrl')}
                />
                <FieldError name="mispUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mispAuthKey">Auth Key</Label>
                <Input
                  id="mispAuthKey"
                  type="password"
                  disabled={disabled}
                  {...register('mispAuthKey')}
                />
                <FieldError name="mispAuthKey" />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Shuffle SOAR fields */}
      {type === 'shuffle' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Shuffle SOAR
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://..."
                  disabled={disabled}
                  {...register('webhookUrl')}
                />
                <FieldError name="webhookUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflowId">Workflow ID</Label>
                <Input id="workflowId" disabled={disabled} {...register('workflowId')} />
                <FieldError name="workflowId" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shuffleApiKey">API Key (optional)</Label>
                <Input
                  id="shuffleApiKey"
                  type="password"
                  disabled={disabled}
                  {...register('shuffleApiKey')}
                />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* AWS Bedrock AI fields */}
      {type === 'bedrock' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              AWS Bedrock AI
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Model</Label>
                <Controller
                  control={control}
                  name="modelId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {BEDROCK_MODELS.map(m => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError name="modelId" />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Controller
                  control={control}
                  name="region"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {AWS_REGIONS.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError name="region" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessKeyId">Access Key ID</Label>
                <Input id="accessKeyId" disabled={disabled} {...register('accessKeyId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretAccessKey">Secret Access Key</Label>
                <Input
                  id="secretAccessKey"
                  type="password"
                  disabled={disabled}
                  {...register('secretAccessKey')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Governance Toggles */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              AI Governance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Natural Language Hunting</Label>
                  <p className="text-muted-foreground text-xs">
                    Allow AI-driven threat hunting queries
                  </p>
                </div>
                <Controller
                  control={control}
                  name="nlHuntingEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Explainable AI</Label>
                  <p className="text-muted-foreground text-xs">
                    Show reasoning steps in AI responses
                  </p>
                </div>
                <Controller
                  control={control}
                  name="explainableAiEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Logging</Label>
                  <p className="text-muted-foreground text-xs">Log all AI model invocations</p>
                </div>
                <Controller
                  control={control}
                  name="auditLoggingEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />
        </>
      )}

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          Metadata
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="tag1, tag2, tag3"
              disabled={disabled}
              {...register('tags')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} disabled={disabled} {...register('notes')} />
          </div>
        </div>
      </div>

      {/* Submit */}
      {!disabled && (
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={!isDirty}>
            Save Configuration
          </Button>
        </div>
      )}
    </form>
  )
}
