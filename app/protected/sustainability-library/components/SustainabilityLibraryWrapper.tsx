"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { SustainabilityLibrary } from "./sustainability-library"

interface SustainabilityLibraryWrapperProps {
  documents: any[]
  categories: string[]
}

export function SustainabilityLibraryWrapper({ documents, categories }: SustainabilityLibraryWrapperProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [initialCategory, setInitialCategory] = useState<string | null>(null)

  // Set category filter from URL if valid
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setInitialCategory(categoryParam)
    }
  }, [categoryParam, categories])

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sustainability Library</h1>
        <p className="text-muted-foreground">
          Explore our collection of sustainability resources and documents.
        </p>
        {initialCategory && (
          <p className="text-primary">
            Showing results for <strong>{initialCategory}</strong>
          </p>
        )}
      </div>

      {/* Document List */}
      <SustainabilityLibrary
        initialDocuments={documents}
        categories={categories}
        initialCategory={initialCategory}
      />
    </div>
  )
}
