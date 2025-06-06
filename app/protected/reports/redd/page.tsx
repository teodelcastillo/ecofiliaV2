"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, TreePine, Lightbulb, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { AISuggestions } from "../components/v2/ai-suggestions"
import { ReportPreview } from "../components/v2/report-preview"

export default function REDDReportsPage() {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [contentPrompt, setContentPrompt] = useState<string>("")
  const [structurePrompt, setStructurePrompt] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("prompt")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [reportGenerated, setReportGenerated] = useState<boolean>(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)
      setActiveTab("preview")
    }, 2000)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <TreePine className="h-6 w-6 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">REDD+ Reports</h1>
            <p className="text-muted-foreground">Reducción de Emisiones por Deforestación y Degradación</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="font-medium text-emerald-900">Programa REDD+</h3>
          <p className="text-sm text-emerald-700 mt-1">Reducing Emissions from Deforestation and forest Degradation</p>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Seleccionar proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="proyecto-1">Proyecto Ecofilia</SelectItem>
            <SelectItem value="proyecto-2">Proyecto Sostenibilidad</SelectItem>
            <SelectItem value="proyecto-3">Proyecto Energía Renovable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="prompt">Contenido</TabsTrigger>
          <TabsTrigger value="structure">Estructura</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contenido del Reporte REDD+</CardTitle>
              <CardDescription>
                Describe los aspectos de conservación forestal y reducción de emisiones a incluir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ej: Necesito un reporte REDD+ que incluya análisis de cobertura forestal, medición de carbono almacenado, evaluación de la deforestación evitada, impacto en comunidades locales y verificación de emisiones reducidas..."
                className="min-h-[150px]"
                value={contentPrompt}
                onChange={(e) => setContentPrompt(e.target.value)}
              />
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h3 className="font-medium">Sugerencias para REDD+</h3>
                </div>
                <AISuggestions type="content" onSelect={(suggestion) => setContentPrompt(suggestion)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estructura del Reporte REDD+</CardTitle>
              <CardDescription>
                Define la estructura siguiendo los estándares del programa REDD+ de la UNFCCC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ej: Estructura REDD+ con línea base forestal, metodología de medición, reporte de actividades, verificación de emisiones reducidas, salvaguardas sociales y ambientales..."
                className="min-h-[150px]"
                value={structurePrompt}
                onChange={(e) => setStructurePrompt(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Reporte REDD+</CardTitle>
              <CardDescription>
                {reportGenerated
                  ? "Tu reporte REDD+ ha sido generado siguiendo los estándares de la UNFCCC"
                  : "Genera tu reporte para ver la vista previa"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportGenerated ? (
                <ReportPreview
                  project={selectedProject}
                  contentPrompt={contentPrompt}
                  structurePrompt={structurePrompt}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TreePine className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay reporte REDD+ generado</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Completa los campos de contenido y estructura para generar tu reporte REDD+
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleGenerateReport}
          disabled={!selectedProject || !contentPrompt || !structurePrompt || isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" />
              Generando Reporte REDD+...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generar Reporte REDD+
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
