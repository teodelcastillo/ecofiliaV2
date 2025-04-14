"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  FileText,
  FolderKanban,
  BarChart,
  FileUp,
  FolderPlus,
  Clock,
  ArrowRight,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: string
  name: string
  created_at: string
  category?: string
}

interface Project {
  id: string
  name: string
  created_at: string
  category?: string
}

interface Report {
  id: string
  project_id: string
  projectName: string
  type: string
  name?: string
  created_at: string
}

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
    <Tabs defaultValue="documents" className="w-full">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </div>
            <TabsList>
              <TabsTrigger value="documents" className="text-xs">
                <FileText className="mr-1 h-3.5 w-3.5" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">
                <FolderKanban className="mr-1 h-3.5 w-3.5" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs">
                <BarChart className="mr-1 h-3.5 w-3.5" />
                Reports
              </TabsTrigger>
            </TabsList>
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-1">
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
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      {doc.category && <Badge variant="outline">{doc.category}</Badge>}
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
                            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      {project.category && <Badge variant="outline">{project.category}</Badge>}
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
                            {report.name || `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.projectName} •{" "}
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {report.type}
                      </Badge>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
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
    </Tabs>
  )
}

function EmptyState({
  message,
  description,
  action,
}: {
  message: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {action}
    </div>
  )
}
