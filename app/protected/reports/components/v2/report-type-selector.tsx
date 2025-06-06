"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { FileBarChart, Leaf, TreePine, ArrowRight } from "lucide-react"

const reportTypes = [
  {
    id: "mdb",
    title: "MDB Reports",
    description: "Reportes para Bancos Multilaterales de Desarrollo con estándares internacionales",
    icon: FileBarChart,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
    route: "mdb",
  },
  {
    id: "esg",
    title: "ESG Reports",
    description: "Reportes de Sostenibilidad Ambiental, Social y de Gobernanza",
    icon: Leaf,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
    route: "esg",
  },
  {
    id: "redd",
    title: "REDD+",
    description: "Reportes de Reducción de Emisiones por Deforestación y Degradación",
    icon: TreePine,
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    iconColor: "text-emerald-600",
    route: "redd",
  },
]

export function ReportTypeSelector() {
  const router = useRouter()

  const handleSelectType = (route: string) => {
    router.push(`/protected/reports/${route}`)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Selecciona el Tipo de Reporte</h2>
        <p className="text-muted-foreground mt-2">Elige el tipo de reporte que necesitas generar para tu proyecto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((type) => {
          const IconComponent = type.icon
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 ${type.color} hover:shadow-lg`}
              onClick={() => handleSelectType(type.route)}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-white shadow-sm">
                  <IconComponent className={`h-8 w-8 ${type.iconColor}`} />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{type.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  className="w-full gap-2"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectType(type.route)
                  }}
                >
                  Crear Reporte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
