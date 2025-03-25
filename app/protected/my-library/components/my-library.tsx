"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DocumentCard } from "./document-card"
import { DocumentFilters } from "./document-filters"
import { UploadDocumentDialog } from "./upload-documents"
import { Search, Plus } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Document {
  id: string
  name: string
  description?: string
  category?: string
  created_at: string
  file_url?: string
  file_type?: string
  file_path: string
  user_id: string
  [key: string]: any
}

interface MyLibraryProps {
  documents: Document[]
  userId: string
  initialLimit: number
}


export function MyLibrary({ documents, userId, initialLimit }: MyLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [libraryDocuments, setLibraryDocuments] = useState<Document[]>(documents)
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const supabase = createClient();
    const from = page * initialLimit;
    const to = from + initialLimit - 1;
  
    const { data: moreDocs, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);
  
    if (moreDocs && moreDocs.length > 0) {
      setLibraryDocuments(prev => [...prev, ...moreDocs]);
      setPage(prev => prev + 1);
    }
  
    setIsLoadingMore(false);
  };
  

  // Extract unique categories from documents
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    libraryDocuments.forEach((doc) => {
      if (doc.category) {
        uniqueCategories.add(doc.category)
      }
    })
    return Array.from(uniqueCategories)
  }, [libraryDocuments])

  // Filter documents based on search query and selected category
  const filteredDocuments = useMemo(() => {
    return libraryDocuments.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        (doc.name && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || doc.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [libraryDocuments, searchQuery, selectedCategory])

  // Handle successful document upload
  const handleDocumentUploaded = (newDocument: Document) => {
    setLibraryDocuments((prev) => [newDocument, ...prev])
    setIsUploadDialogOpen(false)
  }

  // Handle document deletion
  const handleDocumentDeleted = (documentId: string) => {
    setLibraryDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <DocumentFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No documents found</h3>
          {libraryDocuments.length === 0 ? (
            <div className="mt-2">
              <p className="text-muted-foreground">Upload your first document to get started</p>
              <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              {(searchQuery || selectedCategory) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={handleDocumentDeleted} isOwner={true} />
          ))}
        {filteredDocuments.length < libraryDocuments.length && (
          <div className="text-center mt-6">
            <Button onClick={handleLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
        </div>
        
      )}

      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onDocumentUploaded={handleDocumentUploaded}
      />
    </div>
  )
}

