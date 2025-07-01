"use client"

import { useState } from "react"
import { Filter, Search, Grid, List, FileText, Plus, Calendar, Layers, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DocumentCard } from "../../../my-library/components/document-card"
import { LinkDocumentsBadge } from "../link-documents-badge"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import type { Project } from "@/models"

const documentTypes = ["All", "pdf", "docx", "xlsx", "pptx"]
const sortOptions = ["Name (A-Z)", "Name (Z-A)", "Date (Newest)", "Date (Oldest)"]

interface ProjectOverviewProps {
  project: Project
  documents: any[]
  loading: boolean
  onDocumentsRefresh: () => void
}

export function ProjectOverview({ project, documents, loading, onDocumentsRefresh }: ProjectOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [sortBy, setSortBy] = useState("Date (Newest)")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "All" || doc.file_type === selectedType
    return matchesSearch && matchesType
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "Name (A-Z)":
        return a.name.localeCompare(b.name)
      case "Name (Z-A)":
        return b.name.localeCompare(a.name)
      case "Date (Newest)":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "Date (Oldest)":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      default:
        return 0
    }
  })

  const documentCount = documents.length

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentCount}</div>
            <p className="text-xs text-muted-foreground">Linked to this project</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.created_at ? formatDistanceToNow(new Date(project.created_at), { addSuffix: true }) : "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground">Project creation date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline">{project.category || "Uncategorized"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Project classification</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Documents</h3>
          <LinkDocumentsBadge projectId={project.id} onDocumentsLinked={onDocumentsRefresh} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
              <Grid className={`h-4 w-4 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
              <List className={`h-4 w-4 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Type: {selectedType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {documentTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Sort: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Documents Grid/List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <p className="text-muted-foreground">Loading documents...</p>
            </motion.div>
          ) : sortedDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg"
            >
              <div className="bg-muted/50 p-3 rounded-full mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedType !== "All"
                  ? "Try adjusting your search or filters"
                  : "Add documents to this project to get started"}
              </p>
              <Button onClick={() => document.getElementById("link-documents-button")?.click()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Documents
              </Button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {sortedDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <DocumentCard document={doc} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border rounded-md divide-y"
            >
              {sortedDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-1.5 rounded-md">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.category || "No category"}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
