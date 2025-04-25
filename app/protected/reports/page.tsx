import { TbReportAnalytics } from "react-icons/tb"
import { ReportsOverview } from "./components/reports-overview"

export const metadata = {
  title: "Environmental Reports | Ecofilia",
  description: "Generate and manage environmental reports for your sustainability projects",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-primary/10 p-2 rounded-full">
        <TbReportAnalytics className="h-5 w-5 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">Reports</h1>
    </div>
    <p className="text-muted-foreground mb-8">
    Create and manage your own report templates and use smart agents to automate repetitive tasks — from document summarization to full sustainability reporting.      </p>
    <ReportsOverview />
    </div>
  )
}
