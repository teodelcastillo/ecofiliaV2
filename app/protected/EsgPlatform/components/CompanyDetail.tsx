"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Pencil, Leaf, Users, CheckCircle, Trash2 } from "lucide-react"

export default function CompanyDetail() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la empresa</CardTitle>
          <CardDescription>Información ESG de la empresa seleccionada</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Nombre:</strong> Agroverde S.A.</p>
            <p><strong>País:</strong> Colombia</p>
            <p><strong>Sector:</strong> Alimentos y bebidas</p>
            <p><strong>Año de incorporación:</strong> 2015</p>
          </div>
          <div className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit"><Leaf className="h-4 w-4 mr-1 text-green-600" /> Huella CO₂: 280 t</Badge>
            <Badge variant="outline" className="w-fit"><Users className="h-4 w-4 mr-1 text-green-600" /> Empleo formal: 85%</Badge>
            <Badge variant="outline" className="w-fit"><CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Energías limpias</Badge>
            <Badge variant="outline" className="w-fit"><Trash2 className="h-4 w-4 mr-1 text-green-600" /> Reducción de residuos</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Descargar reporte ESG</Button>
        <Button variant="secondary"><Pencil className="h-4 w-4 mr-2" /> Actualizar información</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones para este tipo de empresa</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700">
          ● Implementar medición continua de emisiones.<br />
          ● Buscar certificación ambiental sectorial.<br />
          ● Capacitar en sostenibilidad a proveedores clave.<br />
          ● Adoptar estrategia de economía circular.
        </CardContent>
      </Card>
    </div>
  )
}
