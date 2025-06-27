// pages/plataforma/page.tsx

import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import DueDiligence from "./DueDiligence"
import PortfolioPanel from "./PortfolioPanel"
import CompanyDetail from "./CompanyDetail"

export const metadata: Metadata = {
  title: "Plataforma ESG - Fondos de Inversión",
  description: "Gestioná el desempeño ESG de tu portafolio de empresas",
}

export default function PlataformaESG() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Plataforma ESG para Fondos de Inversión</h1>
      <Tabs defaultValue="due" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="due">Due Diligence ESG</TabsTrigger>
          <TabsTrigger value="panel">Panel del Portafolio ESG</TabsTrigger>
          <TabsTrigger value="empresa">Detalle por Empresa</TabsTrigger>
        </TabsList>
        <TabsContent value="due">
          <DueDiligence />
        </TabsContent>
        <TabsContent value="panel">
          <PortfolioPanel />
        </TabsContent>
        <TabsContent value="empresa">
          <CompanyDetail />
        </TabsContent>
      </Tabs>
    </div>
  )
}
