"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { UserAvatar } from "../../components/user-avatar"
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
import { LogOut, Settings, User, Loader2, Shield, HelpCircle, Bell, ChevronDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface UserNavProps {
  redirectAfterLogout?: string
  showTooltip?: boolean
  showNotifications?: boolean
  showFullInfo?: boolean
}

export function UserNav({
  redirectAfterLogout = "/auth",
  showTooltip = true,
  showNotifications = false,
  showFullInfo = false,
}: UserNavProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasNotifications, setHasNotifications] = useState(false)
  const [userData, setUserData] = useState<{
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
  } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true)
      const supabase = createClient()

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error || !user) throw error

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single()

        if (profileError) throw profileError

        let signedUrl: string | null = null

        if (profile.avatar_url) {
          const { data: signed, error: signedError } = await supabase
            .storage
            .from("avatars")
            .createSignedUrl(profile.avatar_url, 60 * 60)

          if (signedError) {
            console.error("Error generating signed URL:", signedError.message)
          } else {
            signedUrl = signed?.signedUrl ?? null
          }
        }

        setUserData({
          id: user.id,
          email: user.email,
          full_name: profile.full_name,
          avatar_url: signedUrl ?? undefined,
        })

        if (showNotifications) {
          setHasNotifications(Math.random() > 0.5)
        }
      } catch (err) {
        console.error("Error fetching profile/user data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [showNotifications])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    try {
      await supabase.auth.signOut()
      router.push(redirectAfterLogout)
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error logging out",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getUserDisplayName = () => {
    if (!userData) return "User"
    return userData.full_name || userData.email?.split("@")[0] || "User"
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  const renderButton = () => {
    if (isLoading) {
      return (
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      )
    }

    return (
      <Button variant="ghost" className={`relative ${showFullInfo ? "pl-2 pr-3 py-1 h-10" : "h-10 w-10 rounded-full"}`}>
        <UserAvatar
          userId={userData?.id ?? ""}
          fallbackName={getUserDisplayName()}
          size="sm"
        />
    
        {showFullInfo && (
          <>
            <span className="ml-2 mr-1 hidden sm:inline-block">{getUserDisplayName()}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </>
        )}
    
        {showNotifications && hasNotifications && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
        )}
      </Button>
    )
    
  }

  const navContent = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{renderButton()}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{userData?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/protected/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/protected/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {showNotifications && (
            <DropdownMenuItem onClick={() => router.push("/protected/notifications")}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
              {hasNotifications && (
                <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-xs">
                  New
                </Badge>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/protected/help")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/protected/privacy")}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Privacy Policy</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{navContent}</TooltipTrigger>
          <TooltipContent>
            <p>Account settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return navContent
}
