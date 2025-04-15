"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MonstiaAvatarProps {
  size?: "sm" | "md" | "lg"
  showFallback?: boolean
}

export function MonstiaAvatar({ size = "md", showFallback = false }: MonstiaAvatarProps) {
  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }[size]

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src="/monstia.png" alt="Monstia" />
      {showFallback && (
        <AvatarFallback className="bg-primary/10 text-primary">M</AvatarFallback>
      )}
    </Avatar>
  )
}
