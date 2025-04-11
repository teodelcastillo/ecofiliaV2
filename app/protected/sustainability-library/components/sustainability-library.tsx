"use client"

import { useState, useMemo } from "react"
import { DocumentCard } from "./document-card"
import { DocumentFilters } from "./document-filters"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

interface SustainabilityLibraryProps {
  initialDocuments: any[]
  categories: string[]
  initialCategory?: string | null
}

export function SustainabilityLibrary({
  initialDocuments,
  categories,
  initialCategory = null,
}: SustainabilityLibraryProps) {
  const supabase = createClient()
  const [documents, setDocuments] = useState(initialDocuments)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")

  const PAGE_SIZE = 10

  const loadMoreDocuments = async () => {
    setLoadingMore(true)
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data: moreDocs, error } = await supabase
      .from("public_documents")
      .select("id, name, category, created_at, file_url")
      .range(from, to)

    if (error) console.error("Error loading more:", error.message)

    if (moreDocs && moreDocs.length > 0) {
      setDocuments((prev) => {
        const allDocs = [...prev, ...moreDocs]
        const uniqueDocs = Array.from(new Map(allDocs.map((doc) => [doc.id, doc])).values())
        return uniqueDocs
      })
      setPage((prev) => prev + 1)
    }

    setLoadingMore(false)
  }

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        (doc.name && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || doc.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [documents, searchQuery, selectedCategory])

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DocumentFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {(searchQuery || selectedCategory) && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory(null)
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Button onClick={loadMoreDocuments} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
