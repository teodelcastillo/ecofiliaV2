"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const kpiTypes = [
  { value: "carbon", label: "Carbon Emissions" },
  { value: "water", label: "Water Usage" },
  { value: "energy", label: "Energy Efficiency" },
  { value: "waste", label: "Waste Management" },
  { value: "supply", label: "Supply Chain" },
]

export function KPIManagementDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Manage KPIs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage KPIs</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="kpi-type">KPI Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select KPI type" />
              </SelectTrigger>
              <SelectContent>
                {kpiTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target">Target Value</Label>
            <Input id="target" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="baseline">Baseline Value</Label>
            <Input id="baseline" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="period">Measurement Period</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

