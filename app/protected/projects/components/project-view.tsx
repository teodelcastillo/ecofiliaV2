"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Filter, Search, Grid, List, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DocumentCard } from "../../my-library/components/document-card"
import type { Project } from "@/models"
import { createClient } from "@/utils/supabase/client"
import { LinkDocumentsBadge } from "./link-documents-badge"
import { motion, AnimatePresence } from "framer-motion"

const documentTypes = ["All", "pdf", "docx", "xlsx", "pptx"]
const sortOptions = ["Name (A-Z)", "Name (Z-A)", "Date (Newest)", "Date (Oldest)"]

interface ProjectViewProps {
  project: Project
  onBack?: () => void
  className?: string
}

export function ProjectView({ project, onBack, className = "" }: ProjectViewProps) {
  const router = useRouter()
  const supabase = createClient()
  const [documents, setDocuments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [sortBy, setSortBy] = useState("Date (Newest)")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(false)

  const fetchProjectDocuments = useCallback(async () => {
    console.log("Fetching project documents for:", project.id)
    setLoading(true)

    const { data: projectLinks, error } = await supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", project.id)

    if (error) {
      console.error("Error fetching project documents:", error.message)
      setLoading(false)
      return
    }

    console.log("Project links found:", projectLinks)

    const userDocIds = projectLinks.filter((link) => link.document_id).map((link) => link.document_id)
    const publicDocIds = projectLinks.filter((link) => link.public_document_id).map((link) => link.public_document_id)

    const [userDocsResp, publicDocsResp] = await Promise.all([
      userDocIds.length > 0
        ? supabase.from("documents").select("*").in("id", userDocIds)
        : Promise.resolve({ data: [] }),
      publicDocIds.length > 0
        ? supabase.from("public_documents").select("*").in("id", publicDocIds)
        : Promise.resolve({ data: [] }),
    ])

    // Add fallback just in case
    if (!userDocsResp || !publicDocsResp) {
      console.error("Failed to load documents properly")
      setLoading(false)
      return
    }

    // format + set
    const formatType = (path: string | null | undefined) => path?.split(".").pop()?.toLowerCase().trim() || "pdf"

    const formattedUserDocs = (userDocsResp.data ?? []).map((doc) => ({
      id: doc.id,
      name: doc.name || "Untitled Document",
      description: doc.description || "",
      category: doc.category || "",
      created_at: doc.created_at,
      file_path: doc.file_path,
      file_type: formatType(doc.file_path),
      user_id: doc.user_id,
    }))

    const formattedPublicDocs = (publicDocsResp.data ?? []).map((doc) => ({
      id: doc.id,
      name: doc.name || "Untitled Document",
      description: doc.description || "",
      category: doc.category || "Public",
      created_at: doc.created_at,
      file_path: doc.file_url,
      file_type: formatType(doc.file_url),
      user_id: "public",
    }))

    setDocuments([...formattedUserDocs, ...formattedPublicDocs])
    setLoading(false)
  }, [project.id, supabase])

  useEffect(() => {
    fetchProjectDocuments()
  }, [fetchProjectDocuments])

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

  const handleBack = () => {
    onBack ? onBack() : router.back()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-sm text-muted-foreground">
            {project.category} {project.client && `• ${project.client}`}
          </p>
        </div>
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
          {project.id && (
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => router.push(`/protected/reports/${project.id}`)}
            >
              <FileText className="h-4 w-4" />
              View Reports
            </Button>
          )}
        </div>
        <LinkDocumentsBadge projectId={project.id} onDocumentsLinked={fetchProjectDocuments} />
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
            <Button variant="outline" className="w-full sm:w-auto">
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
            <Button variant="outline" className="w-full sm:w-auto">
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

      {/* Content */}
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
  )
}
