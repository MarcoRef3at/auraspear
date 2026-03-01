import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'AuraSpear SOC',
  description: 'Security Operations Center',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = 'en'
  const messages = (await import(`@/i18n/${locale}.json`)).default as Record<string, unknown>

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers messages={messages} locale={locale}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-card text-card-foreground border-border',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
