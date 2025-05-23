import type { Metadata } from "next"
import { ReportsOverview } from "./components/ReportsOverview"
import { ReportsComingSoonOverlay } from "../reports-for-working/components/reports-coming-soon-overlay"
import { requireUserWithAdminStatus } from "@/lib/requireAdmin"

export const metadata: Metadata = {
  title: "Environmental Reports | Ecofilia",
  description: "Access, manage, and generate environmental impact reports",
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
  return <ReportsOverview />
}
