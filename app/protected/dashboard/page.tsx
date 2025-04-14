import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Dashboard } from "./components/dashboard"

export const metadata = {
  title: "Dashboard | Ecofilia",
  description: "Your sustainability management dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }


  // Fetch user's recent documents
  const { data: recentDocuments } = await supabase
    .from("documents")
    .select("id, name, file_path, created_at, category")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch user's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, category, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch recent reports
  const { data: reports } = await supabase
    .from("project_reports")
    .select("id, project_id, type, name, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get project names for reports
  const projectIds = reports?.map((report: { project_id: string }) => report.project_id) || []
  const { data: reportProjects } = await supabase
    .from("projects")
    .select("id, name")
    .in("id", projectIds.length > 0 ? projectIds : ["no-projects"])

  const projectMap = (reportProjects || []).reduce(
    (acc: Record<string, string>, project: { id: string; name: string }) => {
      acc[project.id] = project.name
      return acc
    },
    {} as Record<string, string>,
  )

  // Enrich reports with project names
  const enrichedReports = reports?.map((report: { id: string; type: string; created_at: string; project_id: string; name: string }) => ({
    id: report.id,
    type: report.type,
    created_at: report.created_at,
    project_id: report.project_id,
    name: report.name,
    projectName: projectMap[report.project_id] || "Unknown Project",
  }))

  return (
    <Dashboard
      user={user}
      recentDocuments={recentDocuments || []}
      projects={projects || []}
      reports={enrichedReports || []}
    />
  )
}
