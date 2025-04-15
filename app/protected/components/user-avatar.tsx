"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import clsx from "clsx"

interface UserAvatarProps {
  userId: string
  fallbackName?: string
  size?: "sm" | "md" | "lg"
  className?: string
  avatarUrl?: string // optional: directly pass raw Supabase storage path
}

export function UserAvatar({
  userId,
  fallbackName = "User",
  size = "md",
  className,
  avatarUrl,
}: UserAvatarProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (avatarUrl) {
      generateSignedUrl(avatarUrl)
    } else {
      fetchAvatarPath()
    }

    async function fetchAvatarPath() {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single()

      if (error) {
        console.warn("No avatar in profile:", error.message)
        return
      }

      if (data?.avatar_url) {
        generateSignedUrl(data.avatar_url)
      }
    }

    async function generateSignedUrl(path: string) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 3600)

      if (error) {
        console.error("Failed to generate signed avatar URL:", error.message)
      } else {
        setSignedUrl(data?.signedUrl || null)
      }
    }
  }, [userId, avatarUrl, supabase])

  const initials = fallbackName.charAt(0).toUpperCase()
  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }[size]

  return (
    <Avatar className={clsx(sizeClass, className)}>
      <AvatarImage src={signedUrl || ""} alt={fallbackName} />
      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
    </Avatar>
  )
}
