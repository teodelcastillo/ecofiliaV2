"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  ExternalLink,
  TreePine,
  Factory,
  Home,
  Shield,
} from "lucide-react"
import { motion } from "framer-motion"
import type { Project } from "@/models"

interface ProjectMonitoringProps {
  project: Project
}

// Datos reales del proyecto REDD+ Cuenca Caimancito
const projectSummary = `Desde su inclusión en el Proyecto REDD+ Pagos por Resultados, la Cuenca Caimancito ha avanzado en su fase de planificación técnica y territorial. Se constituyó el Comité de Cuenca Forestal, se realizó un diagnóstico integral participativo, y se entregó equipamiento a actores locales. Se cuenta ya con un plan de trabajo consensuado, se inició el relevamiento ambiental y se están integrando los saberes locales en el diseño del plan de manejo. Se desarrolló un proceso de sociabilización comunitaria e institucional, con fuerte participación de pueblos originarios y sectores productivos.`

const timeline = [
  {
    date: "Ene 2023",
    milestone: "Inclusión de Caimancito en el Proyecto REDD+ Argentina (FAO-FVC)",
    status: "completed",
  },
  {
    date: "Mayo 2024",
    milestone: "Inicio de sociabilización con actores territoriales",
    status: "completed",
  },
  {
    date: "Julio 2024",
    milestone: "Creación del Comité de Cuenca Forestal",
    status: "completed",
  },
  {
    date: "Ago 2024",
    milestone: "Lanzamiento del proceso de planificación participativa",
    status: "completed",
  },
  {
    date: "Dic 2024",
    milestone: "Entrega de equipamiento institucional",
    status: "completed",
  },
  {
    date: "Mayo 2025",
    milestone: "Firma del convenio FAO–INTA-Yuto para acompañamiento técnico",
    status: "in_progress",
  },
  {
    date: "2025-2026",
    milestone: "Formulación, validación e implementación del plan de manejo forestal",
    status: "pending",
  },
]

const keyIndicators = [
  {
    indicator: "Superficie bajo manejo forestal sustentable",
    target: "+150.000 ha",
    current: "Diagnóstico en proceso",
    status: "warning",
    icon: <TreePine className="h-4 w-4" />,
  },
  {
    indicator: "Producción maderera sostenible (estimada)",
    target: "36.000 m³/año",
    current: "Modelado técnico definido",
    status: "success",
    icon: <Factory className="h-4 w-4" />,
  },
  {
    indicator: "Unidades productivas fortalecidas (aserraderos)",
    target: "17 activos",
    current: "Identificados y mapeados",
    status: "success",
    icon: <Factory className="h-4 w-4" />,
  },
  {
    indicator: "Carpinterías rurales vinculadas",
    target: "+130",
    current: "Relevadas en el diagnóstico",
    status: "success",
    icon: <Home className="h-4 w-4" />,
  },
  {
    indicator: "Población beneficiaria directa",
    target: "+100.000 personas",
    current: "Cobertura territorial definida",
    status: "success",
    icon: <Users className="h-4 w-4" />,
  },
  {
    indicator: "Comunidades indígenas involucradas",
    target: "32",
    current: "Participación activa",
    status: "success",
    icon: <Users className="h-4 w-4" />,
  },
]

const safeguards = [
  {
    code: "(a)",
    name: "Consistencia con estrategias nacionales",
    status: "success",
    progress: "Cumplida",
    description: "El plan se alinea con la ENREDD+, PANByCC y prioridades de restauración forestal.",
  },
  {
    code: "(b)",
    name: "Transparencia y gobernanza forestal",
    status: "success",
    progress: "En progreso alto",
    description: "Se conformó oficialmente el Comité de Cuenca en julio 2024.",
  },
  {
    code: "(c)",
    name: "Derechos de pueblos indígenas y comunidades",
    status: "warning",
    progress: "Progreso inicial",
    description: "Se identificaron 32 comunidades indígenas con participación en diagnóstico.",
  },
  {
    code: "(d)",
    name: "Participación plena y efectiva",
    status: "success",
    progress: "En progreso alto",
    description: "Se realizaron talleres participativos y reuniones multisectoriales.",
  },
  {
    code: "(e)",
    name: "Conservación de bosques y biodiversidad",
    status: "success",
    progress: "En progreso alto",
    description: "Se avanza en el Plan de Gestión con foco en áreas críticas de Yungas y Chaco.",
  },
  {
    code: "(f)",
    name: "Gestión de riesgos sociales y ambientales",
    status: "warning",
    progress: "Progreso limitado",
    description: "Se identificaron amenazas pero aún no hay un PGAS detallado.",
  },
  {
    code: "(g)",
    name: "Prevención de reversión y desplazamiento",
    status: "success",
    progress: "En progreso",
    description: "Se diseñan estrategias de sostenibilidad mediante fortalecimiento técnico.",
  },
]

export function ProjectMonitoring({ project }: ProjectMonitoringProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const handleDownloadStatus = () => {
    // Simular descarga del estatus del proyecto
    const blob = new Blob(
      [
        `Monitoreo de Salvaguardas REDD+ – Proyecto Cuenca Caimancito
Última actualización: Julio 2025

${safeguards.map((s) => `${s.code} ${s.name}: ${s.progress}\n${s.description}`).join("\n\n")}`,
      ],
      { type: "text/plain" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "estatus-proyecto-caimancito.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resumen General del Avance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{projectSummary}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://drive.google.com/drive/folders/1zjAKq5XS8PvlpakGMbXnuLmlRI064nUH"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Documentos de Implementación
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadStatus}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Estatus de Proyecto
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline del Proyecto */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg border"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getStatusIcon(item.status)}
                  <Badge variant="outline" className="text-xs">
                    📅 {item.date}
                  </Badge>
                </div>
                <p className="text-sm flex-1">{item.milestone}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Indicadores Clave */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />📊 Indicadores Clave del Proyecto
            </CardTitle>
            <p className="text-sm text-muted-foreground">Última actualización: Julio 2025</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {keyIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {indicator.icon}
                      <h4 className="font-medium text-sm">{indicator.indicator}</h4>
                    </div>
                    <Badge className={getStatusColor(indicator.status)}>
                      {indicator.status === "success" ? "🟢" : "🟡"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <strong>Meta:</strong> {indicator.target}
                    </p>
                    <p className="text-xs">
                      <strong>Estado actual:</strong> {indicator.current}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seguimiento de Salvaguardas REDD+ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguimiento de Salvaguardas REDD+
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monitoreo de cumplimiento - Última actualización: Julio 2025
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeguards.map((safeguard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {safeguard.code}
                      </Badge>
                      <h4 className="font-medium text-sm">{safeguard.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{safeguard.description}</p>
                  </div>
                  <Badge className={getStatusColor(safeguard.status)}>
                    {safeguard.status === "success" ? "🟢" : "🟡"} {safeguard.progress}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
