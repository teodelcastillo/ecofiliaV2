"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Leaf } from "lucide-react"

import { SustainabilityLibraryEnhanced } from "./sustainability-library-enhanced"
import type { PublicDocumentCategory } from "@/types/categories"

interface SustainabilityLibraryWrapperProps {
  documents: any[]
  categories: PublicDocumentCategory
}

export function SustainabilityLibraryWrapperEnhanced({
  documents,
  categories,
}: SustainabilityLibraryWrapperProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [initialCategory, setInitialCategory] = useState<PublicDocumentCategory | undefined>(undefined)

  useEffect(() => {
    if (categoryParam && typeof categoryParam === "string" && categories?.includes(categoryParam)) {
      setInitialCategory(categoryParam as PublicDocumentCategory)
    }
  }, [categoryParam, categories])

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Sustainability Library</h1>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          <p>Explore our collection of sustainability resources and documents.</p>
        </div>

        {initialCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/5 p-3 rounded-md border border-primary/20"
          >
            <p className="text-primary flex items-center gap-2">
              <span>Showing results for category:</span>
              <strong>{initialCategory}</strong>
            </p>
          </motion.div>
        )}
      </motion.div>

      <SustainabilityLibraryEnhanced
        initialDocuments={documents}
        categories={categories}
        initialCategory={initialCategory}
      />
    </div>
  )
}
