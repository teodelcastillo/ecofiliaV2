"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MonstiaAvatarProps {
  size?: "sm" | "md" | "lg"
  showFallback?: boolean
}

export function MonstiaAvatar({ size = "md", showFallback = false }: MonstiaAvatarProps) {
  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }[size]

  return (
    <Avatar className={sizeClass}>
      <AvatarImage asChild>
        <Image
          src="/monstia.png"
          alt="Monstia"
          width={64}
          height={64}
          className="object-cover"
        />
      </AvatarImage>
      {showFallback && (
        <AvatarFallback className="bg-primary/10 text-primary">M</AvatarFallback>
      )}
    </Avatar>
  )
}
