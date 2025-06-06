"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

type SuggestionType = "content" | "structure"

interface AISuggestionsProps {
  type: SuggestionType
  onSelect: (suggestion: string) => void
}

const contentSuggestions = [
  "Quiero un reporte detallado sobre el impacto ambiental del proyecto, incluyendo métricas de reducción de CO2, ahorro energético y comparativas con proyectos similares en el sector.",
  "Necesito un análisis de los resultados del proyecto en términos de sostenibilidad, destacando los logros principales, desafíos encontrados y oportunidades de mejora para futuras iniciativas.",
  "Genera un reporte que muestre el progreso del proyecto en los últimos 6 meses, con énfasis en los indicadores clave de rendimiento ambiental y su impacto en la comunidad local.",
]

const structureSuggestions = [
  "Quiero un reporte con la siguiente estructura: resumen ejecutivo, metodología, análisis de datos, hallazgos principales, conclusiones y recomendaciones.",
  "Necesito una estructura que incluya: introducción, contexto del proyecto, objetivos, métricas de sostenibilidad, análisis comparativo, impacto social, conclusiones y próximos pasos.",
  "Prefiero un formato con: resumen visual de una página, dashboard de métricas clave, análisis detallado por categoría, casos de éxito destacados y apéndice con datos completos.",
]

export function AISuggestions({ type, onSelect }: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>(
    type === "content" ? contentSuggestions : structureSuggestions,
  )

  const handleRefreshSuggestions = () => {
    setIsLoading(true)
    // Simulación de carga de nuevas sugerencias
    setTimeout(() => {
      // Rotamos las sugerencias para simular nuevas
      const rotatedSuggestions = [...suggestions]
      rotatedSuggestions.push(rotatedSuggestions.shift()!)
      setSuggestions(rotatedSuggestions)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onSelect(suggestion)}
        >
          <CardContent className="p-3 text-sm">{suggestion}</CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={handleRefreshSuggestions}
        disabled={isLoading}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isLoading ? "Generando nuevas sugerencias..." : "Generar más sugerencias"}
      </Button>
    </div>
  )
}
