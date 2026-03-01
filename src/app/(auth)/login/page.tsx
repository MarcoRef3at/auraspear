'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
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
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
              />
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
