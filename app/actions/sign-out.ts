"use server"

import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const signOutAction = async () => {
  const supabase = createServerActionClient<Database>({ cookies })
  await supabase.auth.signOut()
  return redirect("/auth")
}
