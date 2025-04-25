
import { IntegratedLibrary } from "./components/integrated-library"
import { BookOpen } from "lucide-react"
import { requireUser } from "@/lib/require-user"
export const dynamic = "force-dynamic"

export default async function MyLibraryPage() {
  const { user, supabase } = await requireUser()

  // Fetch user's documents
  const INITIAL_PAGE_SIZE = 10

  const { data: userDocuments, error } = await supabase
    .from("documents")
    .select("id, name, file_path, created_at, user_id, category, description")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, INITIAL_PAGE_SIZE - 1)

  if (error) {
    console.error("❌ Error fetching documents:", error.message)
  }

  console.log("✅ Documents fetched:", userDocuments?.length)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">My Library</h1>
      </div>
      <p className="text-muted-foreground mb-8">Your centralized space to organize sustainability initiatives and unlock AI-powered insights, reporting, and collaboration. <br/>Upload and manage your own sustainability documents to power personalized insights and strategies with Ecofilia.</p>
      <IntegratedLibrary documents={userDocuments || []} userId={user.id} initialLimit={INITIAL_PAGE_SIZE} />
    </div>
  )
}
