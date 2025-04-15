"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  FileText,
  FolderOpen,
  X,
  BookOpen,
  Tag,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Layers,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { motion, AnimatePresence } from "framer-motion"
import type { Document, Project } from "@/models"

interface DocumentSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  personalDocuments: Document[]
  publicDocuments: Document[]
  projects?: Project[]
  onDocumentsSelected: (documents: Document[]) => void
  selectedDocuments: Document[]
}

export function DocumentSelectorModal({
  isOpen,
  onClose,
  personalDocuments,
  publicDocuments,
  projects = [],
  onDocumentsSelected,
  selectedDocuments,
}: DocumentSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])
  const [localSelectedDocs, setLocalSelectedDocs] = useState<Document[]>([])

  // Initialize local selection with current selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedDocs(selectedDocuments)
    }
  }, [isOpen, selectedDocuments])

  // Reset search when changing tabs
  useEffect(() => {
    setSearchQuery("")
  }, [activeTab])

  const toggleDocumentSelection = (document: Document, type: "user" | "public" | "project") => {
    const isSelected = localSelectedDocs.some((doc) => doc.id === document.id)

    const docWithType = { ...document, type }

    if (isSelected) {
      setLocalSelectedDocs(localSelectedDocs.filter((doc) => doc.id !== document.id))
    } else {
      setLocalSelectedDocs([...localSelectedDocs, docWithType])
    }
  }

  const toggleProjectSelection = (project: Project) => {
    const projectDocIds = new Set(project.documents?.map((doc) => doc.id))
    const currentlySelectedFromProject = localSelectedDocs.filter((doc) => projectDocIds.has(doc.id))

    // If all project documents are selected, deselect them all
    if (currentlySelectedFromProject.length === project.documents?.length) {
      setLocalSelectedDocs(localSelectedDocs.filter((doc) => !projectDocIds.has(doc.id)))
    }
    // Otherwise, select all project documents
    else {
      // Remove any already selected docs from this project
      const docsWithoutProject = localSelectedDocs.filter((doc) => !projectDocIds.has(doc.id))
      // Add all project docs with the project type
      const projectDocs = project.documents?.map((doc) => ({ ...doc, type: "project" as const }))
      setLocalSelectedDocs([...docsWithoutProject, ...(projectDocs || [])])
    }
  }

  const isProjectFullySelected = (project: Project) => {
    return project.documents ? project.documents.every((doc) => localSelectedDocs.some((selectedDoc) => selectedDoc.id === doc.id)) : false
  }

  const isProjectPartiallySelected = (project: Project): boolean => {
    const hasSelected = project.documents?.some((doc) =>
      localSelectedDocs.some((selectedDoc) => selectedDoc.id === doc.id),
    ) || false
    return hasSelected && !isProjectFullySelected(project)
  }

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const filterDocuments = (documents: Document[]) => {
    if (!searchQuery) return documents
    return documents.filter((doc) => doc.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const filterProjects = (projects: Project[]) => {
    if (!searchQuery) return projects

    return projects.filter(
      (project) =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.documents?.some((doc) => doc.name?.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const filteredPersonalDocs = filterDocuments(personalDocuments)
  const filteredPublicDocs = filterDocuments(publicDocuments)
  const filteredProjects = filterProjects(projects)

  const clearSelection = () => {
    setLocalSelectedDocs([])
  }

  const handleApply = () => {
    onDocumentsSelected(localSelectedDocs)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Select Documents
          </DialogTitle>
          <DialogDescription>Choose documents or projects to chat with</DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents or projects..."
            className="pl-9 pr-9 bg-background/50 border-muted focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {localSelectedDocs.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 overflow-hidden"
          >
            <div className="flex justify-between items-center py-1.5 px-2 bg-secondary/50 rounded-md">
              <span className="text-xs text-muted-foreground">
                {localSelectedDocs.length} document{localSelectedDocs.length !== 1 ? "s" : ""} selected
              </span>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex-1 overflow-hidden mt-4">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="personal" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>My Library</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>Public</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-0 h-[40vh]">
              <ScrollArea className="h-full pr-4">
                <DocumentList
                  documents={filteredPersonalDocs}
                  selectedDocuments={localSelectedDocs}
                  onToggle={(doc) => toggleDocumentSelection(doc, "user")}
                  emptyMessage="No personal documents found"
                  searchQuery={searchQuery}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="projects" className="mt-0 h-[40vh]">
              <ScrollArea className="h-full pr-4">
                <ProjectList
                  projects={filteredProjects}
                  selectedDocuments={localSelectedDocs}
                  onToggleDocument={(doc) => toggleDocumentSelection(doc, "project")}
                  onToggleProject={toggleProjectSelection}
                  isProjectFullySelected={isProjectFullySelected}
                  isProjectPartiallySelected={isProjectPartiallySelected}
                  expandedProjects={expandedProjects}
                  toggleProjectExpand={toggleProjectExpand}
                  emptyMessage="No projects found"
                  searchQuery={searchQuery}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="public" className="mt-0 h-[40vh]">
              <ScrollArea className="h-full pr-4">
                <DocumentList
                  documents={filteredPublicDocs}
                  selectedDocuments={localSelectedDocs}
                  onToggle={(doc) => toggleDocumentSelection(doc, "public")}
                  emptyMessage="No public documents found"
                  searchQuery={searchQuery}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between items-center mt-4 gap-2">
          <div className="text-sm text-muted-foreground">
            {localSelectedDocs.length} document{localSelectedDocs.length !== 1 ? "s" : ""} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={localSelectedDocs.length === 0}>
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DocumentListProps {
  documents: Document[]
  selectedDocuments: Document[]
  onToggle: (document: Document) => void
  emptyMessage: string
  searchQuery: string
}

function DocumentList({ documents, selectedDocuments, onToggle, emptyMessage, searchQuery }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="bg-muted/50 rounded-full p-3 mb-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          {searchQuery ? `No documents matching "${searchQuery}"` : emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <AnimatePresence initial={false}>
        {documents.map((doc) => {
          const isSelected = selectedDocuments.some((d) => d.id === doc.id)
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`flex items-center space-x-3 p-2.5 rounded-md cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-primary"
                    : "hover:bg-accent/50 border-l-2 border-transparent"
                }`}
                onClick={() => onToggle(doc)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(doc)}
                  className={isSelected ? "border-primary" : ""}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {doc.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{doc.category.toUpperCase()}</p>
                      </div>
                    )}
                  </div>
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
  onToggleProject: (project: Project) => void
  isProjectFullySelected: (project: Project) => boolean
  isProjectPartiallySelected: (project: Project) => boolean
  expandedProjects: string[]
  toggleProjectExpand: (projectId: string) => void
  emptyMessage: string
  searchQuery: string
}

function ProjectList({
  projects,
  selectedDocuments,
  onToggleDocument,
  onToggleProject,
  isProjectFullySelected,
  isProjectPartiallySelected,
  expandedProjects,
  toggleProjectExpand,
  emptyMessage,
  searchQuery,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="bg-muted/50 rounded-full p-3 mb-3">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          {searchQuery ? `No projects matching "${searchQuery}"` : emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {projects.map((project) => {
          const isFullySelected = isProjectFullySelected(project)
          const isPartiallySelected = isProjectPartiallySelected(project)
          const isExpanded = project.id ? expandedProjects.includes(project.id) : false

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border rounded-md overflow-hidden"
            >
              <Collapsible open={isExpanded} onOpenChange={() => project.id && toggleProjectExpand(project.id)}>
                <div
                  className={`flex items-center p-3 cursor-pointer transition-colors ${
                    isFullySelected
                      ? "bg-primary/10 hover:bg-primary/15"
                      : isPartiallySelected
                        ? "bg-secondary/50 hover:bg-secondary/70"
                        : "hover:bg-accent/50"
                  }`}
                  onClick={() => onToggleProject(project)}
                >
                  <Checkbox
                    checked={isFullySelected}
                    data-indeterminate={isPartiallySelected}
                    onCheckedChange={() => onToggleProject(project)}
                    className={isFullySelected ? "border-primary" : ""}
                  />
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <p className="text-sm font-medium truncate">{project.name}</p>
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="mr-2">
                    <Layers className="h-3 w-3 mr-1" />
                    {project.documents?.length}
                  </Badge>
                  <CollapsibleTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="pl-6 pr-3 pb-2 pt-1 bg-background/50">
                    {project.documents?.map((doc) => {
                      const isSelected = selectedDocuments.some((d) => d.id === doc.id)
                      return (
                        <div
                          key={doc.id}
                          className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors mt-1 ${
                            isSelected
                              ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                              : "hover:bg-accent/30 border-l-2 border-transparent"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleDocument(doc)
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleDocument(doc)}
                            className={isSelected ? "border-primary" : ""}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <p className="text-sm truncate">{doc.name}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
