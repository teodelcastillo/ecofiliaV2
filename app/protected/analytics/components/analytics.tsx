import { CarbonEmissions } from "./carbon-emissions"
import { WaterUsage } from "./water-usage"
import { EnergyEfficiency } from "./energy-efficiency"
import { WasteManagement } from "./waste-management"
import { SupplyChainImpact } from "./supply-chain-impact"
import { KPIManagementDialog } from "./kpi-management-dialog"

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your organization's key sustainability KPIs</p>
        </div>
        <KPIManagementDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <CarbonEmissions />
        <WaterUsage />
        <EnergyEfficiency />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <WasteManagement />
        <SupplyChainImpact />
      </div>
    </div>
  )
}

