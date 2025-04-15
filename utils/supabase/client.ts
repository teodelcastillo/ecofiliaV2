import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { type Database } from "@/types/supabase"

export function createClient() {
  return createPagesBrowserClient<Database>()
}
