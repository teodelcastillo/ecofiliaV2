import { createClient } from "@/utils/supabase/server"
import { SustainabilityLibrary } from "../components/sustainability-library"

type Props = {
  params: { category: string }
}

export default async function CategoryPage({ params }: Props) {
  const supabase = await createClient()

  const { data: documents } = await supabase.from("public_documents").select()
  const { data: categories } = await supabase.from("public_documents").select("category")
  const rawCategories = categories?.map(c => c.category).filter(Boolean) || []
  const filteredCategories = Array.from(new Set(rawCategories))

  const selectedCategory = params.category === "all" ? null : params.category

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
        documents={documents || []}
        categories={filteredCategories}
        initialCategory={selectedCategory}
      />
    </div>
  )
}
