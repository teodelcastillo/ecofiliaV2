"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AiReportGenerator } from "./ai-report-generator"
import { CreateProjectModal } from "../../projects/components/create-project"
import { KpiDashboard } from "./kpi-dashboard"

interface Project {
  id: string
  name: string
  description?: string
  category?: string
  client?: string
  created_at: string
  documentCount: number
}

export function ReportsOverview() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: projectsData, error } = await supabase
        .from("projects")
        .select("id, name, description, category, client, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error

      const { data: links, error: linkErr } = await supabase.from("project_documents").select("project_id")

      if (linkErr) throw linkErr

      const docCounts =
        links?.reduce((acc: Record<string, number>, link) => {
          acc[link.project_id] = (acc[link.project_id] || 0) + 1
          return acc
        }, {}) || {}

        const enriched: Project[] = projectsData.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? undefined,
          category: p.category ?? undefined,
          client: p.client ?? undefined,
          created_at: p.created_at ?? "", // Fallback to an empty string if null
          documentCount: docCounts[p.id] || 0,
        }))
        

      setProjects(enriched)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.client || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Environmental Reports
        </h1>
        <p className="text-muted-foreground text-lg">
          Each project listed below contains associated documentation. Use this view to explore your consultancy work.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <CreateProjectModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false)
                fetchProjects()
              }}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-16 w-16 text-muted-foreground/50" />}
              title="No projects found"
              description={search ? "No projects match your search criteria." : "You haven't created any projects yet."}
              action={<Button onClick={() => setModalOpen(true)}>Create Project</Button>}
            />
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className={`border-l-4 transition cursor-pointer hover:shadow-md ${
                        selectedProjectId === project.id
                          ? "border-primary shadow-lg bg-primary/5"
                          : "border-transparent hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{project.name}</CardTitle>
                          {project.category && <Badge variant="outline">{project.category}</Badge>}
                        </div>
                        <CardDescription>{project.description || "No description available"}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {project.documentCount} document{project.documentCount !== 1 ? "s" : ""}
                          </Badge>
                          {project.client && (
                            <Badge variant="outline" className="bg-primary/5">
                              Client: {project.client}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground pt-2">
                        Created on {new Date(project.created_at).toLocaleDateString()}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}

          {selectedProjectId && (
            <div className="mt-8">
              <KpiDashboard />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <AiReportGenerator
            selectedProjectId={selectedProjectId || undefined}
            onReportGenerated={() => {
              // Refresh projects to update document counts
              fetchProjects()
            }}
          />
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-xl border border-dashed">
      <div className="rounded-full bg-background p-4 border mb-4">{icon}</div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
