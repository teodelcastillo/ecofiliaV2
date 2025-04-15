import type React from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Sidebar } from "./components/layout/sidebar-nav"
import { Header } from "./components/layout/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type { Database } from "@/types/supabase"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
