"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, ChevronLeft, TreePine, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Project } from "@/models"

interface ProjectReportsProps {
  project: Project
}

// Mock report data - incluye el reporte REDD+
const availableReports = [
  {
    id: "ficha-de-proyecto",
    name: "Ficha de Proyecto - Cuenca Caimancito",
    type: "Ficha de Proyecto",
    description: "Ficha general del proyecto Cuenca Caimancito",
    size: "2.4 MB",
    status: "completed",
    hasPreview: true,
  },
  {
    id: "redd-safeguards-2025",
    name: "Salvaguardas REDD+ - Cuenca Caimancito",
    type: "REDD+ Safeguards",
    description: "Evaluación completa de las 7 salvaguardas REDD+ para el proyecto Cuenca Caimancito",
    size: "2.4 MB",
    status: "completed",
    hasPreview: true,
  },
  {
    id: "monthly-progress-dec",
    name: "Reporte de Progreso",
    type: "Progress Report",
    description: "Resumen de actividades y avances",
    size: "1.8 MB",
    status: "completed",
    hasPreview: true,
  },

]

export function ProjectReports({ project }: ProjectReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

const handleReportClick = (reportId: string) => {
  setSelectedReport(reportId)
}


  const handleBackToList = () => {
    setSelectedReport(null)
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

// Main render logic moved inside return
let reportContent: React.ReactNode = null;
if (selectedReport === "redd-safeguards-2025") {
  reportContent =     (
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
} else if (selectedReport === "monthly-progress-dec") {
  reportContent = (<div className="space-y-6">
    {/* Resumen general del avance */}
    <Card>
      <CardHeader>
                            {/* Título y encabezado */}
                    <div className="prose max-w-none">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBackToList} className="h-9 w-9">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                      <CardTitle className="text-2xl font-bold mb-2">📋 Resumen del Progreso del Proyecto </CardTitle>

                        </div>
                      </div>
                    </div>
      </CardHeader>
      <CardContent className="text-sm leading-r)elaxed space-y-4">
        <p>
          Desde su inclusión en el Proyecto REDD+ Pagos por Resultados, la Cuenca Caimancito ha avanzado en su fase de planificación técnica y territorial. Se constituyó el Comité de Cuenca Forestal, se realizó un diagnóstico integral participativo, y se entregó equipamiento a actores locales.
        </p>
        <p>
          Se cuenta ya con un plan de trabajo consensuado, se inició el relevamiento ambiental y se están integrando los saberes locales en el diseño del plan de manejo. Se desarrolló un proceso de sociabilización comunitaria e institucional, con fuerte participación de pueblos originarios y sectores productivos.
        </p>
      </CardContent>
    </Card>

    {/* Timeline del proyecto */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-emerald-900">📆 Timeline del Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-emerald-50">
            <tr>
              <th className="border px-4 py-2 text-left">Fecha</th>
              <th className="border px-4 py-2 text-left">Hito</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Ene 2023", "Inclusión de Caimancito en el Proyecto REDD+ Argentina (FAO-FVC)"],
              ["Mayo 2024", "Inicio de sociabilización con actores territoriales"],
              ["Julio 2024", "Creación del Comité de Cuenca Forestal"],
              ["Ago 2024", "Lanzamiento del proceso de planificación participativa"],
              ["Dic 2024", "Entrega de equipamiento institucional"],
              ["Mayo 2025", "Firma del convenio FAO–INTA-Yuto para acompañamiento técnico"],
              ["2025–2026", "Formulación, validación e implementación del plan de manejo forestal"],
            ].map(([date, event], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">📅 {date}</td>
                <td className="border px-4 py-2">{event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>

    {/* Indicadores clave */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-emerald-900">📊 Indicadores Clave del Proyecto</CardTitle>
        <CardDescription>Última actualización: Julio 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-emerald-50">
            <tr>
              <th className="border px-4 py-2 text-left">Indicador</th>
              <th className="border px-4 py-2 text-left">Meta esperada</th>
              <th className="border px-4 py-2 text-left">Estado actual (2025)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Superficie bajo manejo forestal sustentable", "+150.000 ha", "🟡 Diagnóstico en proceso"],
              ["Producción maderera sostenible (estimada)", "36.000 m³/año", "🟢 Modelado técnico definido"],
              ["Unidades productivas fortalecidas (aserraderos)", "17 activos", "🟢 Identificados y mapeados"],
              ["Carpinterías rurales vinculadas", "+130", "🟢 Relevadas en el diagnóstico"],
              ["Población beneficiaria directa", "+100.000 personas", "🟢 Cobertura territorial definida"],
              ["Comunidades indígenas involucradas", "32", "🟢 Participación activa"],
              ["Grupos socio-productivos clave", "Carpinteros, viveristas, agricultores", "🟡 Participación en expansión"],
            ].map(([indicator, goal, status], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">{indicator}</td>
                <td className="border px-4 py-2">{goal}</td>
                <td className="border px-4 py-2">{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>

    {/* Seguimiento de Salvaguardas */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-emerald-900">📋 Monitoreo de Salvaguardas REDD+</CardTitle>
        <CardDescription>Última actualización: Julio 2025</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          El siguiente resumen presenta el estado de avance por salvaguarda, junto con próximos pasos recomendados:
        </div>
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-emerald-50">
            <tr>
              <th className="border px-3 py-2 text-left">Salvaguarda REDD+</th>
              <th className="border px-3 py-2 text-center">Estado actual</th>
              <th className="border px-3 py-2 text-left">Progreso alcanzado</th>
              <th className="border px-3 py-2 text-left">Próximos pasos</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "(a) Consistencia con estrategias nacionales",
                "🟢 Cumplida",
                "Alineado con ENREDD+, PANByCC y prioridades nacionales",
                "Sistematizar aportes y articular con nivel nacional",
              ],
              [
                "(b) Transparencia y gobernanza forestal",
                "🟢 En progreso alto",
                "Comité conformado con INTA como formulador",
                "Formalizar protocolos de operación e información",
              ],
              [
                "(c) Derechos de pueblos indígenas",
                "🟡 Progreso inicial",
                "Participación sin marco CLPI formal",
                "Desarrollar protocolo de consulta previa",
              ],
              [
                "(d) Participación plena y efectiva",
                "🟢 En progreso alto",
                "Talleres, encuestas y consultas realizadas",
                "Mantener participación activa y retroalimentación",
              ],
              [
                "(e) Conservación de bosques y biodiversidad",
                "🟢 En progreso alto",
                "Plan de gestión en marcha en zonas críticas",
                "Implementar monitoreo y restauración activa",
              ],
              [
                "(f) Gestión de riesgos sociales y ambientales",
                "🟡 Progreso limitado",
                "Identificación de amenazas sin PGAS formal",
                "Elaborar PGAS con enfoque diferenciado",
              ],
              [
                "(g) Prevención de reversión y desplazamiento",
                "🟢 En progreso",
                "Estrategias de sostenibilidad en diseño",
                "Establecer financiamiento y seguimiento",
              ],
            ].map(([safeguard, status, progress, next], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-3 py-2">{safeguard}</td>
                <td className="border px-3 py-2 text-center">{status}</td>
                <td className="border px-3 py-2">{progress}</td>
                <td className="border px-3 py-2">{next}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón de descarga (simulado) */}
        <div className="pt-4">
          <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700">
            ⬇ Descargar Estatus de Proyecto
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);
} else if (selectedReport === "ficha-de-proyecto") {
  reportContent = (                  
                  <div className="space-y-6">
                    {/* Título y encabezado */}
                    <div className="prose max-w-none">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBackToList} className="h-9 w-9">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                      <h1 className="text-2xl font-bold mb-2">Overview del Proyecto</h1>
                      <h2 className="text-xl font-semibold text-emerald-800 mb-4">
                        Plan Estratégico de Gestión Forestal – Cuenca Caimancito (Jujuy, Argentina)
                      </h2>
                        </div>
                      </div>
                    </div>

                    {/* Descripción del proyecto */}
                    <Card>
                      <CardContent className="p-6 text-sm leading-relaxed space-y-4">
                        <p>
                          En el corazón de las Yungas y el Chaco jujeño, el proyecto tiene como objetivo implementar una estrategia integral de gestión forestal sostenible en la Cuenca Caimancito, en el este de la provincia de Jujuy. Abarcando más de 740.000 ha, el plan articula esfuerzos entre organismos públicos, comunidades locales, el sector privado y organizaciones técnicas para fortalecer el manejo forestal, conservar la biodiversidad y promover el desarrollo local con enfoque territorial.
                        </p>
                        <p>
                          El proyecto representa una experiencia concreta de planificación territorial forestal alineada con la Estrategia Nacional de REDD+ (ENREDD+) y el Plan de Acción Nacional de Bosques y Cambio Climático (PANByCC). A través de un enfoque inclusivo y basado en el paisaje, promueve la sostenibilidad ambiental, el desarrollo económico local y el cumplimiento progresivo de las salvaguardas REDD+ acordadas por Argentina en el marco de la CMNUCC.
                        </p>
                        <p>
                          <strong>📍 Localización geográfica</strong><br />
                          Provincia: Jujuy, Argentina<br />
                          Departamentos: Ledesma, Santa Bárbara y Valle Grande<br />
                          Ecorregiones: Selva de Yungas y Chaco Serrano<br />
                          Superficie total: +740.000 ha (~14,5% de la provincia)
                        </p>
                        <p>
                          <strong>💰 Financiamiento:</strong> no especificado<br />
                          <strong>📆 Periodo de ejecución:</strong> desde 2018
                        </p>
                        <p>
                          <strong>🏛️ Ejecutores y entidades responsables:</strong><br />
                          Ministerio de Ambiente de Jujuy, Secretaría de Ambiente y Desarrollo Sustentable de la Nación, INTA Yuto, Municipalidad de Caimancito, Fundación ProYungas, empresas como Ledesma S.A., El Mistol, Agropecuaria Jujuy y AFIJUY.
                        </p>
                        <p>
                          <strong>🎯 Objetivo general:</strong><br />
                          Consolidar una gestión forestal sustentable y territorialmente coordinada que fortalezca la gobernanza ambiental, el desarrollo económico y la inclusión social en la Cuenca Caimancito.
                        </p>
                        <p>
                          <strong>Objetivos específicos:</strong>
                          <ul className="list-disc list-inside">
                            <li>Mejorar capacidades institucionales y de planificación.</li>
                            <li>Fortalecer la cadena de valor forestal formal y sostenible.</li>
                            <li>Promover el manejo responsable de bosques nativos y plantaciones.</li>
                            <li>Aumentar la restauración, conservación y uso eficiente del bosque.</li>
                            <li>Generar empleo y oportunidades locales con equidad social.</li>
                          </ul>
                        </p>
                        <p>
                          <strong>🧩 Componentes y actividades clave:</strong>
                        </p>
                        <ul className="list-disc list-inside">
                          <li><strong>1. Fortalecimiento institucional:</strong> Mesa forestal, inventario forestal, OTBN, capacitación.</li>
                          <li><strong>2. Industrias forestales:</strong> Aserraderos, formalización, parque industrial forestal.</li>
                          <li><strong>3. Bosques nativos:</strong> Manejo sostenible, control de incendios, planes PM/POP.</li>
                          <li><strong>4. Bosques cultivados:</strong> Nuevas forestaciones, fomento a productores, trazabilidad.</li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Evaluación de Salvaguardas */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">Evaluación de Salvaguardas REDD+</CardTitle>
                        <CardDescription>
                          Resumen de cumplimiento para las 7 salvaguardas establecidas en el Acuerdo de Cancún, adaptadas al marco nacional argentino
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-emerald-50">
                                <th className="border border-gray-300 px-4 py-3 text-left font-medium">Salvaguarda</th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-medium">Evaluación</th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-medium">Observaciones clave</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border px-4 py-3">(a) Consistencia nacional</td>
                                <td className="border px-4 py-3 text-center">✅</td>
                                <td className="border px-4 py-3">Alineado con políticas REDD+</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border px-4 py-3">(b) Gobernanza</td>
                                <td className="border px-4 py-3 text-center">✅</td>
                                <td className="border px-4 py-3">Institucionalidad activa</td>
                              </tr>
                              <tr>
                                <td className="border px-4 py-3">(c) Derechos indígenas</td>
                                <td className="border px-4 py-3 text-center">⚠</td>
                                <td className="border px-4 py-3">Falta CLPI estructurado</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border px-4 py-3">(d) Participación</td>
                                <td className="border px-4 py-3 text-center">✅</td>
                                <td className="border px-4 py-3">Talleres locales efectivos</td>
                              </tr>
                              <tr>
                                <td className="border px-4 py-3">(e) Conservación</td>
                                <td className="border px-4 py-3 text-center">✅</td>
                                <td className="border px-4 py-3">Enfoque ecosistémico sólido</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="border px-4 py-3">(f) Riesgos socioambientales</td>
                                <td className="border px-4 py-3 text-center">⚠</td>
                                <td className="border px-4 py-3">Ausencia de PGAS</td>
                              </tr>
                              <tr>
                                <td className="border px-4 py-3">(g) Reversión y desplazamiento</td>
                                <td className="border px-4 py-3 text-center">✅</td>
                                <td className="border px-4 py-3">Estrategias de sostenibilidad</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recomendaciones de Mejora */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-emerald-900">Recomendaciones de Mejora</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            {
                              color: "blue",
                              text: "Incluir un módulo específico de salvaguardas dentro del documento del proyecto para facilitar el monitoreo y la rendición de cuentas.",
                            },
                            {
                              color: "green",
                              text: "Formalizar procesos de CLPI con pueblos indígenas, en línea con el Marco de Participación Indígena REDD+ Argentina.",
                            },
                            {
                              color: "yellow",
                              text: "Elaborar un PGAS (Plan de Gestión Ambiental y Social) que identifique riesgos diferenciados (por género, pueblos indígenas, biodiversidad).",
                            },
                            {
                              color: "purple",
                              text: "Incorporar indicadores específicos por salvaguarda, alineados con el Sistema de Información de Salvaguardas (SIS) nacional.",
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-3 p-3 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full bg-${item.color}-500 text-white flex items-center justify-center text-xs font-bold mt-0.5`}
                              >
                                {i + 1}
                              </div>
                              <p className="text-sm leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bosques involucrados */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-emerald-900">🌳 Bosques involucrados</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm leading-relaxed space-y-2">
                        <p>
                          El proyecto abarca una amplia porción de las ecorregiones de Yungas y Chaco Serrano, caracterizadas por su alta biodiversidad y relevancia ambiental. Los bosques nativos presentes en la Cuenca Caimancito se encuentran en diversos estados de conservación, con zonas bien conservadas pero también áreas degradadas por presión agrícola, ganadera e informalidad productiva.
                        </p>
                        <p>
                          Se estima que aproximadamente <strong>250.000 hectáreas</strong> son aptas para manejo forestal sustentable, representando un importante potencial de producción maderera, calculado en torno a los <strong>36.000 m³ anuales</strong>.
                        </p>
                        <p>
                          A su vez, se promueve el desarrollo de <strong>plantaciones forestales</strong> como estrategia complementaria para abastecimiento industrial y restauración de áreas intervenidas. Esta combinación de bosques nativos y cultivados requiere una planificación técnica robusta, criterios de sostenibilidad y mecanismos efectivos de monitoreo.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Involucramiento de actores */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-emerald-900">🤝 Involucramiento de actores</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm leading-relaxed space-y-2">
                        <p>
                          El plan establece una <strong>Mesa Forestal Interinstitucional</strong> como espacio central de gobernanza, articulando a organismos públicos, empresas, universidades, comunidades locales y organizaciones sociales.
                        </p>
                        <p>
                          En su formulación participaron activamente más de <strong>30 comunidades indígenas</strong> —entre ellas Guaraní, Kolla y Ocloya— mediante talleres y procesos de consulta previa, libre e informada, garantizando una planificación inclusiva y contextualizada.
                        </p>
                        <p>
                          Además, se promueve un <strong>enfoque de género</strong> que busca fortalecer la participación de mujeres en actividades productivas, de gestión y toma de decisiones, aunque aún con desafíos para su plena implementación.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Impacto del proyecto */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-emerald-900">📊 Impacto del proyecto (indicadores clave)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p><strong>🌲 Superficie bajo manejo forestal:</strong><br />+150.000 ha en zonas de Yungas y Chaco jujeño</p>
                          </div>
                          <div>
                            <p><strong>🪵 Producción maderera:</strong><br />36.000 m³/año de madera aprovechable de forma sostenible</p>
                          </div>
                          <div>
                            <p><strong>🧰 Unidades productivas fortalecidas:</strong><br />17 aserraderos activos<br />+130 carpinterías rurales identificadas</p>
                          </div>
                          <div>
                            <p><strong>👥 Población beneficiaria:</strong><br />+100.000 habitantes en la cuenca<br />32 comunidades indígenas<br />Microempresarios, aserraderos, carpinteros, agricultores, viveristas</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>);
}

  return (
    <>
      {reportContent ? (
        <div>{reportContent}</div>
      ) : (
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
      )}
    </>
  )
}