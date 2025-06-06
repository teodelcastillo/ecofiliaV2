import type { Metadata } from "next"
import { ReportsComingSoonOverlay } from "../reports-for-working/components/reports-coming-soon-overlay"
import { requireUserWithAdminStatus } from "@/lib/requireAdmin"
import { ReportTypeSelector } from "./components/v2/report-type-selector"

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
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-center">Reporting Avanzado</h1>
        <p className="text-muted-foreground text-center mt-2">
          Genera reportes personalizados con IA para tus proyectos de sostenibilidad
        </p>
      </div>

      <ReportTypeSelector />
    </div>
  )}
