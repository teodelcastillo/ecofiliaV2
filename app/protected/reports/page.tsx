import { TbReportAnalytics } from "react-icons/tb"
import { ReportsComingSoonOverlay } from "./components/reports-coming-soon-overlay"
import { requireUserWithAdminStatus } from "@/lib/requireAdmin"

export const metadata = {
  title: "Environmental Reports | Ecofilia",
  description: "Generate and manage environmental reports for your sustainability projects",
}

export default async function ReportsPage() {
  const { user, isAdmin } = await requireUserWithAdminStatus()

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-lg">Debes iniciar sesión para acceder a esta sección.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <ReportsComingSoonOverlay />
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <TbReportAnalytics className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Create and manage your own report templates and use smart agents to automate repetitive tasks — from document
        summarization to full sustainability reporting.
      </p>

      {/* This is the background content that will be visible but blurred */}
      <div className="relative min-h-[400px]">
        {/* You can keep a simplified version of your ReportsOverview component here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-lg border bg-card p-6 shadow-sm">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium">Report Template {i}</h3>
                  <p className="text-muted-foreground mt-2">Placeholder for report template description</p>
                </div>
                <div className="h-8 bg-muted/50 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
