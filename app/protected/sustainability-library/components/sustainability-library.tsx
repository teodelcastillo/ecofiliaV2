"use client"

import { useState, useMemo } from "react"
import { DocumentCard } from "./document-card"
import { DocumentFilters } from "./document-filters"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SustainabilityLibraryProps {
  documents: any[]
  categories: string[]
  initialCategory?: string | null
}

export function SustainabilityLibrary({ documents, categories, initialCategory = null }: SustainabilityLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter documents based on search query and category
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  )
}
