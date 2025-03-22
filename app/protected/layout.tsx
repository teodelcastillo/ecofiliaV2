import type React from "react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SidebarNav } from "./components/layout/sidebar-nav"
import { Header } from "./components/layout/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user is logged in, redirect to login page
  if (!user) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

