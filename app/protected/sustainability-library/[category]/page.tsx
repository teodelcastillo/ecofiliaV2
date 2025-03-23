import { createClient } from "@/utils/supabase/server"
import { SustainabilityLibrary } from "../components/sustainability-library"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createClient()

  // Get all documents
  const { data: documents } = await supabase.from("public_documents").select()

  // Get categories (remove duplicates)
  const { data: categories } = await supabase.from("public_documents").select("category")
  const rawCategories = categories?.map(c => c.category).filter(Boolean) || []
  const filteredCategories = Array.from(new Set(rawCategories))

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{params.category} Documents</h1>
        <p className="text-muted-foreground">
          Showing all sustainability documents under <strong>{params.category}</strong> category.
        </p>
      </div>

      <SustainabilityLibrary
        documents={documents || []}
        categories={filteredCategories}
        initialCategory={params.category}
      />
    </div>
  )
}
