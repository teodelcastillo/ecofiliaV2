"use client"

import { CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { FormData } from "./types"
import {
  Leaf,
  Recycle,
  TrendingUp,
  ShieldCheck,
  Briefcase,
} from "lucide-react"

interface StepPrioritiesProps {
  formData: FormData
  setFormData: (data: FormData) => void
}

const prioritiesList = [
  { id: "emissions", label: "Reducir emisiones", icon: <Leaf className="h-6 w-6 text-green-600" /> },
  { id: "circularity", label: "Circularidad y residuos", icon: <Recycle className="h-6 w-6 text-green-600" /> },
  { id: "adaptation", label: "Adaptación al cambio", icon: <TrendingUp className="h-6 w-6 text-green-600" /> },
  { id: "compliance", label: "Cumplimiento normativo", icon: <ShieldCheck className="h-6 w-6 text-green-600" /> },
  { id: "esg", label: "Estrategia ESG", icon: <Briefcase className="h-6 w-6 text-green-600" /> },
] as const

export default function StepPriorities({ formData, setFormData }: StepPrioritiesProps) {
  const handlePriorityChange = (id: keyof FormData["priorities"]) => {
    setFormData({
      ...formData,
      priorities: {
        ...formData.priorities,
        [id]: !formData.priorities[id],
      },
    })
  }

  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prioritiesList.map((p) => (
          <div
            key={p.id}
            onClick={() => handlePriorityChange(p.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              formData.priorities[p.id] ? "border-green-600 bg-green-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {p.icon}
                <span className="font-medium text-slate-700">{p.label}</span>
              </div>
              <Checkbox checked={formData.priorities[p.id]} disabled />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  )
}