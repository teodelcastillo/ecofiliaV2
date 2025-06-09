"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  TreePine,
  Sparkles,
  ChevronRight,
  FileCheck,
  Download,
  Leaf,
  Users,
  Building2,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Datos simulados
const projects = [

  {
    id: "proyecto-2",
    name: "Proyecto Cuenca Caimancito (Jujuy, Argentina)",
    description: "Evaluación de Salvaguardas REDD+ – Proyecto Cuenca Caimancito (Jujuy, Argentina)",
    documents: [
      { id: "doc-4", name: "Plan de Acción Nacional de Bosques y Cambio Climatico (Argentina, 2017)", type: "study" },
      { id: "doc-5", name: "Primer resumen de Informacion Salvaguardas REDD (ARG, 2019)", type: "analysis" },
      { id: "doc-6", name: "Plan Estrategico Forestal Cuenca Caimancito", type: "plan" },
    ],
  },

]

const aiSuggestions = {
  "proyecto-1": [
    "Incluir análisis de cobertura forestal y deforestación evitada en el área del proyecto",
    "Evaluar el potencial de captura de carbono de los bosques conservados y restaurados",
    "Analizar el impacto en las comunidades locales y pueblos indígenas del área de influencia",
  ],
  "proyecto-2": [
    "Cuantificar las emisiones de CO2 evitadas por la conservación forestal",
    "Evaluar la biodiversidad protegida y los servicios ecosistémicos conservados",
    "Incluir análisis de sostenibilidad financiera del proyecto REDD+",
  ],
  "proyecto-3": [
    "Detallar la metodología de monitoreo, reporte y verificación (MRV) implementada",
    "Evaluar las salvaguardas sociales y ambientales aplicadas en el proyecto",
    "Incluir proyecciones de reducción de emisiones a largo plazo",
  ],
}

