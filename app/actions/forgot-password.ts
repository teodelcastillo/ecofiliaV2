"use server"

import { encodedRedirect } from "@/utils/utils"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "@/types/supabase"

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString()
  const callbackUrl = formData.get("callbackUrl")?.toString()
  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "ecofilia.host"

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required")
  }

  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  })

  if (error) {
    console.error("Reset error:", error.message)
    return encodedRedirect("error", "/forgot-password", "Could not reset password")
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  )
}
