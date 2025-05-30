"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { SustainabilityLibrary } from "./sustainability-library"
import type { PublicDocumentCategory } from "@/types/categories"

interface SustainabilityLibraryWrapperProps {
  documents: any[]
  categories: PublicDocumentCategory[]
}

export function SustainabilityLibraryWrapper({
  documents,
  categories,
}: SustainabilityLibraryWrapperProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [initialCategory, setInitialCategory] = useState<PublicDocumentCategory | undefined>(undefined)

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam as PublicDocumentCategory)) {
      setInitialCategory(categoryParam as PublicDocumentCategory)
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

      <SustainabilityLibrary
        categories={categories}
        initialCategory={initialCategory}
      />
    </div>
  )
}