export default function REDDReportsPage() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [reportStructure, setReportStructure] = useState<string>("")
  const [contentPrompt, setContentPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [reportGenerated, setReportGenerated] = useState<boolean>(false)
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([])

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

  // Avanzar a la siguiente etapa
  const handleNextStage = () => {
    if (currentStage === 2) {
      // Ambas opciones van directamente a la generación
      handleGenerateReport()
    } else {
      setCurrentStage((prev) => prev + 1)
    }
  }

  // Retroceder a la etapa anterior
  const handlePrevStage = () => {
    if (currentStage === 3) {
      // Si venimos de la generación, volver a la etapa 2
      setCurrentStage(2)
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
      setCurrentStage(3)
    }, 2000)
  }

  // Aplicar sugerencia de IA
  const applySuggestion = (suggestion: string) => {
    setContentPrompt((prev) => (prev ? `${prev}\n\n${suggestion}` : suggestion))
  }

  const handleDownload = () => {
    let fileName = ""

    // Determinar el archivo a descargar según el tipo de reporte generado
    if (reportStructure === "filter") {
      fileName = "Brazil Forest Conservation Project - REDD+ Filter.docx"
    } else if (reportStructure === "overview") {
      fileName = "Brazil Forest Conservation Project - Project Overview.docx"
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

      {/* Indicador de progreso */}
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${currentStage === 3 ? 100 : (currentStage / 3) * 100}%`,
          }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Selección</span>
        <span>Estructura</span>
        <span>Reporte</span>
      </div>

      {/* Etapa 1: Selección de proyecto */}
      {currentStage === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Selección de Proyecto</CardTitle>
            <CardDescription>Selecciona el proyecto para el cual deseas generar un reporte REDD+</CardDescription>
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
                      <FileCheck className="h-4 w-4 text-emerald-600" />
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
            <CardDescription>Selecciona el tipo de estructura para tu reporte REDD+</CardDescription>
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
                    Visión general del proyecto REDD+ con enfoque en conservación forestal y reducción de emisiones
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="filter" id="filter" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="filter" className="font-medium text-base">
                    REDD+ Filter
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Análisis específico de cumplimiento con estándares REDD+ y criterios de elegibilidad
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
              <Sparkles className="h-4 w-4" />
              Generar Reporte
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Etapa 3: Reporte generado */}
      {currentStage === 3 && reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>Reporte REDD+ Generado</CardTitle>
            <CardDescription>
              Tu reporte ha sido generado siguiendo los estándares del programa REDD+ de la UNFCCC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="document">
              <TabsList className="mb-4">
                <TabsTrigger value="document">Documento</TabsTrigger>
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              </TabsList>

              <TabsContent value="document" className="space-y-4">
                {reportStructure === "filter" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proyecto Cuenca Caimancito (Jujuy, Argentina)</CardTitle>
                      <CardDescription>
                        Evaluación de Salvaguardas REDD+ – Proyecto Cuenca Caimancito (Jujuy, Argentina)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Salvaguarda (a) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (a): Consistencia con los objetivos nacionales de REDD+
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-green-50 border-green-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white font-bold">
                            ✅
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-green-800">Cumplida</span>
                            <p className="text-sm leading-relaxed">
                              El proyecto demuestra una clara alineación con la Ley Nacional de Presupuestos Mínimos de Protección Ambiental de los Bosques Nativos (Ley 26.331), con el Ordenamiento Territorial de Bosques Nativos de la provincia de Jujuy, y con el Plan de Acción Nacional de Bosques y Cambio Climático (PANByCC). La formulación del plan contó con participación institucional de organismos provinciales, nacionales y actores del sector forestal, en un marco de gobernanza articulada. Propone actividades como:
                            </p>
                            <ul className="text-sm space-y-1 ml-4">
                              <li>• Fortalecimiento institucional local</li>
                              <li>• Restauración de bosques nativos</li>
                              <li>• Ordenamiento territorial</li>
                            </ul>
                            <p className="text-sm">
                              Estas se corresponden con las acciones estratégicas prioritarias del país para la
                              conservación forestal y mitigación del cambio climático.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">
                              📌 Referencias específicas del plan: pág. 7–8, 11, 25–27
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Salvaguarda (b) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (b): Transparencia y gobernanza forestal efectiva
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-green-50 border-green-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white font-bold">
                            ✅
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-green-800">Cumplida</span>
                            <p className="text-sm leading-relaxed">
                              Se evidencia una estructura institucional clara, con participación del Ministerio de
                              Ambiente de Jujuy, municipios, INTA y comunidades locales. Se incluye un sistema de
                              monitoreo y seguimiento participativo, así como fortalecimiento de capacidades técnicas y
                              legales. Se destaca la conformación de la “Mesa Forestal de Caimancito”, un espacio multi-actoral donde se llevaron adelante procesos participativos para la elaboración del plan, incluyendo talleres, entrevistas y revisión de propuestas.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">
                              📌 Referencias: pág. 10–11, 17–18, 27–30
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Salvaguarda (c) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (c): Derechos y conocimientos de pueblos indígenas y comunidades locales
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-yellow-500 text-white font-bold">
                            ⚠
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-yellow-800">Parcialmente cumplida</span>
                            <p className="text-sm leading-relaxed">
                              El documento reconoce la presencia de 32 comunidades indígenas (Guaraníes, Kollas y Ocloyas) dentro del área de influencia. Si bien se valoran los esfuerzos de inclusión y reconocimiento cultural, no se evidencian mecanismos formales de consulta previa, libre e informada (CPLI) que aseguren el consentimiento frente a actividades que puedan afectar sus territorios o medios de vida.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">📌 Mención general: pág. 9, 12, 28</p>
                            <p className="text-xs text-orange-600 font-medium">
                              📌 Recomendación: incluir marco de CLPI conforme al Marco de Participación Indígena REDD+
                              Argentina
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Salvaguarda (d) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (d): Participación plena y efectiva de actores relevantes
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-green-50 border-green-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white font-bold">
                            ✅
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-green-800">Cumplida</span>
                            <p className="text-sm leading-relaxed">
                              El documento detalla talleres participativos, encuestas y reuniones con actores locales
                              para definir acciones estratégicas. Se promueve la corresponsabilidad en la
                              implementación.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">📌 Referencias: pág. 8, 12, 29</p>
                          </div>
                        </div>
                      </div>

                      {/* Salvaguarda (e) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (e): Conservación de bosques naturales y biodiversidad
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-green-50 border-green-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white font-bold">
                            ✅
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-green-800">Cumplida</span>
                            <p className="text-sm leading-relaxed">
                              El 26% del territorio de la cuenca se encuentra en categoría I de conservación, incluyendo áreas protegidas como el Parque Nacional Calilegua. El plan propone corredores biológicos, restauración ecológica y uso sostenible del bosque nativo, priorizando su integridad ecológica. El plan promueve la protección de bosques nativos de yungas, la restauración de cuencas,
                              el control de incendios y la conservación de corredores biológicos. Identifica amenazas y
                              propone acciones concretas de mitigación ambiental.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">📌 Referencias: pág. 13–14, 23–24</p>
                          </div>
                        </div>
                      </div>

                      {/* Salvaguarda (f) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (f): Riesgos sociales y ambientales
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-yellow-500 text-white font-bold">
                            ⚠
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-yellow-800">Parcialmente cumplida</span>
                            <p className="text-sm leading-relaxed">
                              El proyecto incluye acciones orientadas al desarrollo local, generación de empleo, fortalecimiento de capacidades productivas y reducción de la pobreza rural. También plantea beneficios ambientales como la restauración de ecosistemas degradados y el uso eficiente de los recursos forestales. 
                              Aunque se identifican amenazas y se proponen medidas de mitigación, no se incluye un Plan
                              de Gestión Ambiental y Social (PGAS) detallado que evalúe impactos y riesgos en
                              profundidad.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">📌 Referencia: pág. 13, 15, 26</p>
                            <p className="text-xs text-orange-600 font-medium">
                              📌 Recomendación: elaborar un PGAS que aborde riesgos diferenciados (pueblos indígenas,
                              género, biodiversidad)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Salvaguarda (g) */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-emerald-900 border-b border-emerald-200 pb-1">
                          Salvaguarda (g): Reversión y desplazamiento de emisiones
                        </h3>
                        <div className="flex items-start space-x-2 p-4 rounded-lg border bg-green-50 border-green-200">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 bg-green-500 text-white font-bold">
                            ✅
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-green-800">Cumplida</span>
                            <p className="text-sm leading-relaxed">
                              Se prevén acciones de sostenibilidad a largo plazo: seguimiento técnico, fortalecimiento
                              de capacidades y creación de incentivos. También se plantea institucionalizar los
                              aprendizajes.
                            </p>
                            <p className="text-xs text-blue-600 font-medium">📌 Referencia: pág. 28–30</p>
                          </div>
                        </div>
                      </div>

                      {/* Resultado General */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-blue-900 border-b border-blue-200 pb-1">
                          📊 Resultado General
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Salvaguarda</th>
                                <th className="border border-gray-300 px-3 py-2 text-center font-medium">
                                  Cumplimiento
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left font-medium">
                                  Observaciones
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">(a) Consistencia nacional</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">✅</td>
                                <td className="border border-gray-300 px-3 py-2">Alínea con ENREDD+ y el PANByCC</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-3 py-2">(b) Gobernanza</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">✅</td>
                                <td className="border border-gray-300 px-3 py-2">Marco institucional claro</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">(c) Derechos indígenas</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">⚠</td>
                                <td className="border border-gray-300 px-3 py-2">No hay CLPI explícita</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-3 py-2">(d) Participación</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">✅</td>
                                <td className="border border-gray-300 px-3 py-2">Talleres y consultas locales</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">(e) Conservación</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">✅</td>
                                <td className="border border-gray-300 px-3 py-2">Restauración y prevención activa</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-3 py-2">(f) Riesgos sociales/ambientales</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">⚠</td>
                                <td className="border border-gray-300 px-3 py-2">Sin PGAS explícito</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-3 py-2">(g) Reversión y desplazamiento</td>
                                <td className="border border-gray-300 px-3 py-2 text-center">✅</td>
                                <td className="border border-gray-300 px-3 py-2">Plan de sostenibilidad presente</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Recomendaciones */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-orange-900 border-b border-orange-200 pb-1">
                          ✍ Recomendaciones
                        </h3>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-orange-600 font-bold">•</span>
                              <span>
                                Incorporar un módulo específico sobre salvaguardas dentro del documento del proyecto.
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-600 font-bold">•</span>
                              <span>Documentar de manera explícita procesos de consulta a pueblos indígenas.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-600 font-bold">•</span>
                              <span>Elaborar un Plan de Gestión Ambiental y Social (PGAS).</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-600 font-bold">•</span>
                              <span>Usar indicadores para monitorear el cumplimiento de cada salvaguarda.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Project Overview content
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h1 className="text-2xl font-bold mb-2">Project Overview</h1>
                      <h2 className="text-xl font-semibold text-emerald-800 mb-4">
                        Amazon Forest Conservation and Sustainable Development Program
                      </h2>
                      <p className="text-muted-foreground mb-6">Fecha: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Project Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">Project Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          The Amazon Forest Conservation and Sustainable Development Program is a comprehensive REDD+
                          initiative designed to reduce emissions from deforestation and forest degradation while
                          promoting sustainable forest management and conservation. The project covers 2.5 million
                          hectares of Amazon rainforest and aims to reduce deforestation by 60% over a 10-year period,
                          resulting in significant carbon emission reductions and biodiversity conservation.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Objectives */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">REDD+ Objectives</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed">
                          The project aims to implement comprehensive forest conservation strategies that address the
                          main drivers of deforestation while providing sustainable livelihood alternatives for local
                          communities and indigenous peoples.
                        </p>

                        <div>
                          <h4 className="font-medium mb-2">Specific objectives:</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Reduce deforestation rates by 60% compared to historical baseline (2010-2020).
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Implement sustainable forest management practices across 500,000 hectares.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Strengthen indigenous territories and community forest management systems.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Establish comprehensive monitoring, reporting, and verification (MRV) systems.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* REDD+ Components */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">REDD+ Components and Activities</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-emerald-800">Forest Conservation:</h4>
                            <p className="text-sm">
                              Protection of <span className="font-semibold text-2xl text-emerald-900">1.8M</span>{" "}
                              hectares of primary forest through enhanced protection measures and community-based
                              conservation.
                            </p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-green-800">Forest Restoration:</h4>
                            <p className="text-sm">
                              Restoration of <span className="font-semibold text-2xl text-green-900">200K</span>{" "}
                              hectares of degraded forest lands through natural regeneration and assisted restoration
                              techniques.
                            </p>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-blue-800">Sustainable Management:</h4>
                            <p className="text-sm">
                              Implementation of sustainable forest management practices across{" "}
                              <span className="font-semibold text-2xl text-blue-900">500K</span> hectares with certified
                              logging and agroforestry systems.
                            </p>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-purple-800">Carbon Enhancement:</h4>
                            <p className="text-sm">
                              Enhancement of forest carbon stocks through improved forest management, resulting in{" "}
                              <span className="font-semibold text-2xl text-purple-900">15M</span> tCO2 additional
                              sequestration.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expected Impact */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">Expected Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                              <TreePine className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Carbon Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Reduction of 45 million tCO2 emissions over 10 years through avoided deforestation.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                              <Leaf className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Biodiversity Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Protection of critical habitats for over 3,000 species including endangered fauna.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Social Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Improved livelihoods for 25,000 people in 150 communities through sustainable
                                  alternatives.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                              <Building2 className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Economic Impact</p>
                                <p className="text-xs text-muted-foreground">
                                  Generation of $120M in sustainable forest-based income over the project period.
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
                    <TreePine className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
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
            <Button variant="outline" onClick={handlePrevStage}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Reporte
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
