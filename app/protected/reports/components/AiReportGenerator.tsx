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
  FileQuestion,
  Clock,
  CheckCircle2,
  Download,
} from "lucide-react"

export function AiReportGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState("impact")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("generate")

  const handleGenerate = () => {
    if (!prompt) return

    setIsGenerating(true)
    setProgress(0)

    // Simulate generation process with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const reportTypes = [
    { value: "Overview", label: "Project Overview", icon: <Leaf className="h-4 w-4" /> },
    { value: "sustainability", label: "Climate Change and Sustainability Filter", icon: <BarChart className="h-4 w-4" /> },
    { value: "Inputs", label: "Inputs for Climate Change and Sustainability Annex", icon: <CheckCircle2 className="h-4 w-4" /> },
  ]

  const recentReports = [
    { title: "Water Conservation Analysis", date: "2 days ago", type: "impact" },
    { title: "Carbon Emissions Report", date: "1 week ago", type: "carbon" },
    { title: "Biodiversity Assessment", date: "2 weeks ago", type: "sustainability" },
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
          <TabsTrigger value="generate" className="text-sm">
            Generate
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-0">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="report-type" className="text-sm font-medium">
                Report Type
              </label>
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
              <label htmlFor="prompt" className="text-sm font-medium flex items-center justify-between">
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
                className="resize-none"
              />
            </div>

            <div className="bg-muted/40 rounded-lg p-3 space-y-2">
              <div className="flex items-center text-sm font-medium">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                Suggestions
              </div>
              <div className="flex flex-wrap gap-2">
                <SuggestionPill
                  text="A concise summary of the project's objectives, components, and expected development outcomes with relevance to climate and sustainability."
                  onClick={() =>
                    setPrompt("A concise summary of the project's objectives, components, and expected development outcomes with relevance to climate and sustainability.")
                  }
                />
                <SuggestionPill
                  text="Climate Change and Sustainability Filter: An initial screening that identifies the project’s potential climate risks, impacts, and opportunities for climate action or environmental sustainability."
                  onClick={() =>
                    setPrompt("Climate Change and Sustainability Filter: An initial screening that identifies the project’s potential climate risks, impacts, and opportunities for climate action or environmental sustainability.")
                  }
                />
                <SuggestionPill
                  text="Inputs for Climate Change and Sustainability Annex:"
                  onClick={() =>
                    setPrompt("Detailed technical inputs supporting the project’s alignment with climate and sustainability goals, including mitigation, adaptation, resilience, and co-benefits.")
                  }
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
            <Button className="w-full h-10 rounded-lg" onClick={handleGenerate} disabled={!prompt || isGenerating}>
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary/70" />
                    <div>
                      <div className="font-medium text-sm">{report.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {report.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" className="text-xs">
                View all reports
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function SuggestionPill({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      className="text-xs bg-background rounded-full px-3 py-1 border hover:bg-muted transition-colors"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

