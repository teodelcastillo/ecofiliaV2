"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart, PieChart } from "lucide-react"

interface ReportPreviewProps {
  project: string
  contentPrompt: string
  structurePrompt: string
}

export function ReportPreview({ project, contentPrompt, structurePrompt }: ReportPreviewProps) {
  const [activeView, setActiveView] = useState("document")

  // Datos simulados para el reporte
  const reportData = {
    title:
      project === "proyecto-1"
        ? "Reporte de Impacto Ambiental - Proyecto Ecofilia"
        : project === "proyecto-2"
          ? "Análisis de Sostenibilidad - Proyecto Sostenibilidad"
          : "Evaluación de Energía Renovable - Proyecto Energía Renovable",
    date: new Date().toLocaleDateString(),
    sections: [
      {
        title: "Resumen Ejecutivo",
        content:
          "Este reporte presenta un análisis detallado del impacto ambiental del proyecto, destacando una reducción significativa en emisiones de CO2 y un aumento en la eficiencia energética. Los resultados muestran un progreso constante hacia los objetivos de sostenibilidad establecidos.",
      },
      {
        title: "Objetivos del Proyecto",
        content:
          "El proyecto tiene como objetivo principal reducir la huella de carbono en un 30% para finales de 2025, implementar soluciones de energía renovable en todas las instalaciones, y establecer prácticas sostenibles en toda la cadena de suministro.",
      },
      {
        title: "Resultados Clave",
        content:
          "Se ha logrado una reducción del 18% en emisiones de CO2 comparado con el año anterior. El consumo energético ha disminuido en un 22% gracias a la implementación de sistemas de eficiencia. La adopción de prácticas sostenibles ha aumentado en un 45% entre los proveedores principales.",
      },
      {
        title: "Análisis Comparativo",
        content:
          "En comparación con proyectos similares en el sector, este proyecto muestra un rendimiento superior en términos de reducción de emisiones y eficiencia energética. Los indicadores de sostenibilidad están por encima del promedio de la industria en un 15%.",
      },
      {
        title: "Conclusiones y Recomendaciones",
        content:
          "El proyecto demuestra un progreso significativo hacia sus objetivos de sostenibilidad. Se recomienda expandir las iniciativas de energía renovable, implementar un sistema de monitoreo en tiempo real para las emisiones, y desarrollar programas de capacitación adicionales para el personal.",
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-auto">
          <TabsList>
            <TabsTrigger value="document" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Documento</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Gráficos</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          <span>Descargar</span>
        </Button>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <TabsContent value="document" className="mt-0">
            <div className="prose max-w-none">
              <h1 className="text-2xl font-bold mb-2">{reportData.title}</h1>
              <p className="text-muted-foreground mb-6">Fecha: {reportData.date}</p>

              {reportData.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Visualización de Datos</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4">
                  <PieChart className="h-24 w-24 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">Distribución de Impacto Ambiental</p>
                </div>

                <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4">
                  <BarChart className="h-24 w-24 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">Progreso de Reducción de CO2</p>
                </div>

                <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4 md:col-span-2">
                  <BarChart className="h-24 w-24 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">Comparativa con Años Anteriores</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Los gráficos se generan automáticamente basados en los datos del proyecto y el contenido del reporte.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  )
}
