// components/user-avatar.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import clsx from "clsx"

interface UserAvatarProps {
  fallbackName?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({
  fallbackName = "User",
  size = "md",
  className,
}: UserAvatarProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState("U")
  const supabase = createClient()

  useEffect(() => {
    const loadAvatar = async () => {
      const { data: auth, error: authError } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (!userId || authError) return

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", userId)
        .single()

      if (error || !profile) return

      if (profile.full_name) setInitials(profile.full_name.charAt(0).toUpperCase())

      if (profile.avatar_url) {
        const { data: signed, error: signedError } = await supabase.storage
          .from("avatars")
          .createSignedUrl(profile.avatar_url, 3600)

        if (!signedError && signed?.signedUrl) {
          setSignedUrl(signed.signedUrl)
        }
      }
    }

    loadAvatar()
  }, [])

  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }[size]

  return (
    <Avatar className={clsx(sizeClass, className)}>
      <AvatarImage src={signedUrl || ""} alt="User Avatar" />
      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
    </Avatar>
  )
}
