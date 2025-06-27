"use client"

import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  BarChart3,
  Leaf,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Download,
  Calendar,
  Bot,
} from "lucide-react"
import type { FormData } from "./types"

interface ResultsDisplayProps {
  data: FormData
  onRestart: () => void
}

const prioritiesList = [
  { id: "emissions", label: "Reducir emisiones" },
  { id: "circularity", label: "Circularidad y residuos" },
  { id: "adaptation", label: "Adaptación al cambio" },
  { id: "compliance", label: "Cumplimiento normativo" },
  { id: "esg", label: "Estrategia ESG" },
]

const ResultsDisplay: FC<ResultsDisplayProps> = ({ data, onRestart }) => {
  const selectedPriorities = Object.entries(data.priorities)
    .filter(([, value]) => value)
    .map(([key]) => prioritiesList.find((p) => p.id === key)?.label)

  const footprint = (
    Number(data.footprint.electricity) * 0.0005 +
    Number(data.footprint.fuel) * 0.0023 +
    Number(data.footprint.employees) * 1.5 +
    Number(data.footprint.travel) * 0.00015
  ).toFixed(2)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Tu Estrategia de Sostenibilidad Personalizada</h2>
        <p className="text-slate-500 mt-2">
          Basado en la información proporcionada, aquí tienes un resumen y recomendaciones iniciales.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-green-600" />
              Perfil de la Organización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p><strong>Nombre:</strong> {data.general.name}</p>
            <p><strong>País:</strong> {data.general.country}</p>
            <p><strong>Sector:</strong> {data.general.sector}</p>
            <p><strong>Tamaño:</strong> {data.general.size}</p>
            <p><strong>Prioridades:</strong> {selectedPriorities.join(", ") || "No definidas"}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
              Estimación Preliminar de Huella
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-green-600">{footprint}</p>
            <p className="text-slate-500">toneladas de CO₂e / año</p>
            <p className="text-xs text-slate-400 mt-4">
              Esta es una estimación basada en promedios. Un análisis detallado puede refinar este valor.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPriorities.includes("Reducir emisiones") && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <h4 className="font-semibold flex items-center">
                <Leaf className="mr-2 h-4 w-4" />
                Reducción de Emisiones
              </h4>
              <p className="text-sm text-slate-600">
                Iniciá un plan de eficiencia energética y considerá cambiar a proveedores de energía renovable. Promové
                el teletrabajo para reducir emisiones por desplazamiento.
              </p>
            </div>
          )}

          {selectedPriorities.includes("Circularidad y residuos") && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <h4 className="font-semibold flex items-center">
                <Recycle className="mr-2 h-4 w-4" />
                Circularidad
              </h4>
              <p className="text-sm text-slate-600">
                Realizá una auditoría de residuos para identificar oportunidades de reducción y reciclaje. Explorá
                modelos de negocio circulares para tus productos o servicios.
              </p>
            </div>
          )}

          {!selectedPriorities.length && (
            <p className="text-sm text-slate-500">
              Seleccioná prioridades en el paso 3 para ver recomendaciones personalizadas.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Descargar Informe
        </Button>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Reunión
        </Button>
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          Explorar Soluciones IA
        </Button>
      </div>

      <div className="text-center">
        <Button variant="link" onClick={onRestart}>
          Comenzar de nuevo
        </Button>
      </div>
    </div>
  )
}

export default ResultsDisplay
