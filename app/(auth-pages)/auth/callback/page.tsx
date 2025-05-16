'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const run = async () => {
      // Get the auth code from the URL
      const params = new URLSearchParams(window.location.search)
      const authCode = params.get('code')

      if (!authCode) {
        console.error('❌ No auth code found in URL')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(authCode)
      if (error) {
        console.error('❌ Error al completar el login desde el email:', error.message)
      }

      // Redirige al dashboard o sección protegida
      router.replace('/protected')
    }

    run()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Verifying your session...</p>
    </div>
  )
}
