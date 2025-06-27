"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription } from "@/components/ui/card"
import { Zap, Fuel, Users, Plane } from "lucide-react"
import type { FormData } from "./types"

interface StepFootprintProps {
  formData: FormData
  setFormData: (data: FormData) => void
}

export default function StepFootprint({ formData, setFormData }: StepFootprintProps) {
  const handleFootprintChange = (field: keyof FormData["footprint"], value: string) => {
    setFormData({
      ...formData,
      footprint: { ...formData.footprint, [field]: value },
    })
  }

  return (
    <CardContent className="space-y-6">
      <CardDescription>
        Ingresá datos aproximados para una estimación preliminar. Podés dejar campos en blanco.
      </CardDescription>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="electricity">Consumo de electricidad (kWh/año)</Label>
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              id="electricity"
              type="number"
              placeholder="Ej: 50000"
              value={formData.footprint.electricity}
              onChange={(e) => handleFootprintChange("electricity", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuel">Uso de combustibles (litros/año)</Label>
          <div className="flex items-center">
            <Fuel className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              id="fuel"
              type="number"
              placeholder="Ej: 10000"
              value={formData.footprint.fuel}
              onChange={(e) => handleFootprintChange("fuel", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employees">Cantidad de empleados</Label>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              id="employees"
              type="number"
              placeholder="Ej: 50"
              value={formData.footprint.employees}
              onChange={(e) => handleFootprintChange("employees", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="travel">Viajes de trabajo (km/año)</Label>
          <div className="flex items-center">
            <Plane className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              id="travel"
              type="number"
              placeholder="Ej: 20000"
              value={formData.footprint.travel}
              onChange={(e) => handleFootprintChange("travel", e.target.value)}
            />
          </div>
        </div>
      </div>
    </CardContent>
  )
}
