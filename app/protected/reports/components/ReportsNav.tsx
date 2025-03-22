"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ReportsNav() {
  const pathname = usePathname()

  return (
    <Tabs defaultValue="reports" className="w-full">
      <TabsList>
        <TabsTrigger value="reports" asChild>
          <Link href="/reports" className={pathname === "/reports" ? "font-medium" : ""}>
            Reports
          </Link>
        </TabsTrigger>
        <TabsTrigger value="templates" asChild>
          <Link href="/reports/templates" className={pathname === "/reports/templates" ? "font-medium" : ""}>
            Templates
          </Link>
        </TabsTrigger>
        <TabsTrigger value="sources" asChild>
          <Link href="/reports/sources" className={pathname === "/reports/sources" ? "font-medium" : ""}>
            Data Sources
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

