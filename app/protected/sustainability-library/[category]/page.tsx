import { createClient } from "@/utils/supabase/server"
import { SustainabilityLibrary } from "../components/sustainability-library"

export default async function CategoryPage({ params }: any) {
  const supabase = await createClient()

  const selectedCategory = params.category === "all" ? null : params.category

  // Base query (always includes ordering + pagination)
  let documentQuery = supabase
    .from("public_documents")
    .select("id, name, category, created_at, file_url")
    .order("created_at", { ascending: false })
    .range(0, 15)

  // Only apply filtering if a category is selected
  if (selectedCategory) {
    documentQuery = documentQuery.eq("category", selectedCategory)
  }

  const { data: documents, error } = await documentQuery

  if (error) {
    console.error("Error fetching documents:", error.message)
  }

  // Fetch all categories for display
  const { data: categories } = await supabase
    .from("public_documents")
    .select("category")

  const rawCategories = categories?.map(c => c.category).filter(Boolean) || []
  const filteredCategories = Array.from(new Set(rawCategories))

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
        initialDocuments={documents || []}
        categories={filteredCategories}
        initialCategory={selectedCategory}
      />
    </div>
  )
}
