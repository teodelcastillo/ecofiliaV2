"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  FileBarChart,
  Sparkles,
  ChevronRight,
  Globe,
  Building2,
  AlertTriangle,
  Leaf,
  Users,
  CloudRain,
  FileCheck,
  Lightbulb,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Datos simulados
const projects = [
  {
    id: "proyecto-1",
    name: "Proyecto Ecofilia",
    description: "Iniciativa de conservación y desarrollo sostenible",
    documents: [
      { id: "doc-1", name: "Evaluación Ambiental", type: "assessment" },
      { id: "doc-2", name: "Plan de Gestión", type: "plan" },
      { id: "doc-3", name: "Informe de Impacto", type: "report" },
    ],
  },
  {
    id: "proyecto-2",
    name: "Proyecto Sostenibilidad",
    description: "Programa de energías renovables y eficiencia energética",
    documents: [
      { id: "doc-4", name: "Estudio de Factibilidad", type: "study" },
      { id: "doc-5", name: "Análisis de Emisiones", type: "analysis" },
      { id: "doc-6", name: "Plan de Implementación", type: "plan" },
    ],
  },
  {
    id: "proyecto-3",
    name: "Proyecto Energía Renovable",
    description: "Desarrollo de infraestructura para energía solar y eólica",
    documents: [
      { id: "doc-7", name: "Evaluación Técnica", type: "assessment" },
      { id: "doc-8", name: "Estudio de Impacto", type: "study" },
      { id: "doc-9", name: "Plan Operativo", type: "plan" },
    ],
  },
]

const countries = [
  "Argentina",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "México",
  "Panamá",
  "Perú",
  "Uruguay",
]

const sectors = [
  "Energía",
  "Vivienda & Desarrollo Urbano",
  "Agricultura",
  "Transporte",
  "Industria",
  "Construcción",
  "Agua y Saneamiento",
  "Forestal",
  "Residuos",
]

const relevantAspects = [
  { id: "risks", label: "Riesgos climáticos", icon: AlertTriangle },
  { id: "emissions", label: "Emisiones GEI", icon: CloudRain },
  { id: "social", label: "Beneficios sociales", icon: Users },
  { id: "biodiversity", label: "Biodiversidad", icon: Leaf },
  { id: "compliance", label: "Cumplimiento normativo", icon: FileCheck },
  { id: "recommendations", label: "Recomendaciones de mejora", icon: Lightbulb },
]

const aiSuggestions: { [key: string]: string[] } = {
  "proyecto-1": [
    "Incluir análisis de vulnerabilidad climática para las comunidades locales del área de influencia",
    "Destacar las medidas de adaptación implementadas para reducir riesgos de inundaciones",
    "Analizar el potencial de captura de carbono de las áreas conservadas",
  ],
  "proyecto-2": [
    "Cuantificar la reducción de emisiones GEI comparada con escenarios de línea base",
    "Evaluar los co-beneficios sociales de las medidas de eficiencia energética",
    "Incluir análisis de alineación con NDCs nacionales y metas del Acuerdo de París",
  ],
  "proyecto-3": [
    "Detallar el análisis de ciclo de vida de las instalaciones de energía renovable",
    "Evaluar los impactos en biodiversidad y medidas de mitigación implementadas",
    "Incluir proyecciones de reducción de emisiones a 5, 10 y 20 años",
  ],
}



