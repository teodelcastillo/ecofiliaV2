import { createClient } from "@/utils/supabase/server";
import { SustainabilityLibrary } from "./components/sustainability-library";

export default async function Page() {
  const supabase = await createClient();
  const { data: documents } = await supabase.from("public_documents").select();
  const { data: categories } = await supabase
  .from("public_documents")
  .select("category");

const filteredCategories = categories?.map(c => c.category).filter(Boolean) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Sustainability Library</h1>
      <p className="text-muted-foreground mb-8">Explore our collection of sustainability resources and documents</p>
      <SustainabilityLibrary documents={documents || []} categories={filteredCategories|| []} />
    </div>
  );
}