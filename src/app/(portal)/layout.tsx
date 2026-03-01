import { PortalShell } from '@/components/layout'

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PortalShell>{children}</PortalShell>
}