export default function MDBReportsPage() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [reportStructure, setReportStructure] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [sector, setSector] = useState<string>("")
  const [selectedAspects, setSelectedAspects] = useState<string[]>([])
  const [contentPrompt, setContentPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [reportGenerated, setReportGenerated] = useState<boolean>(false)
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([])

    const handleDownload = () => {
    let fileName = ""

    // Determinar el archivo a descargar según el tipo de reporte generado
    if (reportStructure === "paris") {
      fileName = "Brazil Urban Development Project - Climate Change and Sustainability Filter.docx"
    } else if (reportStructure === "overview") {
      fileName = "Brazil Urban Development Project - Project Overview.docx"
    } else if (reportStructure === "annex") {
      fileName = "Brazil Urban Development Project - Climate Change and Sustainability Annex.docx"
    }

    // Crear un elemento de descarga temporal
    const link = document.createElement("a")
    link.href = `/templates/${fileName}` // Ruta a los archivos en la carpeta templates
    link.download = fileName
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Mostrar notificación de éxito (opcional)
    console.log(`Descargando: ${fileName}`)
  }

  // Actualizar sugerencias cuando cambia el proyecto seleccionado
  useEffect(() => {
    if (selectedProject && aiSuggestions[selectedProject]) {
      setCurrentSuggestions(aiSuggestions[selectedProject])
    } else {
      setCurrentSuggestions([])
    }
  }, [selectedProject])

 // Obtener documentos del proyecto seleccionado
  const getProjectDocuments = () => {
    const project = projects.find((p) => p.id === selectedProject)
    return project ? project.documents : []
  }

  // Manejar la selección de aspectos relevantes
  const toggleAspect = (aspectId: string) => {
    setSelectedAspects((prev) => (prev.includes(aspectId) ? prev.filter((id) => id !== aspectId) : [...prev, aspectId]))
  }

  // Avanzar a la siguiente etapa
  const handleNextStage = () => {
    if (currentStage === 2 && (reportStructure === "overview" || reportStructure === "paris")) {
      // Si es "overview" o "paris", saltar directamente a la generación
      handleGenerateReport()
    } else if (currentStage === 2 && reportStructure !== "annex") {
      // Si no es "annex", saltar la etapa 3
      setCurrentStage(4)
    } else {
      setCurrentStage((prev) => prev + 1)
    }
  }

  // Retroceder a la etapa anterior
  const handlePrevStage = () => {
    if (currentStage === 5 && (reportStructure === "overview" || reportStructure === "paris")) {
      // Si venimos de la generación y es "overview" o "paris", volver a la etapa 2
      setCurrentStage(2)
      setReportGenerated(false)
    } else if (currentStage === 4 && reportStructure !== "annex") {
      // Si venimos de la etapa 4 y no es "annex", volver a la etapa 2
      setCurrentStage(2)
    } else if (currentStage === 5) {
      // Si venimos de la etapa 5 (generación), volver a la etapa 4
      setCurrentStage(4)
      setReportGenerated(false)
    } else {
      setCurrentStage((prev) => prev - 1)
    }
  }

  // Generar el reporte
  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulación de generación de reporte
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)
      setCurrentStage(5)
    }, 2000)
  }

  // Aplicar sugerencia de IA
  const applySuggestion = (suggestion: string) => {
    setContentPrompt((prev) => (prev ? `${prev}\n\n${suggestion}` : suggestion))
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <FileBarChart className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MDB Reports</h1>
            <p className="text-muted-foreground">Reportes para Bancos Multilaterales de Desarrollo</p>
          </div>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${
              reportStructure === "overview" || reportStructure === "paris"
                ? currentStage === 5
                  ? 100
                  : (currentStage / 3) * 100
                : (currentStage / 5) * 100
            }%`,
          }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Selección</span>
        <span>Estructura</span>
        {reportStructure === "annex" ? <span>Características</span> : <span></span>}
        {reportStructure === "annex" ? <span>Contenido</span> : <span></span>}
        <span>Reporte</span>
      </div>

      {/* Etapa 1: Selección de proyecto */}
      {currentStage === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Selección de Proyecto</CardTitle>
            <CardDescription>Selecciona el proyecto para el cual deseas generar un reporte MDB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project">Proyecto</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProject && (
                <p className="text-sm text-muted-foreground mt-1">
                  {projects.find((p) => p.id === selectedProject)?.description}
                </p>
              )}
            </div>

            {/* Mostrar documentos incluidos en el proyecto seleccionado */}
            {selectedProject && (
              <div className="space-y-2">
                <Label>Documentos incluidos en este proyecto</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {getProjectDocuments().map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <FileCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Todos estos documentos serán considerados para la generación del reporte
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNextStage} disabled={!selectedProject} className="gap-2">
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Etapa 2: Estructura del reporte */}
      {currentStage === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Estructura del Reporte</CardTitle>
            <CardDescription>Selecciona el tipo de estructura para tu reporte MDB</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={reportStructure} onValueChange={setReportStructure} className="space-y-4">
              <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="overview" id="overview" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="overview" className="font-medium text-base">
                    Project Overview
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Visión general del proyecto con enfoque en sus principales componentes y objetivos de desarrollo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="paris" id="paris" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="paris" className="font-medium text-base">
                    Paris Alignment Filter
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Análisis de alineación del proyecto con los objetivos del Acuerdo de París y contribuciones
                    determinadas a nivel nacional
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="annex" id="annex" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="annex" className="font-medium text-base">
                    Climate Change Annex
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Anexo detallado sobre aspectos de cambio climático, incluyendo riesgos, emisiones y medidas de
                    adaptación/mitigación
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStage}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button onClick={handleNextStage} disabled={!reportStructure} className="gap-2">
              {reportStructure === "overview" || reportStructure === "paris" ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generar Reporte
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Etapa 3: Características del reporte (solo para Climate Change Annex) */}
      {currentStage === 3 && reportStructure === "annex" && (
        <Card>
          <CardHeader>
            <CardTitle>Características del Anexo de Cambio Climático</CardTitle>
            <CardDescription>Define las características específicas para el anexo de cambio climático</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <Label htmlFor="country">País</Label>
              </div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <Label htmlFor="sector">Sector principal</Label>
              </div>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Seleccionar sector" />
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
              <Label>Aspectos relevantes a incluir</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {relevantAspects.map((aspect) => {
                  const Icon = aspect.icon
                  const isSelected = selectedAspects.includes(aspect.id)
                  return (
                    <div
                      key={aspect.id}
                      className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-muted/50"
                      }`}
                      onClick={() => toggleAspect(aspect.id)}
                    >
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleAspect(aspect.id)} id={aspect.id} />
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-muted-foreground"}`} />
                        <Label htmlFor={aspect.id} className={`cursor-pointer ${isSelected ? "text-blue-900" : ""}`}>
                          {aspect.label}
                        </Label>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStage}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              onClick={handleNextStage}
              disabled={!country || !sector || selectedAspects.length === 0}
              className="gap-2"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Etapa 4: Contenido del reporte y sugerencias de IA */}
      {currentStage === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Reporte</CardTitle>
            <CardDescription>
              Define el contenido específico para tu reporte MDB y aprovecha las sugerencias de IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="content">Instrucciones para el reporte</Label>
              <Textarea
                id="content"
                placeholder="Describe el contenido específico que deseas incluir en tu reporte..."
                className="min-h-[150px] mt-2"
                value={contentPrompt}
                onChange={(e) => setContentPrompt(e.target.value)}
              />
            </div>

            {/* Resumen de selecciones */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Resumen de selecciones</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50">
                  {projects.find((p) => p.id === selectedProject)?.name || ""}
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  {reportStructure === "overview"
                    ? "Project Overview"
                    : reportStructure === "paris"
                      ? "Paris Alignment Filter"
                      : "Climate Change Annex"}
                </Badge>
                {reportStructure === "annex" && (
                  <>
                    <Badge variant="outline" className="bg-blue-50">
                      {country}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50">
                      {sector}
                    </Badge>
                    {selectedAspects.map((aspect) => (
                      <Badge key={aspect} variant="outline" className="bg-blue-50">
                        {relevantAspects.find((a) => a.id === aspect)?.label}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Sugerencias de IA */}
            {currentSuggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h3 className="font-medium">Sugerencias de IA para este proyecto</h3>
                </div>
                <div className="grid gap-2">
                  {currentSuggestions.map((suggestion, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <CardContent className="p-3 text-sm">{suggestion}</CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStage}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button onClick={handleGenerateReport} disabled={!contentPrompt || isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generar Reporte
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Etapa 5: Reporte generado */}
      {currentStage === 5 && reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>Reporte MDB Generado</CardTitle>
            <CardDescription>
              Tu reporte ha sido generado siguiendo los estándares de Bancos Multilaterales de Desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="document">
              <TabsList className="mb-4">
                <TabsTrigger value="document">Documento</TabsTrigger>
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              </TabsList>

              <TabsContent value="document" className="space-y-4">
                {reportStructure === "paris" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Activities considered universally aligned to the mitigation goals of the Paris Alignment
                      </CardTitle>
                      <CardDescription>
                        Automated assessment results based on project documentation and activities analysis.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary Statistics 
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-700">9</div>
                          <div className="text-sm text-green-600">Aligned Activities</div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-red-700">25</div>
                          <div className="text-sm text-red-600">Non-Aligned Activities</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-700">26.5%</div>
                          <div className="text-sm text-blue-600">Alignment Rate</div>
                        </div>
                      </div>*/}

                      {/* Progress Bar 
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Paris Alignment Progress</span>
                          <span>26.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full" style={{ width: "26.5%" }}></div>
                        </div>
                      </div>*/}

                      {/* ENERGY Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-blue-900 border-b border-blue-200 pb-1">ENERGY</h3>
                        <div className="grid gap-2">
                          {[
                            {
                              text: "Generation of renewable energy (RE) and/or conversion to electricity applications / energy efficiency/ electrification",
                              aligned: true,
                            },
                            {
                              text: "Rehabilitation + desilting of existing hydropower with climate resilience",
                              aligned: false,
                            },
                            {
                              text: "District heating or cooling systems with negligible lifecycle GHG emissions",
                              aligned: false,
                            },
                            { text: "Green hydrogen", aligned: false },
                            {
                              text: "Electricity transmission and distribution networks, mini-grids based on RE, smart grids and digitalization (excluding data centers), energy storage in batteries",
                              aligned: false,
                            },
                            { text: "Regional integration for energy transport and exchange", aligned: false },
                            { text: "Decommissioning of fossil fuel power plants", aligned: false },
                            { text: "Cleaner cooking technologies", aligned: false },
                            { text: "Actions of the just transition agenda (for energy sector)", aligned: false },
                            { text: "Energy demand-side management investments", aligned: false },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-2 p-3 rounded-lg border ${
                                activity.aligned ? "bg-green-50 border-green-200" : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-full flex items-center justify-center mt-0.5 ${
                                  activity.aligned ? "bg-green-500 text-white" : "text-white"
                                }`}
                              >
                                {activity.aligned ? "✓" : ""}
                              </div>
                              <span className="text-sm leading-relaxed">{activity.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AGRICULTURE Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-green-900 border-b border-green-200 pb-1">
                          AGRICULTURE
                        </h3>
                        <div className="grid gap-2">
                          {[
                            {
                              text: "Afforestation, reforestation, sustainable forest management, soil health improvement, including recuperation of degraded lands or ecosystems",
                              aligned: true,
                            },
                            {
                              text: "Climate smart agriculture*, agroecology*, sustainable fishing* and aquaculture*",
                              aligned: false,
                            },
                            {
                              text: "Conservation of natural habitats and ecosystems; coastal protection",
                              aligned: false,
                            },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-2 p-3 rounded-lg border ${
                                activity.aligned ? "bg-green-50 border-green-200" : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-full flex items-center justify-center mt-0.5 ${
                                  activity.aligned ? "bg-green-500 text-white" : "text-white"
                                }`}
                              >
                                {activity.aligned ? "✓" : ""}
                              </div>
                              <span className="text-sm leading-relaxed">{activity.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WATER AND SANITATION Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-cyan-900 border-b border-cyan-200 pb-1">
                          WATER AND SANITATION
                        </h3>
                        <div className="grid gap-2">
                          {[
                            {
                              text: "Efficiency in water management use, water management at watershed level",
                              aligned: true,
                            },
                            { text: "RE- based irrigation systems", aligned: false },
                            {
                              text: "Water and sanitation works connected to the electricity grid or that depend on their own RE generation",
                              aligned: false,
                            },
                            { text: "Separate waste collection", aligned: true },
                            { text: "Composting & anaerobic digestion of biowaste", aligned: false },
                            {
                              text: "Material recovery, mechanical biological treatment (MBT), refuse-derived fuel (RDF) or solid recovered fuel (SRF)",
                              aligned: false,
                            },
                            { text: "Landfill gas recovery from open and closed landfills", aligned: false },
                            {
                              text: "Drainage and flood control and management (e.g. macro and micro drainage works, urban drainage, separation of rainwater)",
                              aligned: false,
                            },
                            {
                              text: "Water management: projects to conserve and restore ecosystems, control erosion and stabilize riverbanks (including those conducted at basin level)",
                              aligned: false,
                            },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-2 p-3 rounded-lg border ${
                                activity.aligned ? "bg-green-50 border-green-200" : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-full flex items-center justify-center mt-0.5 ${
                                  activity.aligned ? "bg-green-500 text-white" : "text-white"
                                }`}
                              >
                                {activity.aligned ? "✓" : ""}
                              </div>
                              <span className="text-sm leading-relaxed">{activity.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TRANSPORT Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-purple-900 border-b border-purple-200 pb-1">
                          TRANSPORT
                        </h3>
                        <div className="grid gap-2">
                          {[
                            { text: "Electric and non-motorized urban mobility", aligned: true },
                            {
                              text: "Electric passenger or freight TSP, vehicles that do not depend on fossil fuels",
                              aligned: false,
                            },
                            { text: "Low transit roads that provide access*", aligned: false },
                            {
                              text: "Road upgrading, rehabilitation, reconstruction, and maintenance without capacity expansion*",
                              aligned: true,
                            },
                            {
                              text: "Short sea shipping of passengers and freight ships that do not depend on fossil fuels",
                              aligned: false,
                            },
                            {
                              text: "Port infrastructure (maritime inland waterways) that do not depend on fossil fuels",
                              aligned: false,
                            },
                            { text: "Inland waterways passenger and freight transport vessels", aligned: false },
                            { text: "Rail infrastructure", aligned: false },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-2 p-3 rounded-lg border ${
                                activity.aligned ? "bg-green-50 border-green-200" : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-full flex items-center justify-center mt-0.5 ${
                                  activity.aligned ? "bg-green-500 text-white" : "text-white"
                                }`}
                              >
                                {activity.aligned ? "✓" : ""}
                              </div>
                              <span className="text-sm leading-relaxed">{activity.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BUILDINGS Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-orange-900 border-b border-orange-200 pb-1">
                          BUILDINGS
                        </h3>
                        <div className="grid gap-2">
                          <div className="flex items-start space-x-2 p-3 rounded-lg border bg-green-50 border-green-200">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white">
                              ✓
                            </div>
                            <span className="text-sm leading-relaxed">
                              Buildings that meet green certification criteria by IDB Group
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* TECHNOLOGY Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-indigo-900 border-b border-indigo-200 pb-1">
                          TECHNOLOGY
                        </h3>
                        <div className="grid gap-2">
                          <div className="flex items-start space-x-2 p-3 rounded-lg border bg-green-50 border-green-200">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white">
                              ✓
                            </div>
                            <span className="text-sm leading-relaxed">
                              Information & communication (excluding data centers)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SERVICES Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-pink-900 border-b border-pink-200 pb-1">
                          SERVICES
                        </h3>
                        <div className="grid gap-2">
                          {[
                            {
                              text: "Professional, scientific, R&D, and technical activities (provided that they do not increase dependency in fossil fuels nor in any other activities that require a specific assessment).",
                              aligned: true,
                            },
                            {
                              text: "Fiscal support that does not increase dependency in fossil fuels nor in any other activities that require a specific assessment.",
                              aligned: false,
                            },
                            {
                              text: "Public administration and compulsory social security. This also includes services such as labor intermediation and skills development (provided that they do not increase dependency in fossil fuels nor in any other activities that require a specific assessment).",
                              aligned: false,
                            },
                            {
                              text: "Human health, social work and education activities (non-infrastructure/buildings)",
                              aligned: false,
                            },
                            {
                              text: "Arts, entertainment, and recreation (non-infrastructure/buildings)",
                              aligned: false,
                            },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-2 p-3 rounded-lg border ${
                                activity.aligned ? "bg-green-50 border-green-200" : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-full flex items-center justify-center mt-0.5 ${
                                  activity.aligned ? "bg-green-500 text-white" : "text-white"
                                }`}
                              >
                                {activity.aligned ? "✓" : ""}
                              </div>
                              <span className="text-sm leading-relaxed">{activity.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Other Options 
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-gray-900 border-b border-gray-200 pb-1">
                          OTHER OPTIONS
                        </h3>
                        <div className="grid gap-2">
                          <div className="flex items-start space-x-2 p-3 rounded-lg border bg-red-50 border-red-200">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-red-500 text-white">
                              ✗
                            </div>
                            <span className="text-sm leading-relaxed font-medium">
                              No universally aligned activities are financed by the operation
                            </span>
                          </div>
                          <div className="flex items-start space-x-2 p-3 rounded-lg border bg-red-50 border-red-200">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-red-500 text-white">
                              ✗
                            </div>
                            <span className="text-sm leading-relaxed font-medium">Otras</span>
                          </div>
                        </div>
                      </div>*/}

                      {/* Assessment Comments */}
                      <div className="space-y-2">
                        <Label htmlFor="assessment-comments">Assessment Comments and Specifications</Label>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-800 mb-2">
                            ⚠️ TRANSPORT. Road upgrading with significant addition of lanes or that rely on short-term
                            increase of traffic to be economically viable
                          </h4>
                          <div className="text-sm text-yellow-700 space-y-3">
                            <p>
                              The operation includes the expansion of one additional lane on Avenida Beira Mar Norte and
                              the creation of grade-separated intersections to improve traffic flow along key urban
                              mobility corridors in Florianópolis. This activity falls under the category of road
                              expansion with increased capacity, requiring a specific alignment assessment according to
                              the Joint Methodology of MDBs.
                            </p>
                            <p>
                              To ensure alignment with the Paris Agreement mitigation goals, the design of the Avenida
                              Beira Mar Norte lane expansion and grade-separated intersections should incorporate the
                              following recommendations:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>
                                Public transport prioritization through dedicated lanes, operational sequencing, and
                                performance indicators to ensure at least 30% of total traffic demand is met by public
                                transport.
                              </li>
                              <li>
                                Integration with sustainable mobility strategies, including expanded pedestrian
                                infrastructure and bike lanes to encourage non-motorized transport.
                              </li>
                              <li>
                                Incorporation of a Sustainable Urban Mobility Plan (PLAMUS) to align road investments
                                with long-term low-carbon mobility strategies.
                              </li>
                              <li>
                                Development of a decarbonization roadmap, outlining zero-carbon pilot initiatives for
                                mobility, historic center, housing, and urban planning.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Contenido original para otros tipos de reporte

                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h1 className="text-2xl font-bold mb-2">Project Overview</h1>
                      <h2 className="text-xl font-semibold text-blue-800 mb-4">
                        Urban Development Program of Florianópolis - Floripa for All
                      </h2>
                      <p className="text-muted-foreground mb-6">Fecha: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Project Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900">Project Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          The Urban Development Program of Florianópolis (Floripa for All) is a strategic initiative
                          financed by the Inter-American Development Bank (IDB) in partnership with the Municipality of
                          Florianópolis. The project seeks to address urban development challenges in Florianópolis,
                          focusing on sustainability, resilience, and inclusivity. It is structured under a Multiple
                          Works Modality and has a total budget of USD 150 million, with USD 120 million from the IDB
                          and USD 30 million in local counterpart funding.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Objectives */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900">Objectives</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed">
                          The project aims to promote a sustainable and inclusive urban-territorial development model
                          for Florianópolis, responding to critical urban challenges such as housing shortages,
                          inefficient mobility infrastructure, environmental risks, and limited institutional capacity
                          for urban governance.
                        </p>

                        <div>
                          <h4 className="font-medium mb-2">Specific objectives:</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Expanding access to adequate and resilient housing for vulnerable populations.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Enhancing the urban and environmental quality of the Historic Center of Florianópolis.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Improving mobility infrastructure, particularly for public transport and non-motorized
                                mobility.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Strengthening the institutional capacity for urban planning, territorial management, and
                                security.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Climate and Sustainability */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900">Climate and Sustainability</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-green-800">Paris Alignment:</h4>
                          <p className="text-sm leading-relaxed">
                            This operation has been analyzed using the Joint Multilateral Development Bank (MDB)
                            Framework for Paris Alignment Analysis and the IDB Group's Paris Agreement Alignment
                            Approach (PAIA) (GN-3142-1). Based on the PAIA assessment, the operation has been determined
                            as: (i) Aligned with the adaptation goal of the Paris Agreement (PA); and (ii) Aligned with
                            the mitigation goal of the PA, following a specific analysis. The alignment was established
                            by (i) integrating a long-term climate resilience strategy for Florianópolis, (ii)
                            incorporating public transport prioritization in road infrastructure to reduce reliance on
                            private fossil fuel-based vehicles. Additionally, it (iii) promotes sustainable mobility
                            models, enhancing pedestrian and cycling infrastructure while supporting feasibility studies
                            for future Bus Rapid Transit (BRT) implementation, reinforcing the city's transition to a
                            low-carbon and resilient urban development model.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-blue-800">Climate Finance:</h4>
                            <p className="text-sm">
                              <span className="font-semibold text-2xl text-blue-900">53.44%</span> of project financing
                              qualifies as climate finance, supporting energy and water efficiency, climate risk
                              reduction, sustainable mobility, and resilient urban planning.
                            </p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-green-800">Green Finance:</h4>
                            <p className="text-sm">
                              <span className="font-semibold text-2xl text-green-900">54.23%</span> of the total
                              financing is classified as green finance, promoting biodiversity restoration, water
                              resource protection, and disaster risk management.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expected Impact */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900">Expected Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Housing Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Improved living conditions for over 1,600 families through access to resilient
                                  housing.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                              <Leaf className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Environmental Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Reduced congestion and emissions by prioritizing public transport and non-motorized
                                  mobility.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                              <Building2 className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Governance Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Strengthened urban governance, promoting inclusive and climate-resilient development.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                              <FileBarChart className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Economic Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Revitalization of the Historic Center, boosting economic activity and tourism.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview">
                <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileBarChart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Vista previa del documento</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Aquí se mostraría una vista previa visual del documento generado
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStage(4)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <FileBarChart className="h-4 w-4" />
              Descargar Reporte
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
