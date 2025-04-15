"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { DocumentCardEnhanced } from "./document-card-enhanced"
import { DocumentFilters } from "./document-filters"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { PublicDocumentCategory } from "../../../../types/categories"


interface SustainabilityLibraryProps {
  initialDocuments: any[]
  categories: PublicDocumentCategory
  initialCategory?: string | null
}

export function SustainabilityLibraryEnhanced({
  initialDocuments,
  categories,
  initialCategory = null,
}: SustainabilityLibraryProps) {
  const supabase = createClient()
  const [documents, setDocuments] = useState(initialDocuments)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<PublicDocumentCategory | null>(initialCategory as PublicDocumentCategory | null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showFilters, setShowFilters] = useState(false)

  const PAGE_SIZE = 12

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1)
    fetchDocuments()
  }, [selectedCategory, sortBy])

  const fetchDocuments = async () => {
    setIsLoading(true)

    let query = supabase
      .from("public_documents")
      .select("id, name, description, category, created_at, file_url, author")

    if (selectedCategory) {
      query = query.eq("category", selectedCategory as NonNullable<"NDCs" | "NAPs" | "LTS" | "ESG" | "IPCC" | "IPBES" | null>)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "name":
        query = query.order("name", { ascending: true })
        break
    }

    query = query.limit(PAGE_SIZE)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching documents:", error)
    } else {
      setDocuments(data || [])
    }

    setIsLoading(false)
  }

  const loadMoreDocuments = async () => {
    setLoadingMore(true)
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from("public_documents")
      .select("id, name, description, category, created_at, file_url, author")

    if (selectedCategory) {
      query = query.eq("category", selectedCategory as NonNullable<"NDCs" | "NAPs" | "LTS" | "ESG" | "IPCC" | "IPBES" | null>)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "name":
        query = query.order("name", { ascending: true })
        break
    }

    query = query.range(from, to)

    const { data: moreDocs, error } = await query

    if (error) console.error("Error loading more:", error)

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

      return matchesSearch
    })
  }, [documents, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDocuments()
  }

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>

        <AnimatePresence>
          {(showFilters || !isMobile()) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-4 pt-2 md:pt-0">
                <DocumentFilters
                  categories={Array.isArray(categories) ? categories : []}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(searchQuery || selectedCategory) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                      setSortBy("newest")
                      fetchDocuments()
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-64 w-full animate-pulse bg-muted rounded-lg"></div>
            ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <DocumentCardEnhanced document={document} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredDocuments.length >= PAGE_SIZE && (
            <div className="text-center mt-8">
              <Button onClick={loadMoreDocuments} disabled={loadingMore} size="lg">
                {loadingMore ? "Loading..." : "Load More Documents"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Helper function to check if we're on mobile
function isMobile() {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}
