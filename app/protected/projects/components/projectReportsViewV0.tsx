"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, Calendar, Clock, ChevronLeft, TreePine, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format, formatDistanceToNow } from "date-fns"
import type { Project } from "@/models"

interface ProjectReportsProps {
  project: Project
}

// Mock report data - incluye el reporte REDD+
const availableReports = [
  {
    id: "redd-safeguards-2025",
    name: "Evaluación de Salvaguardas REDD+ - Cuenca Caimancito",
    type: "REDD+ Safeguards",
    description: "Evaluación completa de las 7 salvaguardas REDD+ para el proyecto Cuenca Caimancito",
    createdAt: "2025-01-15",
    size: "2.4 MB",
    pages: 45,
    status: "completed",
    hasPreview: true,
  },
  {
    id: "monthly-progress-dec",
    name: "Reporte de Progreso Mensual - Diciembre 2024",
    type: "Progress Report",
    description: "Resumen de actividades y avances durante el mes de diciembre",
    createdAt: "2024-12-31",
    size: "1.8 MB",
    pages: 28,
    status: "completed",
    hasPreview: false,
  },
  {
    id: "stakeholder-engagement",
    name: "Informe de Participación Comunitaria",
    type: "Stakeholder Engagement",
    description: "Documentación de talleres y consultas con comunidades locales",
    createdAt: "2024-11-20",
    size: "3.1 MB",
    pages: 62,
    status: "completed",
    hasPreview: false,
  },
]

export function ProjectReports({ project }: ProjectReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleReportClick = (reportId: string) => {
    setSelectedReport(reportId)
    if (reportId === "redd-safeguards-2025") {
      setShowPreview(true)
    }
  }

  const handleBackToList = () => {
    setSelectedReport(null)
    setShowPreview(false)
  }

  const handleDownload = () => {
    // Simular descarga del reporte
    const blob = new Blob(
      [
        `Evaluación de Salvaguardas REDD+ – Proyecto Cuenca Caimancito (Jujuy, Argentina)
Fecha: ${new Date().toLocaleDateString()}

Este documento contiene la evaluación completa de las 7 salvaguardas REDD+ establecidas en el Acuerdo de Cancún...`,
      ],
      { type: "text/plain" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "evaluacion-salvaguardas-redd-caimancito.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getReportTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "REDD+ Safeguards": "bg-emerald-100 text-emerald-800",
      "Progress Report": "bg-blue-100 text-blue-800",
      "Stakeholder Engagement": "bg-purple-100 text-purple-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  if (showPreview && selectedReport === "redd-safeguards-2025") {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBackToList} className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Evaluación de Salvaguardas REDD+</h3>
            <p className="text-sm text-muted-foreground">Proyecto Cuenca Caimancito (Jujuy, Argentina)</p>
          </div>
        </div>

        {/* Report Content */}
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
                            El proyecto demuestra una clara alineación con la Ley Nacional de Presupuestos Mínimos de
                            Protección Ambiental de los Bosques Nativos (Ley 26.331), con el Ordenamiento Territorial de
                            Bosques Nativos de la provincia de Jujuy, y con el Plan de Acción Nacional de Bosques y
                            Cambio Climático (PANByCC). La formulación del plan contó con participación institucional de
                            organismos provinciales, nacionales y actores del sector forestal, en un marco de gobernanza
                            articulada. Propone actividades como:
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
                            legales. Se destaca la conformación de la "Mesa Forestal de Caimancito", un espacio
                            multi-actoral donde se llevaron adelante procesos participativos para la elaboración del
                            plan, incluyendo talleres, entrevistas y revisión de propuestas.
                          </p>
                          <p className="text-xs text-blue-600 font-medium">📌 Referencias: pág. 10–11, 17–18, 27–30</p>
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
                            El documento reconoce la presencia de 32 comunidades indígenas (Guaraníes, Kollas y Ocloyas)
                            dentro del área de influencia. Si bien se valoran los esfuerzos de inclusión y
                            reconocimiento cultural, no se evidencian mecanismos formales de consulta previa, libre e
                            informada (CPLI) que aseguren el consentimiento frente a actividades que puedan afectar sus
                            territorios o medios de vida.
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
                            El documento detalla talleres participativos, encuestas y reuniones con actores locales para
                            definir acciones estratégicas. Se promueve la corresponsabilidad en la implementación.
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
                            El 26% del territorio de la cuenca se encuentra en categoría I de conservación, incluyendo
                            áreas protegidas como el Parque Nacional Calilegua. El plan propone corredores biológicos,
                            restauración ecológica y uso sostenible del bosque nativo, priorizando su integridad
                            ecológica. El plan promueve la protección de bosques nativos de yungas, la restauración de
                            cuencas, el control de incendios y la conservación de corredores biológicos. Identifica
                            amenazas y propone acciones concretas de mitigación ambiental.
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
                            El proyecto incluye acciones orientadas al desarrollo local, generación de empleo,
                            fortalecimiento de capacidades productivas y reducción de la pobreza rural. También plantea
                            beneficios ambientales como la restauración de ecosistemas degradados y el uso eficiente de
                            los recursos forestales. Aunque se identifican amenazas y se proponen medidas de mitigación,
                            no se incluye un Plan de Gestión Ambiental y Social (PGAS) detallado que evalúe impactos y
                            riesgos en profundidad.
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
                            Se prevén acciones de sostenibilidad a largo plazo: seguimiento técnico, fortalecimiento de
                            capacidades y creación de incentivos. También se plantea institucionalizar los aprendizajes.
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
                              <th className="border border-gray-300 px-3 py-2 text-center font-medium">Cumplimiento</th>
                              <th className="border border-gray-300 px-3 py-2 text-left font-medium">Observaciones</th>
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
            <Button variant="outline" onClick={handleBackToList}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver a Reportes
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Reporte
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Project Reports</h3>
        <p className="text-sm text-muted-foreground">Access and manage all reports generated for {project.name}</p>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <AnimatePresence>
          {availableReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleReportClick(report.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        {report.type === "REDD+ Safeguards" ? (
                          <Shield className="h-5 w-5 text-primary" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{report.name}</h4>
                          <Badge className={getReportTypeColor(report.type)}>{report.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(report.createdAt), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                          </div>
                          <span>{report.size}</span>
                          <span>{report.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.hasPreview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReportClick(report.id)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload()
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {availableReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border border-dashed rounded-lg"
        >
          <FileText className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Reports Available</h3>
          <p className="text-muted-foreground">This project doesn't have any reports yet.</p>
        </motion.div>
      )}
    </div>
  )
}
