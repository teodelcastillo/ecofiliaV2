"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, FolderOpen, X, BookOpen, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { Document } from "@/models"
import { usePublicDocuments } from "@/hooks/usePublicDocuments"
import { useUserProjects } from "@/hooks/useUserProjects"

interface DocumentSelectorProps {
  personalDocuments: Document[]
  onDocumentsSelected: (documents: Document[]) => void
  selectedDocuments: Document[]
}

export function DocumentSelector({
  personalDocuments,
  onDocumentsSelected,
  selectedDocuments,
}: DocumentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("personal")

  const { documents: publicDocuments, loading: loadingPublic } = usePublicDocuments({
    search: activeTab === "public" ? searchQuery : "",
  })

  const { projects, loading: loadingProjects } = useUserProjects()

  const clearSelection = () => onDocumentsSelected([])

  const toggleDocumentSelection = (document: Document, type: "user" | "public" | "project") => {
    const isSelected = selectedDocuments.some((doc) => doc.id === document.id)
    const docWithType = { ...document, type }
    onDocumentsSelected(
      isSelected
        ? selectedDocuments.filter((doc) => doc.id !== document.id)
        : [...selectedDocuments, docWithType]
    )
  }

  const filterLocalDocs = (docs: Document[]) =>
    docs.filter((doc) => doc.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    setSearchQuery("")
  }, [activeTab])

  return (
    <Card className="h-[calc(100vh-12rem)] shadow-md border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Documents
          </CardTitle>
          {selectedDocuments.length > 0 && (
            <Badge variant="secondary">{selectedDocuments.length} selected</Badge>
          )}
        </div>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => setSearchQuery("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          {selectedDocuments.length === 0 ? (
            <span className="text-xs text-muted-foreground">No documents selected</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {selectedDocuments.length} {selectedDocuments.length === 1 ? "document" : "documents"} selected
            </span>
          )}
          {selectedDocuments.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
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

          {/* Personal Documents */}
          <TabsContent value="personal">
            <ScrollArea className="h-[calc(100vh-25rem)]">
              <DocumentList
                documents={filterLocalDocs(personalDocuments)}
                selectedDocuments={selectedDocuments}
                onToggle={(doc) => toggleDocumentSelection(doc, "user")}
                emptyMessage="No personal documents found"
              />
            </ScrollArea>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects">
            <ScrollArea className="h-[calc(100vh-25rem)]">
              {loadingProjects ? (
                <p className="text-center text-muted-foreground py-4">Loading projects...</p>
              ) : projects.length ? (
                projects.map((project) => (
                  <div key={project.id} className="border-b py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{project.name}</span>
                    </div>
                    <DocumentList
                      documents={filterLocalDocs(project.documents ?? [])}
                      selectedDocuments={selectedDocuments}
                      onToggle={(doc) => toggleDocumentSelection(doc, "project")}
                      emptyMessage="No documents"
                    />
                  </div>
                ))
              ) : (
                <EmptyState message="No projects found" icon={Briefcase} />
              )}
            </ScrollArea>
          </TabsContent>

          {/* Public */}
          <TabsContent value="public">
            <ScrollArea className="h-[calc(100vh-25rem)]">
              {loadingPublic ? (
                <p className="text-center text-muted-foreground py-4">Loading public documents...</p>
              ) : (
                <DocumentList
                  documents={publicDocuments}
                  selectedDocuments={selectedDocuments}
                  onToggle={(doc) => toggleDocumentSelection(doc, "public")}
                  emptyMessage="No public documents found"
                />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// 🧱 Reutilizables
interface DocumentListProps {
  documents: Document[]
  selectedDocuments: Document[]
  onToggle: (document: Document) => void
  emptyMessage: string
}

function DocumentList({ documents, selectedDocuments, onToggle, emptyMessage }: DocumentListProps) {
  if (!documents.length) return <EmptyState message={emptyMessage} icon={FileText} />

  return (
    <AnimatePresence>
      {documents.map((doc) => {
        const isSelected = selectedDocuments.some((d) => d.id === doc.id)
        return (
          <motion.div key={doc.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              onClick={() => onToggle(doc)}
              className={`flex gap-2 items-center cursor-pointer p-2 ${
                isSelected ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
            >
              <Checkbox checked={isSelected} />
              <span className="truncate">{doc.name}</span>
            </div>
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}

interface EmptyStateProps {
  message: string
  icon: React.ElementType
}

const EmptyState = ({ message, icon: Icon }: EmptyStateProps) => (
  <div className="text-center py-8">
    <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
    <p className="text-muted-foreground">{message}</p>
  </div>
)
