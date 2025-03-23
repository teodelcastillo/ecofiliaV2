"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "./user-nav"
import { ModeToggle } from "./mode-toggle"


export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

