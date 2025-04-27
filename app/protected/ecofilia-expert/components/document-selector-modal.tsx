"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FolderOpen, X, FileText, BookOpen, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import type { Document, Project } from "@/models"
import { usePublicDocuments } from "@/hooks/usePublicDocuments"
import { DocumentList, ProjectList } from "./DocumentLists"

interface DocumentSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  personalDocuments: Document[]
  projects?: Project[]
  selectedDocuments: Document[]
  onDocumentsSelected: (documents: Document[]) => void
}

export function DocumentSelectorModal({
  isOpen,
  onClose,
  personalDocuments,
  projects = [],
  selectedDocuments,
  onDocumentsSelected,
}: DocumentSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [localSelectedDocs, setLocalSelectedDocs] = useState<Document[]>(selectedDocuments)

  const { documents: publicDocuments, loading } = usePublicDocuments({
    search: activeTab === "public" ? searchQuery : "",
  })

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedDocs(selectedDocuments)
      setSearchQuery("")
    }
  }, [isOpen, selectedDocuments])

  const toggleDocumentSelection = (document: Document, type: "user" | "public" | "project") => {
    const isSelected = localSelectedDocs.some((doc) => doc.id === document.id)
    const docWithType = { ...document, type }

    setLocalSelectedDocs(
      isSelected
        ? localSelectedDocs.filter((doc) => doc.id !== document.id)
        : [...localSelectedDocs, docWithType],
    )
  }

  const handleApply = () => {
    onDocumentsSelected(localSelectedDocs)
    onClose()
  }

  const filteredPersonalDocs = personalDocuments.filter((doc) =>
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.documents ?? []).some((doc) => doc.name?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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

        {localSelectedDocs.length > 0 && (
          <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md mt-2">
            <span className="text-xs">
              {localSelectedDocs.length} selected
            </span>
            <Button variant="ghost" size="sm" onClick={() => setLocalSelectedDocs([])}>
              Clear
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-auto mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="personal">
              <FileText className="h-4 w-4 mr-2" />My Library
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Briefcase className="h-4 w-4 mr-2" />Projects
            </TabsTrigger>
            <TabsTrigger value="public">
              <BookOpen className="h-4 w-4 mr-2" />Public
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
                selectedDocuments={localSelectedDocs}
                onToggleDocument={(doc) => toggleDocumentSelection(doc, "project")}
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
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleApply} disabled={localSelectedDocs.length === 0}>Apply</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
