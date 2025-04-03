"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProjectView } from "../components/project-view"
import { createClient } from "@/utils/supabase/client"
import { Project } from "@/models"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const supabase = createClient()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single()

      if (error) {
        console.error("Error fetching project:", error.message)
        setError("Project not found or access denied.")
      } else {
        setProject(data)
      }
      setLoading(false)
    }

    if (projectId) fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    )
  }

  if (!project || error) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <ProjectView project={project} />
    </div>
  )
}
