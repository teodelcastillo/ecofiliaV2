import { ReportsNav } from "./ReportsNav"
import { ReportConfiguration } from "./ReportConfiguration"
import { ReportBuilder } from "./ReportBuilder"

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sustainability Reports</h1>
      </div>
      <ReportsNav />
      <div className="space-y-8">
        <ReportConfiguration />
        <ReportBuilder />
      </div>
    </div>
  )
}

