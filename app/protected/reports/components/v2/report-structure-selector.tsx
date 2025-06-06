"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

type StructureTemplate = {
  id: string
  name: string
  description: string
  template: string
  tags: string[]
}

const structureTemplates: StructureTemplate[] = [
  {
    id: "executive",
    name: "Resumen Ejecutivo",
    description: "Estructura concisa enfocada en resultados clave y conclusiones",
    template:
      "Quiero un reporte con la siguiente estructura:\n1. Resumen ejecutivo (1 página)\n2. Objetivos del proyecto\n3. Resultados clave con métricas\n4. Conclusiones y recomendaciones",
    tags: ["Conciso", "Ejecutivo"],
  },
  {
    id: "detailed",
    name: "Análisis Detallado",
    description: "Estructura completa con análisis profundo y datos extensos",
    template:
      "Necesito un reporte detallado con:\n1. Resumen ejecutivo\n2. Introducción y contexto\n3. Metodología\n4. Análisis de datos (con gráficos)\n5. Hallazgos principales\n6. Análisis comparativo\n7. Conclusiones\n8. Recomendaciones\n9. Apéndices con datos completos",
    tags: ["Detallado", "Analítico"],
  },
  {
    id: "visual",
    name: "Enfoque Visual",
    description: "Estructura centrada en gráficos y visualizaciones",
    template:
      "Quiero un reporte principalmente visual con:\n1. Resumen de una página\n2. Infografía principal de resultados\n3. Sección de gráficos comparativos\n4. Dashboard de métricas clave\n5. Conclusiones visuales\n6. Apéndice con datos tabulares",
    tags: ["Visual", "Gráficos"],
  },
  {
    id: "impact",
    name: "Impacto Ambiental",
    description: "Estructura específica para reportes de sostenibilidad",
    template:
      "Necesito un reporte de impacto ambiental con:\n1. Resumen ejecutivo\n2. Huella de carbono actual\n3. Comparativa con períodos anteriores\n4. Iniciativas de reducción implementadas\n5. Resultados medibles de las iniciativas\n6. Proyecciones futuras\n7. Recomendaciones para mejora continua",
    tags: ["Ambiental", "Sostenibilidad"],
  },
]

interface ReportStructureSelectorProps {
  onSelect: (structure: string) => void
}

export function ReportStructureSelector({ onSelect }: ReportStructureSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelect = (template: StructureTemplate) => {
    setSelectedTemplate(template.id)
    onSelect(template.template)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {structureTemplates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedTemplate === template.id ? "border-2 border-primary" : ""
          }`}
          onClick={() => handleSelect(template)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="bg-primary rounded-full p-1">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
