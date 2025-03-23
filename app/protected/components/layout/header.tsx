"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "./user-nav"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
      {/* LEFT SIDE: Sidebar Trigger */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
      </div>

      {/* CENTER (Empty space grows) */}
      <div className="flex-1" />

      {/* RIGHT SIDE: Mode Toggle + UserNav */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}

