"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"

// 1️⃣ Type Definitions
type ReportType =
  | "carbon-footprint"
  | "water-usage"
  | "renewable-energy"
  | "biodiversity"
  | "sustainability"

type IncludeOptions = {
  charts: boolean
  recommendations: boolean
  executiveSummary: boolean
  references: boolean
}

export function AiReportGenerator() {
  // 2️⃣ State
  const [prompt, setPrompt] = useState<string>("")
  const [reportType, setReportType] = useState<ReportType | "">("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [includeOptions, setIncludeOptions] = useState<IncludeOptions>({
    charts: true,
    recommendations: true,
    executiveSummary: true,
    references: false,
  })

  // 3️⃣ Handlers
  const handleGenerate = () => {
    if (!prompt || !reportType) return

    setIsGenerating(true)

    // Simulate AI generation process
    setTimeout(() => {
      setIsGenerating(false)
      // Normally handle result here
      alert("Report generated successfully! Check your reports tab.")
    }, 3000)
  }

  const toggleOption = (option: keyof IncludeOptions) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Report Generator
        </CardTitle>
        <CardDescription>Generate environmental reports using AI based on BID standards</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Report Type */}
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={(val) => setReportType(val as ReportType)}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carbon-footprint">Carbon Footprint Analysis</SelectItem>
              <SelectItem value="water-usage">Water Usage Assessment</SelectItem>
              <SelectItem value="renewable-energy">Renewable Energy Transition</SelectItem>
              <SelectItem value="biodiversity">Biodiversity Impact</SelectItem>
              <SelectItem value="sustainability">Sustainability Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe what you need</Label>
          <Textarea
            id="prompt"
            placeholder="E.g., Generate a report on carbon emissions for a manufacturing facility in Brazil for Q2 2023..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        {/* Include Options */}
        <div className="space-y-3">
          <Label>Include in report</Label>
          <div className="space-y-2">
            {(
              Object.keys(includeOptions) as Array<keyof IncludeOptions>
            ).map((optionKey) => (
              <div key={optionKey} className="flex items-center space-x-2">
                <Checkbox
                  id={optionKey}
                  checked={includeOptions[optionKey]}
                  onCheckedChange={() => toggleOption(optionKey)}
                />
                <Label htmlFor={optionKey} className="text-sm font-normal capitalize">
                  {optionKey === "executiveSummary"
                    ? "Executive summary"
                    : optionKey === "charts"
                    ? "Data visualizations & charts"
                    : optionKey === "recommendations"
                    ? "Actionable recommendations"
                    : "Scientific references"}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleGenerate} disabled={isGenerating || !prompt || !reportType}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
