import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { IntegratedLibrary } from "./components/integrated-library"
import { BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MyLibraryPage() {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user is logged in, redirect to login page
  if (!user) {
    redirect("/sign-in")
  }

  // Fetch user's documents
  console.log("📁 Fetching documents for user:", user.id)

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
      <p className="text-muted-foreground mb-8">Manage your personal documents and projects</p>
      <IntegratedLibrary documents={userDocuments || []} userId={user.id} initialLimit={INITIAL_PAGE_SIZE} />
    </div>
  )
}
