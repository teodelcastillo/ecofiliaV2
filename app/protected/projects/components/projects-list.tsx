import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Document, Project } from "@/models"

interface ProjectListProps {
  projects: Project[]
  selectedDocumentIds: string[]
  onToggleProject: (project: Project) => void
  emptyMessage?: string
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


export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedDocumentIds,
  onToggleProject,
  emptyMessage = "No projects found",
}) => {
  if (projects.length === 0) {
    return <EmptyState message={emptyMessage} description={""} />
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {projects.map((project) => {
          const projectDocs = project.documents ?? []
          const projectDocIds = projectDocs.map((d) => d.id).filter((id): id is string => id !== null)
          const allSelected = projectDocIds.every((id) => selectedDocumentIds.includes(id))

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border rounded-md overflow-hidden"
            >
              {/* Header del proyecto: selecciona todos los documentos del proyecto */}
              <div
                className={`flex items-center gap-2 p-3 bg-secondary/20 cursor-pointer ${
                  allSelected ? "bg-primary/10" : ""
                }`}
                onClick={() => onToggleProject(project)}
              >
                <Checkbox checked={allSelected} />
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm truncate">{project.name}</span>
              </div>

              {/* Documentos vinculados (solo visual, no clickeables) */}
              {projectDocs.length > 0 && (
                <div className="bg-background/50 px-4 pb-2 pt-1 text-sm text-muted-foreground">
                  {projectDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 py-0.5 pl-1">
                      <span className="text-xs truncate">{doc.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
