import { createClient } from "@/utils/supabase/client"
import { SustainabilityLibrary } from "../components/sustainability-library"
import {
  PUBLIC_DOCUMENT_CATEGORIES,
  PublicDocumentCategory,
} from "../../../../types/categories"

interface CategoryPageProps {
  params: { category: string }
}

function isValidCategory(value: string | null): value is PublicDocumentCategory {
  return PUBLIC_DOCUMENT_CATEGORIES.includes(value as PublicDocumentCategory)
}

export default async function CategoryPage({ params }: { params: Promise<CategoryPageProps["params"]> }) {
  const { category } = await params
  const selectedCategory = isValidCategory(category) ? category : undefined

  const supabase = createClient()

  const { data: categoriesData, error } = await supabase
    .from("public_documents")
    .select("category")

  if (error) console.error("Error fetching categories:", error.message)

  const rawCategories = categoriesData?.map((c) => c.category).filter(Boolean) || []
  const filteredCategories = Array.from(new Set(rawCategories)) as PublicDocumentCategory[]

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {selectedCategory ? `${selectedCategory} Documents` : "All Documents"}
        </h1>
        <p className="text-muted-foreground">
          {selectedCategory
            ? `Showing all sustainability documents under ${selectedCategory} category.`
            : "Showing all available sustainability documents."}
        </p>
      </div>

      <SustainabilityLibrary
        categories={filteredCategories}
        initialCategory={selectedCategory}
      />
    </div>
  )
}
