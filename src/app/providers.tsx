'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
  children: ReactNode
  messages: Record<string, unknown>
  locale: string
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  useEffect(() => {
    async function initMSW() {
      if (process.env['NEXT_PUBLIC_ENABLE_MSW'] === 'true') {
        const { worker } = await import('@/mocks/browser')
        await worker.start({ onUnhandledRequest: 'bypass' })
      }
    }
    initMSW().catch(console.error)
  }, [])

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
