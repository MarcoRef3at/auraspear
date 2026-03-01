'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const t = useTranslations('auth')
  const tApp = useTranslations('app')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    // Placeholder: no actual auth, just redirect to dashboard
    setTimeout(() => {
      document.cookie = 'auth-token=demo; path=/'
      router.push('/dashboard')
    }, 500)
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <Shield className="text-primary-foreground h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {tApp('name')}
          </p>
          <CardTitle className="text-xl">{t('welcomeBack')}</CardTitle>
          <CardDescription>{t('signInDescription')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="analyst@auraspear.io"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <button type="button" className="text-primary text-xs hover:underline">
                  {t('forgotPassword')}
                </button>
              </div>
              <Input id="password" type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('signingIn') : t('signInButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
