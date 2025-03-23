"use client"

import { useState } from "react"
import { Home, FolderKanban, BarChart, FileText, Compass, Settings, ChevronDown, Zap, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  { icon: Home, label: "Home", href: "/protected/" },
  { icon: Zap, label: "Functionalities", dropdown: true },
  { icon: Users, label: "User management", href: "/protected/users" },
  { icon: Settings, label: "Settings", href: "/protected/settings" },
]

const functionalitiesItems = [
  { icon: FolderKanban, label: "Sustainability library", href: "/protected/sustainability-library" },
  { icon: FolderKanban, label: "My Library", href: "/protected/my-library" },
  { icon: BarChart, label: "Analytics", href: "/protected/analytics" },
  { icon: FileText, label: "Reports", href: "/protected/reports" },
  { icon: Compass, label: "Sustainability Assistant", href: "/protected/document-chat" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  if (pathname === "/") return null // Hide sidebar when on homepage

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center justify-center h-14 border-b">
        <h1 className="text-xl font-bold">Ecofilia</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col space-y-2 mt-2">
          {menuItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key="functionalities" className="w-full">
                  <SidebarMenuButton
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center w-full px-4 py-3 text-left text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    <item.icon />
                    <span className="font-medium">Functionalities</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </SidebarMenuButton>
                  {isDropdownOpen && (
                    <div className="pl-6 mt-1 space-y-1">
                      {functionalitiesItems.map((subItem) => {
                        const isActive = pathname === subItem.href
                        return (
                          <SidebarMenuItem key={subItem.href} className="w-full">
                            <SidebarMenuButton asChild className="w-full">
                              <Link
                                href={subItem.href}
                                className={`flex items-center gap-3 py-2 w-full rounded-lg transition-colors
                                  ${isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}
                                `}
                              >
                                <subItem.icon className="h-5 w-5" />
                                <span className="text-sm font-medium">{subItem.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href} className="w-full">
                <SidebarMenuButton asChild className="w-full">
                  <Link
                    href={item.href ? item.href : "#"}
                    className={`flex items-center gap-3 py-3 pl-4 w-full rounded-lg transition-colors
                      ${isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}
                    `}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </ShadcnSidebar>
  )
}
