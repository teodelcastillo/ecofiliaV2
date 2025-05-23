"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  FileText,
  Lightbulb,
  Leaf,
  BarChart,
  Clock,
  CheckCircle2,
} from "lucide-react"

export function AiReportGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState("overview")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("generate")

  const reportTemplates: Record<string, string> = {
    overview: "/templates/Brazil Urban Development Project - Project Overview.docx",
    sustainability: "/templates/Brazil Urban Development Project - Climate Change and Sustainability Filter.docx",
    inputs: "/templates/Brazil Urban Development Project - Inputs for Climate Change and Sustainability Annex.docx",
  }
  

  const handleGenerateAndDownload = () => {
    if (!prompt) return

    setIsGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          downloadTemplate()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const downloadTemplate = () => {
    const fileUrl = reportTemplates[reportType]
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileUrl.split("/").pop() || "report.docx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const reportTypes = [
    { value: "overview", label: "Project Overview", icon: <Leaf className="h-4 w-4" /> },
    { value: "sustainability", label: "Climate Change and Sustainability Filter", icon: <BarChart className="h-4 w-4" /> },
    { value: "inputs", label: "Inputs for Climate Change and Sustainability Annex", icon: <CheckCircle2 className="h-4 w-4" /> },
  ]

  return (
    <Card className="border-t-4 border-t-primary shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Report Generator
        </CardTitle>
        <CardDescription>Create professional environmental reports in seconds</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 px-6">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="report-type" className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" className="h-10">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        {type.icon}
                        <span className="ml-2">{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium flex justify-between">
                <span>Describe what you need</span>
                <span className="text-xs text-muted-foreground">{prompt.length}/500</span>
              </label>
              <Textarea
                id="prompt"
                placeholder="Describe the environmental report you need..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                maxLength={500}
              />
            </div>

            <div className="bg-muted/40 rounded-lg p-3 space-y-2">
              <div className="flex items-center text-sm font-medium">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                Suggestions
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <SuggestionPill
                  text="A concise summary of the project's objectives..."
                  onClick={() => setPrompt("A concise summary of the project's objectives, components, and expected development outcomes with relevance to climate and sustainability.")}
                />
                <SuggestionPill
                  text="Climate Change and Sustainability Filter..."
                  onClick={() => setPrompt("Climate Change and Sustainability Filter: An initial screening that identifies the project’s potential climate risks, impacts, and opportunities for climate action or environmental sustainability.")}
                />
                <SuggestionPill
                  text="Detailed technical inputs for sustainability annex..."
                  onClick={() => setPrompt("Detailed technical inputs supporting the project’s alignment with climate and sustainability goals, including mitigation, adaptation, resilience, and co-benefits.")}
                />
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating report...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full h-10 rounded-lg"
              onClick={handleGenerateAndDownload}
              disabled={!prompt || isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate & Download"}
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="history">
          <CardContent className="text-muted-foreground text-sm">Coming soon...</CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function SuggestionPill({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      className="bg-background rounded-full px-3 py-1 border hover:bg-muted transition-colors"
      onClick={onClick}
    >
      {text}
    </button>
  )
}