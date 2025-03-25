import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { MyLibrary } from "./components/my-library"

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
  const { data: userDocuments } = await supabase
    .from("documents")
    .select("id, name, description, category, created_at, file_path, file_type, user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">My Library</h1>
      <p className="text-muted-foreground mb-8">Manage your personal documents and projects</p>
      <MyLibrary documents={userDocuments || []} userId={user.id} />
    </div>
  )
}

