"use client"

import type React from "react"
import type { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "../components/layout/sidebar-nav"
import { ModeToggle } from "../components/layout/mode-toggle"
import { UserNav } from "../components/layout/user-nav"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(false)
  const pathname = usePathname()

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true)

    // For demo purposes, randomly set notifications
    setHasNotifications(Math.random() > 0.5)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile sidebar trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex-1">
          {/* Top navigation */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="h-16 flex items-center justify-end px-4">
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="relative">
                        <Bell className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Notifications</span>
                        {hasNotifications && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            <span className="text-[10px]">1</span>
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Theme toggle */}
                <ModeToggle />

                {/* User menu */}
                <UserNav showFullInfo={true} />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
