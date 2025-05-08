import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Briefcase, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Document, Project } from "@/models"

interface DocumentListProps {
  documents: Document[]
  selectedDocuments: Document[]
  onToggle: (document: Document) => void
  emptyMessage?: string
  disabledDocumentIds?: Set<string>
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedDocuments,
  onToggle,
  emptyMessage = "No documents found",
  disabledDocumentIds = new Set(),
}) => {
  if (documents.length === 0) {
    return <EmptyState message={emptyMessage} icon={FileText} />
  }

  return (
    <div className="space-y-1.5">
      <AnimatePresence initial={false}>
        {documents.map((doc) => {
          const isSelected = selectedDocuments.some((d) => d.id === doc.id)
          const isDisabled = doc.id ? disabledDocumentIds.has(doc.id) : false

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`flex items-center space-x-3 p-2.5 rounded-md transition-colors border-l-2 ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed border-transparent"
                    : isSelected
                    ? "bg-primary/10 hover:bg-primary/15 border-primary cursor-pointer"
                    : "hover:bg-accent/50 border-transparent cursor-pointer"
                }`}
                onClick={() => !isDisabled && onToggle(doc)}
              >
                <Checkbox checked={isSelected} disabled={isDisabled} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  {doc.category && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{doc.category.toUpperCase()}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

interface ProjectListProps {
  projects: Project[]
  selectedDocuments: Document[]
  onToggleDocument: (document: Document) => void
  emptyMessage?: string
  disabledDocumentIds?: Set<string>
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedDocuments,
  onToggleDocument,
  emptyMessage = "No projects found",
  disabledDocumentIds = new Set(),
}) => {
  if (projects.length === 0) {
    return <EmptyState message={emptyMessage} icon={Briefcase} />
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border rounded-md overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 bg-secondary/20">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm truncate">{project.name}</span>
            </div>
            <div className="p-2 space-y-1 bg-background/50">
              {(project.documents ?? []).map((doc) => {
                const isSelected = selectedDocuments.some((d) => d.id === doc.id)
                const isDisabled = doc.id ? disabledDocumentIds.has(doc.id) : false

                return (
                  <div
                    key={doc.id}
                    className={`flex items-center space-x-3 p-2 rounded-md transition-colors border-l-2 ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed border-transparent"
                        : isSelected
                        ? "bg-primary/5 hover:bg-primary/10 border-primary cursor-pointer"
                        : "hover:bg-accent/30 border-transparent cursor-pointer"
                    }`}
                    onClick={() => !isDisabled && onToggleDocument(doc)}
                  >
                    <Checkbox checked={isSelected} disabled={isDisabled} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{doc.name}</p>
                      {doc.category && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{doc.category.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface EmptyStateProps {
  message: string
  icon: React.ElementType
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
    <Icon className="h-8 w-8 mb-3" />
    <p className="text-sm">{message}</p>
  </div>
)
