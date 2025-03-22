import type { Metadata } from "next"
import { ReportsOverview } from "./components/ReportsOverview"

export const metadata: Metadata = {
  title: "Environmental Reports | Ecofilia",
  description: "Access, manage, and generate environmental impact reports",
}

export default function ReportsPage() {
  return <ReportsOverview />
}

