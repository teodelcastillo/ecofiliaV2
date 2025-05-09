"use client"

import { useState } from "react"
import { usePublicDocuments } from "@/hooks/usePublicDocuments"
import { DocumentCard } from "./document-card"
import { DocumentFilters } from "./document-filters"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PUBLIC_DOCUMENT_CATEGORIES, type PublicDocumentCategory } from "../../../../types/categories"

interface SustainabilityLibraryProps {
  categories: PublicDocumentCategory[]
  initialCategory?: PublicDocumentCategory
}

export function SustainabilityLibrary({ initialCategory = undefined }: SustainabilityLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PublicDocumentCategory | null>(
    initialCategory as PublicDocumentCategory | null,
  )
  const [page, setPage] = useState(0)

  const { documents, loading, hasMore, totalCount } = usePublicDocuments({
    category: selectedCategory,
    search: searchQuery,
    page,
    pageSize: 10,
  })

  const handleLoadMore = () => setPage((prev) => prev + 1)

  const handleClear = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setPage(0)
  }

  const currentCount = documents.length

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(0)
            }}
            className="pl-10"
          />
        </div>
        <DocumentFilters
          categories={[...PUBLIC_DOCUMENT_CATEGORIES]}
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => {
            setSelectedCategory(c)
            setPage(0)
          }}
        />
        {(searchQuery || selectedCategory) && (
          <Button variant="outline" onClick={handleClear}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Document Count */}
      {!loading && documents.length > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {currentCount} document{currentCount !== 1 ? "s" : ""}{" "}
          {totalCount !== undefined ? `from ${totalCount} total` : ""}
        </div>
      )}

      {/* Document Grid */}
      {documents.length === 0 && !loading ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-6">
        <div className="text-sm text-muted-foreground mb-4">
          Showing {currentCount} document{currentCount !== 1 ? "s" : ""}{" "}
          {totalCount !== undefined ? `from ${totalCount} total` : ""}
        </div>
              <Button onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
