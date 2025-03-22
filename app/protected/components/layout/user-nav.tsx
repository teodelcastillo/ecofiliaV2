"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Loader2 } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<{
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      name?: string
      avatar_url?: string
    }
  } | null>(null)

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true)
      const supabase = createClient()

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (user) {
          setUserData(user)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      router.push("/sign-in")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get user display name from metadata or email
  const getUserDisplayName = () => {
    if (!userData) return "User"

    return userData.user_metadata?.full_name || userData.user_metadata?.name || userData.email?.split("@")[0] || "User"
  }

  // Get user avatar or initials
  const getUserAvatar = () => {
    if (!userData) return null

    return userData.user_metadata?.avatar_url || null
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getUserAvatar() || ""} alt={getUserDisplayName()} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

