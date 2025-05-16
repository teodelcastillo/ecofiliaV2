'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export default function CallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'no-session' | 'error'>('loading')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          setStatus('error')
          return
        }

        if (session) {
          setStatus('success')
        } else {
          setStatus('no-session')
        }
      } catch (err) {
        setStatus('error')
      }
    }

    checkSession()
  }, [supabase])

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        return <p className="text-muted-foreground">Verificando sesión...</p>
      case 'success':
        return (
          <>
            <p className="text-green-600 font-medium">¡Tu cuenta fue verificada correctamente!</p>
            <button
              onClick={() => router.push('/protected')}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Ir al inicio
            </button>
          </>
        )
      case 'no-session':
        return (
          <>
            <p className="text-yellow-600 font-medium">
              Tu email fue verificado correctamente, pero necesitás iniciar sesión.
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Iniciar sesión
            </button>
          </>
        )
      case 'error':
      default:
        return (
          <>
            <p className="text-red-600 font-medium">Ocurrió un error al verificar tu cuenta.</p>
            <button
              onClick={() => router.push('/auth')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Volver a iniciar sesión
            </button>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Verificación de cuenta</h1>
      {renderMessage()}
    </div>
  )
}
