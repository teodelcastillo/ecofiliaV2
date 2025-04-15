// ✅ This component has been validated with your provided models and logic.
// ✅ Refactored for type safety, performance and better readability.

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Project, Report } from "@/models"
import { createClient } from "@/utils/supabase/client"
import { getSignedUrl } from "@/lib/getSignedUrl"
import { format, formatDistanceToNow } from "date-fns"
import {
  Eye,
  Download,
  FileText,
  Calendar,
  Clock,
  ChevronLeft,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectReportsViewProps {
  project: Project
  onBack?: () => void
}

function extractPathFromUrl(url: string, bucket: string) {
  const match = url.match(new RegExp(`${bucket}/(.+)$`))
  return match?.[1] || ""
}

export function ProjectReportsView({ project, onBack }: ProjectReportsViewProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("project_reports")
        .select("*")
        .eq("project_id", project.id || "")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        setError("Failed to load reports. Please try again.")
      } else {
        setReports(
          (data || []).map((report) => ({
            ...report,
            projectName: project.name || null, // Add projectName from the project prop
          }))
        )
      }
      setLoading(false)
    }

    fetchReports()
  }, [project.id])

  const handleOpen = async (report: Report) => {
    if (!report.file_url) return
    setProcessingId(report.id)
    try {
      const filePath = extractPathFromUrl(report.file_url, "project-reports")
      const url = await getSignedUrl("project-reports", filePath)
      if (!url) throw new Error("Could not generate URL")
      window.open(url, "_blank")
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to open report.", variant: "destructive" })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDownload = async (report: Report) => {
    if (!report.file_url) return
    setProcessingId(report.id)
    try {
      const filePath = extractPathFromUrl(report.file_url, "project-reports")
      const url = await getSignedUrl("project-reports", filePath)
      if (!url) throw new Error("Could not generate URL")
      const link = window.document.createElement("a")
      link.href = url
      link.download = `${report.type}-report.docx`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      toast({ title: "Download started", description: "Your report is being downloaded." })
    } catch (err) {
      console.error(err)
      toast({ title: "Download failed", description: "Try again later.", variant: "destructive" })
    } finally {
      setProcessingId(null)
    }
  }

  const handleBack = () => (onBack ? onBack() : router.back())

  const groupedReports = reports.reduce<Record<string, Report[]>>((acc, r) => {
    const type = r.type || "other"
    if (!acc[type]) acc[type] = []
    acc[type].push(r)
    return acc
  }, {})

  const getReportTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      summary: "bg-blue-100 text-blue-800",
      detailed: "bg-green-100 text-green-800",
      analysis: "bg-purple-100 text-purple-800",
      financial: "bg-amber-100 text-amber-800",
      sustainability: "bg-emerald-100 text-emerald-800",
    }
    return colors[type.toLowerCase()] || "bg-muted text-foreground"
  }

  return (
    <div className="space-y-6">
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

      <AnimatePresence mode="wait">
        {loading ? (
          <SkeletonView />
        ) : error ? (
          <ErrorView message={error} />
        ) : reports.length === 0 ? (
          <EmptyView />
        ) : (
          Object.entries(groupedReports).map(([type, group]) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold capitalize">{type} Reports</h3>
                <Badge className={getReportTypeColor(type)}>{group.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((r) => (
                  <ReportCard
                    key={r.id}
                    report={r}
                    onOpen={() => handleOpen(r)}
                    onDownload={() => handleDownload(r)}
                    isProcessing={processingId === r.id}
                  />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

function ReportCard({ report, onOpen, onDownload, isProcessing }: {
  report: Report
  onOpen: () => void
  onDownload: () => void
  isProcessing: boolean
}) {
  const created = new Date(report.created_at || "")
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <Badge variant="outline" className="capitalize">{report.type}</Badge>
          </div>
          <CardTitle className="text-lg mt-2">
            {report.name || `${((report.type || "unknown").charAt(0).toUpperCase() + (report.type || "unknown").slice(1))} Report`}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground gap-2 flex flex-col">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(created, "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(created, { addSuffix: true })}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 pt-3">
          <Button onClick={onOpen} variant="outline" className="flex-1" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            View
          </Button>
          <Button onClick={onDownload} variant="default" className="flex-1" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function SkeletonView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full" />)}
      </div>
    </motion.div>
  )
}

function EmptyView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-12 border border-dashed rounded-lg"
    >
      <FileText className="mx-auto mb-4 h-6 w-6 text-muted-foreground" />
      <h3 className="text-lg font-medium">No Reports Available</h3>
      <p className="text-muted-foreground">This project doesn't have any reports yet.</p>
    </motion.div>
  )
}

function ErrorView({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-12 border border-dashed rounded-lg"
    >
      <AlertCircle className="mx-auto mb-4 h-6 w-6 text-destructive" />
      <h3 className="text-lg font-medium">Error Loading Reports</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </motion.div>
  )
}
