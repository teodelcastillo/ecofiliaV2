"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Download, Calendar, Bot } from "lucide-react"

import { StepIndicator } from "./StepIndicator"
import StepGeneral from "./StepGeneral"
import StepFootprint from "./StepFootprint"
import StepPriorities from "./StepPriorities"
import ResultsDisplay from "./ResultsDisplay"
import ChatAssistant from "./ChatAssistant"

const initialFormData = {
  general: {
    name: "",
    country: "",
    sector: "",
    size: "",
    hasPlan: "no" as "no" | "yes",
  },
  footprint: {
    electricity: "",
    fuel: "",
    employees: "",
    travel: "",
  },
  priorities: {
    emissions: false,
    circularity: false,
    adaptation: false,
    compliance: false,
    esg: false,
  },
}

export default function SustainabilityAssistantPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const demoData = {
      general: {
        name: "Hotel Costa Verde",
        country: "Costa Rica",
        sector: "Turismo / Servicios",
        size: "PYME (10-249 empleados)",
        hasPlan: "yes" as "no" | "yes",
      },
      footprint: {
        electricity: (8000 * 12).toString(),
        fuel: (5000 * 1.96).toString(),
        employees: "45",
        travel: (10 * 300).toString(),
      },
      priorities: {
        emissions: true,
        circularity: true,
        adaptation: false,
        compliance: true,
        esg: true,
      },
    }
    setFormData(demoData)
  }, [])

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))
  const generateStrategy = () => setShowResults(true)
  const restart = () => {
    setShowResults(false)
    setStep(1)
    setFormData(initialFormData)
  }

  return (
    <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-8 text-slate-800">
      <div className="flex justify-center">
        <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {!showResults ? (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl md:text-3xl font-bold">
                    Asistente de Estrategia de Sostenibilidad
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Completá estos 3 pasos para generar tu plan inicial.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StepIndicator currentStep={step} />
                  {step === 1 && <StepGeneral formData={formData} setFormData={setFormData} />}
                  {step === 2 && <StepFootprint formData={formData} setFormData={setFormData} />}
                  {step === 3 && <StepPriorities formData={formData} setFormData={setFormData} />}
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    {step < 3 ? (
                      <Button onClick={nextStep}>
                        Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={generateStrategy}>Generar Estrategia</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ResultsDisplay data={formData} onRestart={restart} />
            )}
          </div>
          <div className="hidden lg:block w-[360px] shrink-0">
            <ChatAssistant />
          </div>
        </main>
      </div>
    </div>
  )
} 
