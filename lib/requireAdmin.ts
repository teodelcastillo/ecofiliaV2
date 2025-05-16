// lib/require-user-with-admin.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function requireUserWithAdminStatus() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, supabase, isAdmin: false }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('admin')
    .eq('id', user.id)
    .single()

  return {
    user,
    supabase,
    isAdmin: profile?.admin === true,
  }
}
