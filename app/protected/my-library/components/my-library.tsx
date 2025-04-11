"use client"

import { useState, useEffect } from "react"
import { DocumentCard } from "./document-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, Upload, FileText } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UploadDocumentForm } from "./upload-document-form"
import { motion, AnimatePresence } from "framer-motion"
import { Document } from "@/models"

interface MyLibraryProps {
  documents: Document[]
  userId: string
  initialLimit: number
}

export function MyLibrary({ documents: initialDocuments, userId, initialLimit }: MyLibraryProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(initialDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialDocuments.length >= initialLimit)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>(["All"])

  const supabase = createClient()
  const { toast } = useToast()

  // Extract unique categories from documents
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(documents.map((doc) => doc.category).filter(Boolean))) as string[]
    setCategories(["All", ...uniqueCategories])
  }, [documents])

  // Filter documents based on search query and category
  useEffect(() => {
    let filtered = documents

    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, selectedCategory])

  const loadMoreDocuments = async () => {
    setIsLoading(true)
    const nextPage = page + 1
    const from = nextPage * initialLimit - initialLimit
    const to = nextPage * initialLimit - 1

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("id, name, file_path, created_at, user_id, category, description")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error

      if (data && data.length > 0) {
        setDocuments((prev) => [...prev, ...data])
        setPage(nextPage)
        setHasMore(data.length >= initialLimit)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more documents:", error)
      toast({
        title: "Error",
        description: "Failed to load more documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentUploaded = (newDocument: Document) => {
    setDocuments((prev) => [newDocument, ...prev])
    setIsUploadDialogOpen(false)
    toast({
      title: "Document uploaded",
      description: "Your document has been successfully uploaded.",
    })
  }

  const handleDocumentDeleted = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Documents</h2>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

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
              Category: {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence mode="wait">
        {filteredDocuments.length === 0 ? (
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
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Upload your first document to get started"}
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredDocuments.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <DocumentCard document={document} onDelete={handleDocumentDeleted} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button onClick={loadMoreDocuments} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to your library.</DialogDescription>
          </DialogHeader>
          <UploadDocumentForm userId={userId} onSuccess={handleDocumentUploaded} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
