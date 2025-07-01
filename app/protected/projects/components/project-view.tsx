"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectOverview } from "./project-tabs/project-overview"
import { ProjectReports } from "./project-tabs/project-reports"
import { ProjectMonitoring } from "./project-tabs/project-monitoring"
import { ProjectWorkspace } from "./project-tabs/project-workspace"
import type { Project } from "@/models"
import { createClient } from "@/utils/supabase/client"
import { ChatInterface } from "../../ecofilia-expert/components/chat-interface"

interface ProjectViewProps {
  project: Project
  onBack?: () => void
  className?: string
}

export function ProjectView({ project, onBack, className = "" }: ProjectViewProps) {
  const router = useRouter()
  const supabase = createClient()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjectDocuments = useCallback(async () => {
    console.log("Fetching project documents for:", project.id)
    setLoading(true)

    const { data: projectLinks, error } = await supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", project.id || "")

    if (error) {
      console.error("Error fetching project documents:", error.message)
      setLoading(false)
      return
    }

    console.log("Project links found:", projectLinks)

    const userDocIds = projectLinks
      .filter((link) => link.document_id)
      .map((link) => link.document_id)
      .filter((id): id is string => id !== null)
    const publicDocIds = projectLinks
      .filter((link) => link.public_document_id)
      .map((link) => link.public_document_id)
      .filter((id): id is string => id !== null)

    const [userDocsResp, publicDocsResp] = await Promise.all([
      userDocIds.length > 0
        ? supabase.from("documents").select("*").in("id", userDocIds)
        : Promise.resolve({ data: [] }),
      publicDocIds.length > 0
        ? supabase.from("public_documents").select("*").in("id", publicDocIds)
        : Promise.resolve({ data: [] }),
    ])

    if (!userDocsResp || !publicDocsResp) {
      console.error("Failed to load documents properly")
      setLoading(false)
      return
    }

    const formatType = (path: string | null | undefined) => path?.split(".").pop()?.toLowerCase().trim() || "pdf"

    const formattedUserDocs = (userDocsResp.data ?? []).map((doc) => ({
      id: doc.id,
      name: doc.name || "Untitled Document",
      description: doc.description || "",
      category: doc.category || "",
      created_at: doc.created_at,
      file_path: doc.file_path,
      file_type: formatType(doc.file_path),
      user_id: doc.user_id,
    }))

    const formattedPublicDocs = (publicDocsResp.data ?? []).map((doc) => ({
      id: doc.id,
      name: doc.name || "Untitled Document",
      category: doc.category || "Public",
      created_at: doc.created_at,
      file_path: doc.file_url,
      file_type: formatType(doc.file_url),
      user_id: "public",
    }))

    setDocuments([...formattedUserDocs, ...formattedPublicDocs])
    setLoading(false)
  }, [project.id, supabase])

  useEffect(() => {
    fetchProjectDocuments()
  }, [fetchProjectDocuments])

  const handleBack = () => {
    onBack ? onBack() : router.back()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-sm text-muted-foreground">
            {project.category} {project.client && `• ${project.client}`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProjectOverview
            project={project}
            documents={documents}
            loading={loading}
            onDocumentsRefresh={fetchProjectDocuments}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ProjectReports project={project} />
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6">
          <ProjectMonitoring project={project} />
        </TabsContent>

        <TabsContent value="workspace" className="mt-6">
          <ProjectWorkspace project={project} />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ChatInterface
            key={1} // 👈 esto fuerza un remount al cambiar de sesión
            messages={[]}
            input={"Hola Ecofilia! Que recomendaciones podrías darme para acercarme a las metas de sostenibilidad de mi proyecto?"}
            handleInputChange={() => {}}
            handleSubmit={() => {}}
            isLoading={false}  
            selectedDocuments={[]}
            onOpenDocumentSelector={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
