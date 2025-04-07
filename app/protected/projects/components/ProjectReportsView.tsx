"use client"

import { useEffect, useState } from "react"
import { Project } from "@/models"
import { createClient } from "@/utils/supabase/client"
import { Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSignedUrl } from "@/lib/getSignedUrl"

interface Report {
  id: string
  type: string
  file_url: string
  created_at: string
}

interface ProjectReportsViewProps {
  project: Project
}

function extractPathFromUrl(url: string, bucket: string) {
  const match = url.match(new RegExp(`${bucket}/(.+)$`))
  const path = match?.[1] || ""
  return path
}

export function ProjectReportsView({ project }: ProjectReportsViewProps) {
  const supabase = createClient()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("project_reports")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching reports:", error.message)
      } else {
        setReports(data)
      }

      setLoading(false)
    }

    fetchReports()
  }, [project.id])

  if (loading) {
    return <p className="text-muted-foreground">Cargando reportes...</p>
  }

  if (reports.length === 0) {
    return <p className="text-muted-foreground">Este proyecto aún no tiene reportes generados.</p>
  }

  const groupedReports = reports.reduce<Record<string, Report[]>>((acc, report) => {
    if (!acc[report.type]) {
      acc[report.type] = []
    }
    acc[report.type].push(report)
    return acc
  }, {})

  const handleOpen = async (report: Report) => {
    const filePath = extractPathFromUrl(report.file_url, "project-reports")
    const url = await getSignedUrl("project-reports", filePath)
    console.log(`[handleOpen] Signed URL:`, url)
    if (url) window.open(url, "_blank")
    else console.error(`[handleOpen] ❌ Signed URL could not be created for path: ${filePath}`)
  }

  const handleDownload = async (report: Report) => {
    const filePath = extractPathFromUrl(report.file_url, "project-reports")
    const url = await getSignedUrl("project-reports", filePath)
    console.log(`[handleDownload] Signed URL:`, url)
    if (url) {
      const link = document.createElement("a")
      link.href = url
      link.download = `${report.type}-report.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      console.error(`[handleDownload] ❌ Signed URL could not be created for path: ${filePath}`)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{project.name}</h2>
        <p className="text-sm text-muted-foreground">
          {project.category} • {project.client}
        </p>
      </div>

      {Object.entries(groupedReports).map(([type, reportsOfType]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-xl font-semibold capitalize">{type} Reports</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportsOfType.map((report) => (
              <div key={report.id} className="rounded-lg border p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Generado el {new Date(report.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleOpen(report)}
                  >
                    <Eye className="h-4 w-4" /> Ver
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleDownload(report)}
                  >
                    <Download className="h-4 w-4" /> Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
