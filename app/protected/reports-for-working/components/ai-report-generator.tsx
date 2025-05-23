"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Leaf, BarChart, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ReportType {
  value: string
  label: string
  icon: React.ReactNode
  description: string
}

interface AiReportGeneratorProps {
  selectedProjectId?: string
  onReportGenerated?: () => void
}

export function AiReportGenerator({ selectedProjectId, onReportGenerated }: AiReportGeneratorProps) {
  const [reportType, setReportType] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const reportTypes: ReportType[] = [
    {
      value: "overview",
      label: "Project Overview",
      icon: <Leaf className="h-4 w-4" />,
      description: "A comprehensive summary of the project's environmental impact and sustainability measures.",
    },
    {
      value: "sustainability",
      label: "Climate Change and Sustainability Filter",
      icon: <BarChart className="h-4 w-4" />,
      description: "Analysis of the project's impact on climate change and sustainability factors.",
    },
    {
      value: "inputs",
      label: "Inputs for Climate Change and Sustainability Annex",
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: "Detailed inputs required for the climate change and sustainability annex of the project.",
    },
  ]

  const selectedReportType = reportTypes.find((type) => type.value === reportType)

  const handleGenerate = async () => {
    if (!selectedProjectId || !reportType) {
      toast({
        title: "Missing selection",
        description: "Please select a project and report type.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 5))
    }, 300)

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId, reportType }),
      })

      const data = await res.json()
      clearInterval(interval)

      if (res.ok && data?.file_url) {
        setProgress(100)

        toast({
          title: "Report generated successfully",
          description: (
            <span>
              <a href={data.file_url} target="_blank" rel="noopener noreferrer" className="underline text-primary">
                Click here to view the document
              </a>{" "}
              or wait to be redirected.
            </span>
          ),
        })

        // Call the callback if provided
        if (onReportGenerated) {
          onReportGenerated()
        }

        setTimeout(() => {
          router.push(`/protected/reports/${selectedProjectId}`)
        }, 3000)
      } else {
        toast({
          title: "Generation failed",
          description: data?.error || "The report could not be generated.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error generating report:", err)
      toast({
        title: "Unexpected error",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      clearInterval(interval)
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-t-4 border-t-primary shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Report Generator
        </CardTitle>
        <CardDescription>Create professional environmental reports quickly</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedProjectId ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No project selected</AlertTitle>
            <AlertDescription>Please select a project from the list to generate a report.</AlertDescription>
          </Alert>
        ) : (
          <>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedReportType && <p className="text-sm text-muted-foreground">{selectedReportType.description}</p>}

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {progress < 100 ? `Generating report... ${progress}%` : "Report generated! Redirecting..."}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating || !selectedProjectId || !reportType}
        >
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  )
}
