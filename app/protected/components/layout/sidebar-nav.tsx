"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { redirect, usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Settings,
  ChevronDown,
  Zap,
  Users,
  Folder,
  Leaf,
  Clipboard,
  MessageSquare,
  LibraryBig,
  Home
} from "lucide-react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Define menu items with proper typing
interface MenuItem {
  icon: React.ElementType
  label: string
  href?: string
  badge?: string
  dropdown?: boolean
  submenu?: SubMenuItem[]
}

interface SubMenuItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
}

// Main menu items
const menuItems: MenuItem[] = [

  {
    icon: Zap,
    label: "Functionalities",
    dropdown: true,
    submenu: [
      {icon: Home, label: "Home", href: "/protected"},
      { icon: Leaf, label: "Sustainability Library", href: "/protected/sustainability-library" },
      { icon: LibraryBig, label: "My Library", href: "/protected/my-library" },
      { icon: Folder, label: "Projects", href: "/protected/projects" },
      { icon: MessageSquare, label: "Ecofilia Expert", href: "/protected/ecofilia-expert" },
      { icon: Clipboard, label: "Reports", href: "/protected/reports", badge: "SOON" },
      { icon: BarChart, label: "Analytics", href: "/protected/analytics", badge: "SOON" },
    ],
  },
  { icon: Users, label: "User Management", href: "/protected/users" },
  { icon: Settings, label: "Settings", href: "/protected/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    functionalities: true, // Default open state
  })
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Check if a path is active (exact match or starts with path for nested routes)
  const isActive = (href: string) => {
    if (href === "/protected/" && pathname === "/protected") {
      return true
    }
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  // Toggle dropdown state
  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Effect to auto-open dropdown when a child route is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.dropdown && item.submenu) {
        const hasActiveChild = item.submenu.some((subItem) => isActive(subItem.href))
        if (hasActiveChild) {
          setOpenDropdowns((prev) => ({
            ...prev,
            [item.label.toLowerCase()]: true,
          }))
        }
      }
    })
  }, [pathname])

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center gap-2 h-16 px-4 border-b" >
        <Leaf className="h-6 w-6 text-primary" />
        <span onClick={() => redirect("/protected")} className="font-bold text-xl tracking-tight">Ecofilia</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {menuItems.map((item) => {
            if (item.dropdown) {
              const dropdownKey = item.label.toLowerCase()
              const isOpen = openDropdowns[dropdownKey]

              return (
                <Collapsible
                  key={dropdownKey}
                  open={isOpen}
                  onOpenChange={() => toggleDropdown(dropdownKey)}
                  className="w-full mb-1"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors ${
                          isOpen ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>

                  <CollapsibleContent>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4 mt-1 space-y-1"
                        >
                          {item.submenu?.map((subItem) => {
                            const subActive = isActive(subItem.href)
                            return (
                              <SidebarMenuItem key={subItem.href}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SidebarMenuButton asChild>
                                        <Link
                                          href={subItem.href}
                                          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-colors ${
                                            subActive
                                              ? "bg-primary/10 text-primary font-medium"
                                              : "hover:bg-muted text-muted-foreground"
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <subItem.icon className="h-4 w-4" />
                                            <span>{subItem.label}</span>
                                          </div>
                                          {subItem.badge && (
                                            <Badge
                                              variant="outline"
                                              className="ml-auto bg-primary/10 text-primary text-xs"
                                            >
                                              {subItem.badge}
                                            </Badge>
                                          )}
                                        </Link>
                                      </SidebarMenuButton>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className={isCollapsed ? "" : "hidden"}>
                                      {subItem.label}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </SidebarMenuItem>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            const active = item.href ? isActive(item.href) : false

            return (
              <SidebarMenuItem key={item.label} className="mb-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href || "#"}
                          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-colors ${
                            active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={isCollapsed ? "" : "hidden"}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarTrigger>
          <Button variant="outline" size="sm" className="w-full">
            <div className="flex items-center justify-center w-full">
              <ChevronDown
                className={`h-4 w-4 mr-2 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
              />
              <span>{isCollapsed ? "Expand" : "Collapse"}</span>
            </div>
          </Button>
        </SidebarTrigger>
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  )
}
