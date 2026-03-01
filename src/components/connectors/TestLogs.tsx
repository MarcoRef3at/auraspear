'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TestLogsProps {
  logs: string[]
  lastError: string | null
}

export function TestLogs({ logs, lastError }: TestLogsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Test Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {lastError && (
          <div className="bg-destructive/10 text-destructive mb-3 rounded-md p-3 text-sm">
            {lastError}
          </div>
        )}
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No test logs yet. Run a test to see results.
          </p>
        ) : (
          <ScrollArea className="h-48">
            <div className="space-y-1 font-mono text-xs">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes('ERROR')
                      ? 'text-destructive'
                      : log.includes('OK') || log.includes('successfully')
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
