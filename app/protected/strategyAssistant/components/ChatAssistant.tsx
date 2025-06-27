"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquareIcon, Download, Calendar, Bot } from "lucide-react"

export default function ChatAssistant() {
  return (
    <Card className="bg-white border-green-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <MessageSquareIcon className="h-5 w-5 mr-2 text-green-600" />
          Asistente Climático
        </CardTitle>
        <CardDescription className="text-xs">
          ¿Tenés dudas? Consultá aquí.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[500px]">
        <div className="flex-1 bg-slate-50 rounded-md p-2 text-sm text-slate-500 flex items-center justify-center">
          Área de chat...
        </div>
        <Button className="w-full mt-3">Enviar</Button>
      </CardContent>
    </Card>
  )
}
