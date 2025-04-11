"use client"

import { useEffect, useState } from "react"
import type { Project } from "@/models"
import { createClient } from "@/utils/supabase/client"
import { Eye, Download, FileText, Calendar, Clock, ChevronLeft, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSignedUrl } from "@/lib/getSignedUrl"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface Report {
  id: string
  type: string
  file_url: string
  created_at: string
  name?: string
  description?: string
}

interface ProjectReportsViewProps {
  project: Project
  onBack?: () => void
}

function extractPathFromUrl(url: string, bucket: string) {
  const match = url.match(new RegExp(`${bucket}/(.+)$`))
  const path = match?.[1] || ""
  return path
}

export function ProjectReportsView({ project, onBack }: ProjectReportsViewProps) {
  const supabase = createClient()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingReport, setProcessingReport] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("project_reports")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setReports(data || [])
      } catch (err) {
        console.error("❌ Error fetching reports:", err)
        setError("Failed to load reports. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [project.id, supabase])

  const handleOpen = async (report: Report) => {
    setProcessingReport(report.id)
    try {
      const filePath = extractPathFromUrl(report.file_url, "project-reports")
      const url = await getSignedUrl("project-reports", filePath)

      if (url) {
        window.open(url, "_blank")
      } else {
        throw new Error("Could not generate URL")
      }
    } catch (err) {
      console.error("Error opening report:", err)
      toast({
        title: "Error",
        description: "Failed to open the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingReport(null)
    }
  }

  const handleDownload = async (report: Report) => {
    setProcessingReport(report.id)
    try {
      const filePath = extractPathFromUrl(report.file_url, "project-reports")
      const url = await getSignedUrl("project-reports", filePath)

      if (url) {
        const link = document.createElement("a")
        link.href = url
        link.download = `${report.type}-report.docx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Download started",
          description: "Your report is being downloaded.",
        })
      } else {
        throw new Error("Could not generate URL")
      }
    } catch (err) {
      console.error("Error downloading report:", err)
      toast({
        title: "Download failed",
        description: "Failed to download the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingReport(null)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  // Group reports by type
  const groupedReports = reports.reduce<Record<string, Report[]>>((acc, report) => {
    if (!acc[report.type]) {
      acc[report.type] = []
    }
    acc[report.type].push(report)
    return acc
  }, {})

  // Get report type colors
  const getReportTypeColor = (type: string) => {
    const types: Record<string, string> = {
      summary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      detailed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      analysis: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      financial: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      sustainability: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    }
    return types[type.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{project.name} Reports</h2>
          <p className="text-sm text-muted-foreground">
            {project.category} {project.client && `• ${project.client}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg"
          >
            <div className="bg-destructive/10 p-3 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium mb-1">Error Loading Reports</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </motion.div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg"
          >
            <div className="bg-muted/50 p-3 rounded-full mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Reports Available</h3>
            <p className="text-muted-foreground mb-4">This project doesn't have any generated reports yet.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {Object.entries(groupedReports).map(([type, reportsOfType]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold capitalize">{type} Reports</h3>
                  <Badge variant="outline" className={getReportTypeColor(type)}>
                    {reportsOfType.length}
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {reportsOfType.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <ReportCard
                          report={report}
                          onOpen={() => handleOpen(report)}
                          onDownload={() => handleDownload(report)}
                          isProcessing={processingReport === report.id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ReportCardProps {
  report: Report
  onOpen: () => void
  onDownload: () => void
  isProcessing: boolean
}

function ReportCard({ report, onOpen, onDownload, isProcessing }: ReportCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const createdDate = new Date(report.created_at)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`h-full flex flex-col overflow-hidden transition-all duration-200 ${
          isHovered ? "shadow-md border-primary/30" : "border-border/60"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <Badge variant="outline" className="capitalize">
              {report.type}
            </Badge>
          </div>
          <CardTitle className="text-lg mt-2">
            {report.name || `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`}
          </CardTitle>
          {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
        </CardHeader>
        <CardContent className="pb-3 pt-0 flex-grow">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(createdDate, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-3 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onOpen} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            View
          </Button>
          <Button
            variant={isHovered ? "default" : "outline"}
            className="flex-1"
            onClick={onDownload}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
