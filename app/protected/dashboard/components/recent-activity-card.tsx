"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { FileText, FolderKanban, BarChart, Clock, ArrowRight, FileUp, FolderPlus } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Project, Document, Report } from "@/models"

interface RecentActivityCardProps {
  documents: Document[]
  projects: Project[]
  reports: Report[]
  onOpenUploadModal: () => void
  onOpenProjectModal: () => void
}

export function RecentActivityCard({
  documents,
  projects,
  reports,
  onOpenUploadModal,
  onOpenProjectModal,
}: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs defaultValue="documents">
          <TabsList className="mb-4 w-full flex justify-spacebetween overflow-x-auto">
            <TabsTrigger value="documents" className="text-xs flex-1 max-w-[120px]">
              <FileText className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs flex-1 max-w-[120px]">
              <FolderKanban className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Projects</span>
              <span className="sm:hidden">Proj</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs flex-1 max-w-[120px]">
              <BarChart className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reports</span>
              <span className="sm:hidden">Rep</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-0 space-y-4">
            {documents.length === 0 ? (
              <EmptyState
                message="No documents yet"
                description="Upload your first document to get started"
                action={
                  <Button size="sm" onClick={onOpenUploadModal}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                }
              />
            ) : (
              <div className="space-y-1">
                {documents.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/protected/my-library?document=${doc.id}`}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.created_at ? formatDistanceToNow(new Date(doc.created_at)) : "Unknown date"}
                          </p>

                        </div>
                      </div>
                      {doc.category && (
                        <Badge variant="outline" className="hidden sm:inline-flex">
                          {doc.category}
                        </Badge>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="mt-0 space-y-4">
            {projects.length === 0 ? (
              <EmptyState
                message="No projects yet"
                description="Create your first project to get started"
                action={
                  <Button size="sm" onClick={onOpenProjectModal}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                }
              />
            ) : (
              <div className="space-y-1">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/protected/projects/${project.id}`}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <FolderKanban className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.created_at ? formatDistanceToNow(new Date(project.created_at)) : "Unknown date"}
                          </p>
                        </div>
                      </div>
                      {project.category && (
                        <Badge variant="outline" className="hidden sm:inline-flex">
                          {project.category}
                        </Badge>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-0 space-y-4">
            {reports.length === 0 ? (
              <EmptyState
                message="No reports yet"
                description="Generate your first report from the Reports page"
                action={
                  <Button size="sm" asChild>
                    <Link href="/protected/reports">
                      <BarChart className="mr-2 h-4 w-4" />
                      Go to Reports
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-1">
                {reports.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/protected/reports/${report.project_id}`}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <BarChart className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {report.name || `${(report.type || "unknown").charAt(0).toUpperCase() + (report.type || "unknown").slice(1)} Report`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.projectName} • {" "}
                            {report.created_at ? formatDistanceToNow(new Date(report.created_at)) : "Unknown date"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="hidden sm:inline-flex capitalize">
                        {report.type}
                      </Badge>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link href="/protected/my-library">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({
  message,
  description,
  action,
}: { message: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {action}
    </div>
  )
}
