"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function DueDiligence() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análisis ESG preliminar de nueva empresa</CardTitle>
        <CardDescription>Completá la información básica y documentos para comenzar el análisis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la empresa</Label>
            <Input id="nombre" placeholder="Ej: Agroverde S.A." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pais">País</Label>
            <Input id="pais" placeholder="Ej: Colombia" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Input id="sector" placeholder="Ej: Alimentos y bebidas" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="anio">Año de incorporación</Label>
            <Input id="anio" type="number" placeholder="Ej: 2015" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="docs">Documentación ESG disponible (opcional)</Label>
          <Textarea id="docs" placeholder="Listá o describí los documentos disponibles: reportes ESG, políticas, certificaciones..." />
        </div>

        <Button className="mt-4">Analizar información</Button>
      </CardContent>
    </Card>
  )
}
