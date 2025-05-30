"use client"

import { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Search,
  FolderOpen,
  X,
  FileText,
  BookOpen,
  Briefcase,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Document } from "@/models"
import { usePublicDocuments } from "@/hooks/usePublicDocuments"
import { DocumentList } from "./DocumentLists"
import { ProjectList } from "../../projects/components/projects-list"
import { useUserProjects } from "@/hooks/useUserProjects"

interface DocumentSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  personalDocuments: Document[]
  selectedDocuments: Document[]
  onDocumentsSelected: (
    documents: (Document & { type: "user" | "public" | "project" })[]
  ) => void
  publicDocuments?: Document[]
}

export function DocumentSelectorModal({
  isOpen,
  onClose,
  personalDocuments,
  selectedDocuments,
  onDocumentsSelected,
}: DocumentSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [localSelectedDocs, setLocalSelectedDocs] = useState<
    (Document & { type: "user" | "public" | "project" })[]
  >(selectedDocuments.map(doc => ({ ...doc, type: "user" })))
  const { projects, loading: loadingProjects } = useUserProjects()
  const { documents: publicDocuments, loading } = usePublicDocuments({
    search: activeTab === "public" ? searchQuery : "",
  })

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedDocs(selectedDocuments.map(doc => ({ ...doc, type: "user" })))
      setSearchQuery("")
    }
  }, [isOpen, selectedDocuments])

  // 🔧 Toggle for individual documents
  const toggleDocumentSelection = (
    document: Document,
    type: "user" | "public" | "project"
  ) => {
    const isSelected = localSelectedDocs.some((doc) => doc.id === document.id)
    const docWithType = { ...document, type }

    setLocalSelectedDocs(
      isSelected
        ? localSelectedDocs.filter((doc) => doc.id !== document.id)
        : [...localSelectedDocs, docWithType]
    )
  }

  // 🔧 Toggle for entire project (adds/removes all its documents)
  const toggleProjectSelection = (project: { documents?: Document[] }) => {
    const projectDocIds = project.documents?.map((d) => d.id) ?? []
    const alreadySelected = projectDocIds.every((id) =>
      localSelectedDocs.some((doc) => doc.id === id)
    )

    if (alreadySelected) {
      // Deselect all project documents
      setLocalSelectedDocs((prev) =>
        prev.filter((doc) => !projectDocIds.includes(doc.id))
      )
    } else {
      const newDocs = (project.documents ?? []).map((doc) => ({
        ...doc,
        type: "project" as const,
      }))
      const existingIds = new Set(localSelectedDocs.map((doc) => doc.id))
      const combined = [...localSelectedDocs, ...newDocs.filter((d) => !existingIds.has(d.id))]
      setLocalSelectedDocs(combined)
    }
  }

  const handleApply = () => {
    onDocumentsSelected(localSelectedDocs)
    onClose()
  }

  const filteredPersonalDocs = personalDocuments.filter((doc) =>
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.documents ?? []).some((doc) =>
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const clearSelection = () => setLocalSelectedDocs([])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Select Documents
          </DialogTitle>
          <DialogDescription>Select documents to chat with</DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents or projects..."
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-2 flex justify-between items-center bg-secondary/50 p-2 rounded-md">
          <span className="text-xs text-muted-foreground">
            {localSelectedDocs.length === 0
              ? "No documents selected"
              : `${localSelectedDocs.length} ${
                  localSelectedDocs.length === 1 ? "document" : "documents"
                } selected`}
          </span>
          {localSelectedDocs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-auto mt-2"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="personal">
              <FileText className="h-4 w-4 mr-2" />
              My Library
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Briefcase className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="public">
              <BookOpen className="h-4 w-4 mr-2" />
              Public
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="h-[35vh]">
            <ScrollArea className="h-full">
              <DocumentList
                documents={filteredPersonalDocs}
                selectedDocuments={localSelectedDocs}
                onToggle={(doc) => toggleDocumentSelection(doc, "user")}
                emptyMessage="No personal documents found"
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="projects" className="h-[35vh]">
            <ScrollArea className="h-full">
              <ProjectList
                projects={filteredProjects}
                selectedDocumentIds={localSelectedDocs.map((doc) => doc.id).filter((id): id is string => id !== null)}
                onToggleProject={toggleProjectSelection}
                emptyMessage="No projects found"
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="public" className="h-[35vh]">
            <ScrollArea className="h-full">
              {loading ? (
                <p className="text-center py-4">Loading...</p>
              ) : (
                <DocumentList
                  documents={publicDocuments}
                  selectedDocuments={localSelectedDocs}
                  onToggle={(doc) => toggleDocumentSelection(doc, "public")}
                  emptyMessage="No public documents found"
                />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <span className="text-sm text-muted-foreground">
            {localSelectedDocs.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
