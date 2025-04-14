import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

import { HomePage } from "./components/home-page"

export default async function ProtectedPage() {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user is logged in, redirect to login page
  if (!user) {
    redirect("/auth")
  }
  // Fetch recent documents (limit to 5)
  const { data: recentDocuments } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch projects (limit to 5)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch reports (limit to 5)
  const { data: reports } = await supabase
    .from("reports")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Transform reports data to include project name
  const transformedReports =
    reports?.map((report) => ({
      ...report,
      projectName: report.projects?.name || "Unknown Project",
    })) || []

  return (
    <HomePage
      user={user}
      recentDocuments={recentDocuments || []}
      projects={projects || []}
      reports={transformedReports}
    />
  )
}
