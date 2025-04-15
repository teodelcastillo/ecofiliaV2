import { HomePage } from "./components/home-page"
import { requireUser } from "@/lib/require-user"

export default async function ProtectedPage() {
  const { user, supabase } = await requireUser()

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

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
    .from("project_reports")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Transform reports to include project name
  const transformedReports =
    reports?.map((report) => ({
      ...report,
      projectName: report.projects?.name || "Unknown Project",
    })) || []

  return (
    <HomePage
      user={user}
      profile={profile}
      recentDocuments={recentDocuments || []}
      projects={projects || []}
      reports={transformedReports}
    />
  )
}
