"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PortfolioPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Panel estratégico del portafolio</h2>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Empresas ESG activas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Emisiones CO₂e</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.520 t</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sectores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Progreso en sostenibilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">65%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Distribución de sectores</CardTitle>
            <PieChart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="text-sm text-slate-500">[gráfico circular aquí]</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Emisiones por sector</CardTitle>
            <BarChart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="text-sm text-slate-500">[gráfico de barras aquí]</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones estratégicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <ul className="list-disc list-inside">
            <li>Priorizar energías limpias en sectores intensivos.</li>
            <li>Impulsar transparencia en indicadores sociales.</li>
            <li>Promover certificaciones ambientales sectoriales.</li>
          </ul>
          <Button className="mt-4">Descargar reporte del portafolio</Button>
        </CardContent>
      </Card>
    </div>
  )
}