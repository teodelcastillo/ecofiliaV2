"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, Globe } from "lucide-react"
import type { FormData } from "./types"
import type { Dispatch, SetStateAction } from "react"

interface StepGeneralProps {
  formData: FormData
  setFormData: Dispatch<SetStateAction<FormData>>
}


const sectors = ["Tecnología", "Manufactura", "Retail", "Servicios Financieros", "Salud", "Otro"]
const sizes = ["Micro (1-9 empleados)", "PYME (10-249 empleados)", "Grande (250+ empleados)"]

export default function StepGeneral({ formData, setFormData }: StepGeneralProps) {
  const handleChange = (field: keyof FormData["general"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="org-name">Nombre de la organización</Label>
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              id="org-name"
              placeholder="Ej: Ecofilia S.A."
              value={formData.general.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-slate-400 mr-2" />
            <Input
              id="country"
              placeholder="Ej: Argentina"
              value={formData.general.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector">Sector</Label>
          <Select onValueChange={(value) => handleChange("sector", value)} value={formData.general.sector}>
            <SelectTrigger id="sector">
              <SelectValue placeholder="Seleccione un sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Tamaño</Label>
          <Select onValueChange={(value) => handleChange("size", value)} value={formData.general.size}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Seleccione el tamaño" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>¿Ya tienen un plan de sostenibilidad o mediciones previas?</Label>
        <RadioGroup
          className="flex space-x-4"
          onValueChange={(value) => handleChange("hasPlan", value)}
          value={formData.general.hasPlan}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Sí</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}