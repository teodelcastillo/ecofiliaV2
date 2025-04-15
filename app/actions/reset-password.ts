"use server"

import { encodedRedirect } from "@/utils/utils"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createServerActionClient<Database>({ cookies })

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    )
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    )
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    )
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated")
}
